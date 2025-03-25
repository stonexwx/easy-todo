use rusqlite::{Connection, Result, params};
use std::fs;
use std::sync::{Arc, Mutex};
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager, Runtime};
use log::{info, error, debug, warn, trace};

use crate::error::{AppResult, AppError};

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    // 初始化数据库
    pub fn new(app_handle: &AppHandle) -> AppResult<Self> {
        debug!("初始化数据库连接");
        // 确保数据目录存在
        let app_dir = app_handle.path().app_data_dir()
            .map_err(|e| {
                error!("获取应用数据目录失败: {}", e);
                AppError::Tauri(e.to_string())
            })?;
        
        trace!("应用数据目录: {:?}", app_dir);
        fs::create_dir_all(&app_dir)
            .map_err(|e| {
                error!("创建数据目录失败: {}", e);
                AppError::Io(e)
            })?;
        
        let db_path = app_dir.join("todos.sqlite");
        info!("数据库路径: {:?}", db_path);
        
        let conn = Connection::open(&db_path)
            .map_err(|e| {
                error!("打开数据库连接失败: {}", e);
                AppError::Database(e)
            })?;
        
        // 创建todo表
        conn.execute(
            "CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                priority TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )",
            [],
        ).map_err(|e| {
            error!("创建todos表失败: {}", e);
            AppError::Database(e)
        })?;
        
        info!("数据库初始化成功");
        Ok(Self {
            conn: Mutex::new(conn),
        })
    }
    
    // 获取所有Todos
    pub fn get_all_todos(&self) -> AppResult<Vec<crate::todo::TodoItem>> {
        debug!("获取所有Todo项");
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Unknown(format!("获取数据库锁失败: {}", e))
        })?;
        
        let mut stmt = conn.prepare(
            "SELECT id, title, completed, priority, created_at FROM todos ORDER BY created_at DESC"
        ).map_err(AppError::Database)?;
        
        let todos_iter = stmt.query_map([], |row| {
            Ok(crate::todo::TodoItem {
                id: row.get(0)?,
                title: row.get(1)?,
                completed: row.get::<_, i64>(2)? != 0,
                priority: row.get(3)?,
                created_at: row.get::<_, u64>(4)?,
            })
        }).map_err(AppError::Database)?;
        
        let mut todos = Vec::new();
        for todo in todos_iter {
            todos.push(todo.map_err(AppError::Database)?);
        }
        
        trace!("获取到 {} 个Todo项", todos.len());
        Ok(todos)
    }
    
    // 创建新的Todo
    pub fn create_todo(&self, title: &str, priority: &str) -> AppResult<Vec<crate::todo::TodoItem>> {
        if title.trim().is_empty() {
            warn!("尝试创建标题为空的Todo项");
            return Err(AppError::InvalidArgument("标题不能为空".to_string()));
        }
        
        info!("创建新Todo: title={}, priority={}", title, priority);
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Unknown(format!("获取数据库锁失败: {}", e))
        })?;
        
        let id = uuid::Uuid::new_v4().to_string();
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(AppError::SystemTime)?
            .as_secs();
        
        conn.execute(
            "INSERT INTO todos (id, title, completed, priority, created_at) VALUES (?, ?, 0, ?, ?)",
            params![id, title, priority, now],
        ).map_err(|e| {
            error!("插入Todo记录失败: {}", e);
            AppError::Database(e)
        })?;
        
        debug!("成功创建新Todo: id={}", id);
        self.get_all_todos()
    }
    
    // 切换Todo的完成状态
    pub fn toggle_todo(&self, id: &str) -> AppResult<Vec<crate::todo::TodoItem>> {
        debug!("切换Todo完成状态: id={}", id);
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Unknown(format!("获取数据库锁失败: {}", e))
        })?;
        
        // 先获取当前状态
        let mut stmt = conn.prepare("SELECT completed FROM todos WHERE id = ?")
            .map_err(AppError::Database)?;
        
        let current_completed: Result<i64, rusqlite::Error> = stmt.query_row(params![id], |row| row.get(0));
        
        let current_completed = match current_completed {
            Ok(value) => value,
            Err(rusqlite::Error::QueryReturnedNoRows) => {
                warn!("尝试切换不存在的Todo项状态: id={}", id);
                return Err(AppError::NotFound(format!("Todo项不存在: {}", id)));
            },
            Err(e) => {
                error!("获取Todo状态失败: {}", e);
                return Err(AppError::Database(e));
            }
        };
        
        // 切换状态（0->1, 1->0）
        let new_completed = if current_completed == 0 { 1 } else { 0 };
        
        conn.execute(
            "UPDATE todos SET completed = ? WHERE id = ?",
            params![new_completed, id],
        ).map_err(|e| {
            error!("更新Todo状态失败: {}", e);
            AppError::Database(e)
        })?;
        
        info!("Todo状态已切换: id={}, completed={}", id, new_completed == 1);
        self.get_all_todos()
    }
    
    // 更新Todo的优先级
    pub fn update_priority(&self, id: &str, priority: &str) -> AppResult<Vec<crate::todo::TodoItem>> {
        debug!("更新Todo优先级: id={}, priority={}", id, priority);
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Unknown(format!("获取数据库锁失败: {}", e))
        })?;
        
        // 先检查记录是否存在
        let exists: bool = conn.query_row(
            "SELECT 1 FROM todos WHERE id = ?",
            params![id],
            |_| Ok(true)
        ).unwrap_or(false);
        
        if !exists {
            warn!("尝试更新不存在的Todo项优先级: id={}", id);
            return Err(AppError::NotFound(format!("Todo项不存在: {}", id)));
        }
        
        conn.execute(
            "UPDATE todos SET priority = ? WHERE id = ?",
            params![priority, id],
        ).map_err(|e| {
            error!("更新Todo优先级失败: {}", e);
            AppError::Database(e)
        })?;
        
        info!("Todo优先级已更新: id={}, priority={}", id, priority);
        self.get_all_todos()
    }
    
    // 删除Todo
    pub fn delete_todo(&self, id: &str) -> AppResult<Vec<crate::todo::TodoItem>> {
        debug!("删除Todo: id={}", id);
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Unknown(format!("获取数据库锁失败: {}", e))
        })?;
        
        let changes = conn.execute("DELETE FROM todos WHERE id = ?", params![id])
            .map_err(|e| {
                error!("删除Todo失败: {}", e);
                AppError::Database(e)
            })?;
        
        if changes == 0 {
            warn!("尝试删除不存在的Todo项: id={}", id);
            return Err(AppError::NotFound(format!("Todo项不存在: {}", id)));
        }
        
        info!("Todo已删除: id={}", id);
        self.get_all_todos()
    }
}

// 简化数据库的访问
pub trait AppHandleExt {
    fn db(&self) -> Arc<Database>;
}

impl<R: Runtime> AppHandleExt for AppHandle<R> {
    fn db(&self) -> Arc<Database> {
        self.state::<Arc<Database>>().inner().clone()
    }
} 