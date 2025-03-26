use std::fs::File;
use std::io::Read;
use serde::{Deserialize, Serialize};
use log::{error, info};
use tauri::{AppHandle, Manager};
use reqwest::Client;
use chrono::{Utc, DateTime};
use crate::db::AppDatabaseExt;

#[derive(Debug, Serialize, Deserialize)]
pub struct AIConfig {
    pub api_key: String,
    pub api_endpoint: String,
    pub model: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AIReport {
    pub id: String,
    pub title: String,
    pub content: String,
    pub created_at: String,
    pub period: String,
}

/// 保存AI配置到文件
#[tauri::command]
pub fn save_ai_config(
    app_handle: AppHandle,
    api_key: String,
    api_endpoint: String,
    model: String,
) -> Result<bool, String> {
    info!("保存AI配置");
    
    let config = AIConfig {
        api_key,
        api_endpoint,
        model,
    };
    
    let app_dir = app_handle.path().app_data_dir().map_err(|e| {
        error!("无法获取应用数据目录: {}", e);
        format!("无法获取应用数据目录: {}", e)
    })?;
    
    std::fs::create_dir_all(&app_dir).map_err(|e| {
        error!("无法创建应用数据目录: {}", e);
        format!("无法创建应用数据目录: {}", e)
    })?;
    
    let config_path = app_dir.join("ai_config.json");
    let config_json = serde_json::to_string(&config).map_err(|e| {
        error!("无法序列化AI配置: {}", e);
        format!("无法序列化AI配置: {}", e)
    })?;
    
    std::fs::write(&config_path, config_json).map_err(|e| {
        error!("无法写入AI配置文件: {}", e);
        format!("无法写入AI配置文件: {}", e)
    })?;
    
    info!("AI配置已保存到: {:?}", config_path);
    Ok(true)
}

/// 获取AI配置
#[tauri::command]
pub fn get_ai_config(app_handle: AppHandle) -> Result<Option<AIConfig>, String> {
    info!("获取AI配置");
    
    let app_dir = app_handle.path().app_data_dir().map_err(|e| {
        error!("无法获取应用数据目录: {}", e);
        format!("无法获取应用数据目录: {}", e)
    })?;
    
    let config_path = app_dir.join("ai_config.json");
    
    if !config_path.exists() {
        info!("AI配置文件不存在: {:?}", config_path);
        return Ok(None);
    }
    
    let mut file = File::open(&config_path).map_err(|e| {
        error!("无法打开AI配置文件: {}", e);
        format!("无法打开AI配置文件: {}", e)
    })?;
    
    let mut contents = String::new();
    file.read_to_string(&mut contents).map_err(|e| {
        error!("无法读取AI配置文件: {}", e);
        format!("无法读取AI配置文件: {}", e)
    })?;
    
    let config: AIConfig = serde_json::from_str(&contents).map_err(|e| {
        error!("无法解析AI配置: {}", e);
        format!("无法解析AI配置: {}", e)
    })?;
    
    info!("成功获取AI配置");
    Ok(Some(config))
}

/// 使用AI生成工作报告
#[tauri::command]
pub async fn generate_work_report(
    app_handle: AppHandle,
    period: String,
    custom_prompt: Option<String>,
) -> Result<AIReport, String> {
    info!("生成工作报告，类型: {}", period);
    
    let config = match get_ai_config(app_handle.clone())? {
        Some(config) => config,
        None => {
            error!("AI配置不存在");
            return Err("AI配置不存在，请先设置API密钥".to_string());
        }
    };
    
    // 获取完成的任务数据
    let db = app_handle.db();
    let todos = db.get_all_todos().map_err(|e| {
        error!("获取Todo列表失败: {}", e);
        format!("获取Todo列表失败: {}", e)
    })?;
    
    let completed_todos: Vec<_> = todos.into_iter()
        .filter(|todo| todo.completed)
        .collect();
    
    if completed_todos.is_empty() {
        return Err("没有已完成的任务可以生成报告".to_string());
    }
    
    // 构建提示词
    let default_prompt = format!(
        "根据以下已完成的任务，生成一份{}工作报告。\n\n任务列表：\n{}",
        period,
        completed_todos.iter()
            .map(|t| format!("- {} (优先级: {})", t.title, t.priority))
            .collect::<Vec<_>>()
            .join("\n")
    );
    
    let prompt = custom_prompt.unwrap_or(default_prompt);
    
    // 调用AI API
    info!("调用AI API生成报告");
    let client = Client::new();
    let response = client
        .post(&config.api_endpoint)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", config.api_key))
        .json(&serde_json::json!({
            "model": config.model,
            "messages": [
                {"role": "system", "content": "你是一个专业的工作报告生成助手。"},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 2000
        }))
        .send()
        .await
        .map_err(|e| {
            error!("AI API请求失败: {}", e);
            format!("AI API请求失败: {}", e)
        })?;
    
    if !response.status().is_success() {
        let status = response.status();
        let error_text = response.text().await.unwrap_or_else(|_| "无法获取错误详情".to_string());
        error!("AI API返回错误: {} - {}", status, error_text);
        return Err(format!("AI API返回错误: {} - {}", status, error_text));
    }
    
    let api_response = response.json::<serde_json::Value>().await.map_err(|e| {
        error!("无法解析AI API响应: {}", e);
        format!("无法解析AI API响应: {}", e)
    })?;
    
    // 从API响应中提取生成的内容
    let content = api_response
        .get("choices")
        .and_then(|choices| choices.get(0))
        .and_then(|choice| choice.get("message"))
        .and_then(|message| message.get("content"))
        .and_then(|content| content.as_str())
        .unwrap_or("无法从API响应中提取内容");
    
    // 创建报告
    let now: DateTime<Utc> = Utc::now();
    let report = AIReport {
        id: uuid::Uuid::new_v4().to_string(),
        title: format!("{}工作报告", period),
        content: content.to_string(),
        created_at: now.to_rfc3339(),
        period,
    };
    
    info!("成功生成工作报告: {}", report.title);
    Ok(report)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::todo::TodoItem;
    use uuid::Uuid;
    
    // 此测试函数仅检查报告生成的基本逻辑
    #[test]
    fn test_report_generation_logic() {
        // 创建测试数据
        let todos = vec![
            TodoItem {
                id: Uuid::new_v4().to_string(),
                title: "完成功能A".to_string(),
                priority: "important-urgent".to_string(),
                completed: true,
                created_at: Utc::now().to_rfc3339(),
            },
            TodoItem {
                id: Uuid::new_v4().to_string(),
                title: "修复Bug B".to_string(),
                priority: "not-important-urgent".to_string(),
                completed: true,
                created_at: Utc::now().to_rfc3339(),
            },
        ];
        
        // 构建提示词
        let period = "每周";
        let prompt = format!(
            "根据以下已完成的任务，生成一份{}工作报告。\n\n任务列表：\n{}",
            period,
            todos.iter()
                .map(|t| format!("- {} (优先级: {})", t.title, t.priority))
                .collect::<Vec<_>>()
                .join("\n")
        );
        
        // 验证提示词格式
        assert!(prompt.contains("每周工作报告"));
        assert!(prompt.contains("完成功能A"));
        assert!(prompt.contains("修复Bug B"));
        assert!(prompt.contains("important-urgent"));
        assert!(prompt.contains("not-important-urgent"));
    }
} 