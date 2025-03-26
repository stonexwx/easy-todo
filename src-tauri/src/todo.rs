use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use uuid::Uuid;
use chrono::Utc;
use log::{info, debug, error, warn};
use crate::db::AppDatabaseExt;

// Todo项目的数据结构
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TodoItem {
    pub id: String,
    pub title: String,
    pub priority: String,
    pub completed: bool,
    pub created_at: String,
}

// 创建新的Todo项
#[tauri::command]
pub fn create_todo(
    title: String,
    priority: String,
    app_handle: AppHandle,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: create_todo(title={}, priority={})", title, priority);
    
    // 验证输入
    if title.trim().is_empty() {
        warn!("尝试创建空标题的Todo项");
        return Err("标题不能为空".into());
    }
    
    // 验证优先级
    if !["important-urgent", "important-not-urgent", "not-important-urgent", "not-important-not-urgent"]
        .contains(&priority.as_str()) {
        warn!("尝试创建无效优先级的Todo项: {}", priority);
        return Err(format!("无效的优先级: {}", priority));
    }
    
    let todo = TodoItem {
        id: Uuid::new_v4().to_string(),
        title,
        priority,
        completed: false,
        created_at: Utc::now().to_rfc3339(),
    };
    
    info!("创建新的Todo项: {}", todo.title);
    let db = app_handle.db();
    db.create_todo(todo).map_err(|e| {
        error!("创建Todo失败: {}", e);
        e.to_string()
    })
}

// 获取所有Todo项
#[tauri::command]
pub fn get_todos(app_handle: AppHandle) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: get_todos()");
    let db = app_handle.db();
    db.get_all_todos().map_err(|e| {
        error!("获取Todos失败: {}", e);
        e.to_string()
    })
}

// 更新Todo项状态
#[tauri::command]
pub fn toggle_todo(id: String, app_handle: AppHandle) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: toggle_todo(id={})", id);
    
    // 验证ID
    if id.trim().is_empty() {
        warn!("尝试切换空ID的Todo项");
        return Err("ID不能为空".into());
    }
    
    info!("切换Todo完成状态: {}", id);
    let db = app_handle.db();
    db.toggle_todo(&id).map_err(|e| {
        error!("切换Todo状态失败: {}", e);
        e.to_string()
    })
}

// 更新Todo项优先级
#[tauri::command]
pub fn update_priority(
    id: String,
    priority: String,
    app_handle: AppHandle,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: update_priority(id={}, priority={})", id, priority);
    
    // 验证ID
    if id.trim().is_empty() {
        warn!("尝试更新空ID的Todo项");
        return Err("ID不能为空".into());
    }
    
    // 验证优先级
    if !["important-urgent", "important-not-urgent", "not-important-urgent", "not-important-not-urgent"]
        .contains(&priority.as_str()) {
        warn!("尝试设置无效优先级: {}", priority);
        return Err(format!("无效的优先级: {}", priority));
    }
    
    info!("更新Todo优先级: {}", id);
    let db = app_handle.db();
    db.update_priority(&id, &priority).map_err(|e| {
        error!("更新Todo优先级失败: {}", e);
        e.to_string()
    })
}

// 删除Todo项
#[tauri::command]
pub fn delete_todo(id: String, app_handle: AppHandle) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: delete_todo(id={})", id);
    
    // 验证ID
    if id.trim().is_empty() {
        warn!("尝试删除空ID的Todo项");
        return Err("ID不能为空".into());
    }
    
    info!("删除Todo: {}", id);
    let db = app_handle.db();
    db.delete_todo(&id).map_err(|e| {
        error!("删除Todo失败: {}", e);
        e.to_string()
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_todo_item_creation() {
        // 简化测试，只测试 TodoItem 结构
        let todo = TodoItem {
            id: Uuid::new_v4().to_string(),
            title: "测试Todo".to_string(),
            priority: "important-urgent".to_string(),
            completed: false,
            created_at: Utc::now().to_rfc3339(),
        };
        
        assert_eq!(todo.title, "测试Todo");
        assert_eq!(todo.priority, "important-urgent");
        assert_eq!(todo.completed, false);
    }
} 