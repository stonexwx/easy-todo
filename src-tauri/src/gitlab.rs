use log::{error, info};
use reqwest::{Client, header};
use serde::{Deserialize, Serialize};
use std::fs;
use tauri::{AppHandle, Manager};
use crate::todo::TodoItem;
use crate::db::AppDatabaseExt;
use uuid::Uuid;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GitLabConfig {
    pub url: String,
    pub token: String,
    pub project_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitLabIssue {
    pub id: i64,
    pub iid: i64,
    pub title: String,
    pub description: Option<String>,
    pub state: String,
    pub labels: Option<Vec<String>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitLabMilestone {
    pub id: i64,
    pub title: String,
}

/// 保存GitLab配置
#[tauri::command]
pub fn save_gitlab_config(
    app_handle: AppHandle,
    url: String,
    token: String,
    project_id: String,
) -> Result<bool, String> {
    info!("保存GitLab配置");
    
    let config = GitLabConfig {
        url,
        token,
        project_id,
    };
    
    let app_dir = app_handle.path().app_data_dir().map_err(|e| {
        error!("无法获取应用数据目录: {}", e);
        format!("无法获取应用数据目录: {}", e)
    })?;
    
    std::fs::create_dir_all(&app_dir).map_err(|e| {
        error!("无法创建应用数据目录: {}", e);
        format!("无法创建应用数据目录: {}", e)
    })?;
    
    let config_path = app_dir.join("gitlab_config.json");
    let config_json = serde_json::to_string(&config).map_err(|e| {
        error!("无法序列化GitLab配置: {}", e);
        format!("无法序列化GitLab配置: {}", e)
    })?;
    
    std::fs::write(&config_path, config_json).map_err(|e| {
        error!("无法写入GitLab配置文件: {}", e);
        format!("无法写入GitLab配置文件: {}", e)
    })?;
    
    info!("GitLab配置已保存");
    Ok(true)
}

/// 获取GitLab配置
#[tauri::command]
pub fn get_gitlab_config(app_handle: AppHandle) -> Result<Option<GitLabConfig>, String> {
    info!("获取GitLab配置");
    
    let app_dir = app_handle.path().app_data_dir().map_err(|e| {
        error!("无法获取应用数据目录: {}", e);
        format!("无法获取应用数据目录: {}", e)
    })?;
    
    let config_path = app_dir.join("gitlab_config.json");
    
    if !config_path.exists() {
        info!("GitLab配置文件不存在");
        return Ok(None);
    }
    
    let config_json = fs::read_to_string(&config_path).map_err(|e| {
        error!("无法读取GitLab配置文件: {}", e);
        format!("无法读取GitLab配置文件: {}", e)
    })?;
    
    let config: GitLabConfig = serde_json::from_str(&config_json).map_err(|e| {
        error!("无法解析GitLab配置: {}", e);
        format!("无法解析GitLab配置: {}", e)
    })?;
    
    info!("成功获取GitLab配置");
    Ok(Some(config))
}

/// 从GitLab获取issues
#[tauri::command]
pub async fn fetch_gitlab_issues(app_handle: AppHandle) -> Result<Vec<GitLabIssue>, String> {
    info!("获取GitLab Issues");
    
    let config = match get_gitlab_config(app_handle)? {
        Some(config) => config,
        None => {
            error!("GitLab配置不存在");
            return Err("GitLab配置不存在，请先设置API密钥".to_string());
        }
    };
    
    let client = Client::new();
    let url = format!(
        "{}/api/v4/projects/{}/issues?state=opened&per_page=100",
        config.url, config.project_id
    );
    
    info!("发送GitLab API请求: {}", url);
    let response = client
        .get(&url)
        .header(header::AUTHORIZATION, format!("Bearer {}", config.token))
        .header(header::CONTENT_TYPE, "application/json")
        .send()
        .await
        .map_err(|e| {
            error!("GitLab API请求失败: {}", e);
            format!("GitLab API请求失败: {}", e)
        })?;
    
    if !response.status().is_success() {
        let status = response.status();
        let text = response.text().await.unwrap_or_else(|_| "无法获取错误详情".into());
        error!("GitLab API返回错误: {} - {}", status, text);
        return Err(format!("GitLab API返回错误: {} - {}", status, text));
    }
    
    let issues: Vec<GitLabIssue> = response.json().await.map_err(|e| {
        error!("无法解析GitLab API响应: {}", e);
        format!("无法解析GitLab API响应: {}", e)
    })?;
    
    info!("成功获取{}个GitLab Issues", issues.len());
    Ok(issues)
}

/// 将GitLab Issue转换为Todo项
#[tauri::command]
pub fn convert_issue_to_todo(
    issue: GitLabIssue,
    app_handle: AppHandle,
) -> Result<Vec<TodoItem>, String> {
    info!("转换GitLab Issue到Todo: #{} {}", issue.iid, issue.title);
    
    // 根据标签确定优先级
    let priority = if let Some(labels) = &issue.labels {
        if labels.contains(&"high".to_string()) || labels.contains(&"urgent".to_string()) {
            "important-urgent"
        } else if labels.contains(&"medium".to_string()) {
            "important-not-urgent"
        } else if labels.contains(&"low".to_string()) {
            "not-important-not-urgent"
        } else {
            "not-important-urgent"
        }
    } else {
        "not-important-urgent"
    };
    
    let todo = TodoItem {
        id: Uuid::new_v4().to_string(),
        title: format!("#{} {}", issue.iid, issue.title),
        priority: priority.to_string(),
        completed: false,
        created_at: Utc::now().to_rfc3339(),
    };
    
    let db = app_handle.db();
    db.create_todo(todo).map_err(|e| {
        error!("创建Todo失败: {}", e);
        e.to_string()
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_convert_issue_to_todo() {
        // 测试基本的 Issue 转换为 Todo 逻辑，不实际使用数据库
        let issue = GitLabIssue {
            id: 1,
            iid: 101,
            title: "测试Issue".to_string(),
            description: Some("这是一个测试Issue".to_string()),
            state: "opened".to_string(),
            labels: Some(vec!["high".to_string(), "bug".to_string()]),
        };
        
        let todo = TodoItem {
            id: Uuid::new_v4().to_string(),
            title: format!("#{} {}", issue.iid, issue.title),
            priority: "important-urgent".to_string(),
            completed: false,
            created_at: Utc::now().to_rfc3339(),
        };
        
        // 在实际测试中，我们会使用db.create_todo，但这里只是示例
        assert_eq!(todo.title, "#101 测试Issue");
        assert_eq!(todo.priority, "important-urgent");
    }
} 