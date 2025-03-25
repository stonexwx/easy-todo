use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use log::{info, error, debug, warn};
use crate::db::AppHandleExt;
use crate::error::AppError;

// Todo项目的数据结构
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TodoItem {
    pub id: String,
    pub title: String,
    pub completed: bool,
    pub priority: String, // "important-urgent", "important-not-urgent", "not-important-urgent", "not-important-not-urgent"
    pub created_at: u64,
}

// 验证优先级值是否有效
fn validate_priority(priority: &str) -> Result<(), String> {
    match priority {
        "important-urgent" | "important-not-urgent" | "not-important-urgent" | "not-important-not-urgent" => Ok(()),
        _ => {
            warn!("无效的优先级值: {}", priority);
            Err(format!("无效的优先级值: {}", priority))
        }
    }
}

// 创建新的Todo项
#[tauri::command]
pub fn create_todo(
    app_handle: AppHandle,
    title: String,
    priority: String,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: create_todo(title={}, priority={})", title, priority);
    
    // 验证输入
    if title.trim().is_empty() {
        warn!("尝试创建空标题的Todo项");
        return Err("标题不能为空".to_string());
    }
    
    if let Err(e) = validate_priority(&priority) {
        return Err(e);
    }
    
    let result = app_handle.db()
        .create_todo(&title, &priority)
        .map_err(|e| {
            error!("创建Todo失败: {}", e);
            e.to_string()
        });
    
    if result.is_ok() {
        info!("成功创建Todo: title={}, priority={}", title, priority);
    }
    
    result
}

// 获取所有Todo项
#[tauri::command]
pub fn get_todos(app_handle: AppHandle) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: get_todos()");
    app_handle.db()
        .get_all_todos()
        .map_err(|e| {
            error!("获取Todos失败: {}", e);
            e.to_string()
        })
}

// 更新Todo项状态
#[tauri::command]
pub fn toggle_todo(
    app_handle: AppHandle,
    id: String,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: toggle_todo(id={})", id);
    
    if id.trim().is_empty() {
        warn!("尝试切换空ID的Todo项状态");
        return Err("ID不能为空".to_string());
    }
    
    let result = app_handle.db()
        .toggle_todo(&id)
        .map_err(|e| {
            match e {
                AppError::NotFound(msg) => {
                    warn!("切换Todo状态失败: {}", msg);
                    msg
                },
                _ => {
                    error!("切换Todo状态失败: {}", e);
                    e.to_string()
                }
            }
        });
    
    if result.is_ok() {
        info!("成功切换Todo状态: id={}", id);
    }
    
    result
}

// 更新Todo项优先级
#[tauri::command]
pub fn update_priority(
    app_handle: AppHandle,
    id: String,
    priority: String,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: update_priority(id={}, priority={})", id, priority);
    
    // 验证输入
    if id.trim().is_empty() {
        warn!("尝试更新空ID的Todo项优先级");
        return Err("ID不能为空".to_string());
    }
    
    if let Err(e) = validate_priority(&priority) {
        return Err(e);
    }
    
    let result = app_handle.db()
        .update_priority(&id, &priority)
        .map_err(|e| {
            match e {
                AppError::NotFound(msg) => {
                    warn!("更新Todo优先级失败: {}", msg);
                    msg
                },
                _ => {
                    error!("更新Todo优先级失败: {}", e);
                    e.to_string()
                }
            }
        });
    
    if result.is_ok() {
        info!("成功更新Todo优先级: id={}, priority={}", id, priority);
    }
    
    result
}

// 删除Todo项
#[tauri::command]
pub fn delete_todo(
    app_handle: AppHandle,
    id: String,
) -> Result<Vec<TodoItem>, String> {
    debug!("API调用: delete_todo(id={})", id);
    
    if id.trim().is_empty() {
        warn!("尝试删除空ID的Todo项");
        return Err("ID不能为空".to_string());
    }
    
    let result = app_handle.db()
        .delete_todo(&id)
        .map_err(|e| {
            match e {
                AppError::NotFound(msg) => {
                    warn!("删除Todo失败: {}", msg);
                    msg
                },
                _ => {
                    error!("删除Todo失败: {}", e);
                    e.to_string()
                }
            }
        });
    
    if result.is_ok() {
        info!("成功删除Todo: id={}", id);
    }
    
    result
} 