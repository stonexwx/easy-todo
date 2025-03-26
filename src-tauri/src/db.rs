use rusqlite::{Connection, params};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Manager, Runtime};
use log::{info, error, debug};
use std::path::PathBuf;

use crate::error::{AppResult, AppError};
use crate::todo::TodoItem;

pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    // 初始化数据库
    pub fn new(db_path: PathBuf) -> AppResult<Self> {
        // 检查数据库文件目录是否存在，不存在则创建
        if let Some(parent) = db_path.parent() {
            if !parent.exists() {
                std::fs::create_dir_all(parent).map_err(|e| {
                    error!("创建数据库目录失败: {}", e);
                    AppError::Io(e)
                })?;
            }
        }
        
        // 连接数据库
        info!("连接数据库: {:?}", db_path);
        let conn = Connection::open(&db_path).map_err(|e| {
            error!("数据库连接失败: {}", e);
            AppError::Database(e)
        })?;
        
        // 创建表格
        conn.execute(
            "CREATE TABLE IF NOT EXISTS todos (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                priority TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL
            )",
            [],
        )
        .map_err(|e| {
            error!("创建todos表失败: {}", e);
            AppError::Database(e)
        })?;
        
        info!("数据库初始化成功");
        Ok(Database {
            conn: Arc::new(Mutex::new(conn)),
        })
    }
    
    // 获取所有Todo项
    pub fn get_all_todos(&self) -> AppResult<Vec<TodoItem>> {
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Message(format!("获取数据库锁失败: {}", e))
        })?;
        
        let mut stmt = conn.prepare(
            "SELECT id, title, priority, completed, created_at FROM todos ORDER BY created_at DESC"
        ).map_err(|e| {
            error!("准备查询todos失败: {}", e);
            AppError::Database(e)
        })?;
        
        let todo_iter = stmt.query_map([], |row| {
            let id = row.get(0)?;
            let title = row.get(1)?;
            let priority = row.get(2)?;
            let completed: bool = row.get::<_, i64>(3)? == 1;
            let created_at = row.get(4)?;
            
            Ok(TodoItem {
                id,
                title,
                priority,
                completed,
                created_at,
            })
        }).map_err(|e| {
            error!("查询todos失败: {}", e);
            AppError::Database(e)
        })?;
        
        let mut todos = Vec::new();
        for todo in todo_iter {
            let todo = todo.map_err(|e| {
                error!("获取todo数据失败: {}", e);
                AppError::Database(e)
            })?;
            todos.push(todo);
        }
        
        debug!("获取到{}个todo项", todos.len());
        Ok(todos)
    }
    
    // 创建新的Todo项
    pub fn create_todo(&self, todo: TodoItem) -> AppResult<Vec<TodoItem>> {
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Message(format!("获取数据库锁失败: {}", e))
        })?;
        
        info!("创建新todo: {}", todo.title);
        conn.execute(
            "INSERT INTO todos (id, title, priority, completed, created_at) VALUES (?, ?, ?, ?, ?)",
            params![
                todo.id,
                todo.title,
                todo.priority,
                todo.completed as i64,
                todo.created_at
            ],
        ).map_err(|e| {
            error!("插入todo失败: {}", e);
            AppError::Database(e)
        })?;
        
        self.get_all_todos()
    }
    
    // 切换Todo项的完成状态
    pub fn toggle_todo(&self, id: &str) -> AppResult<Vec<TodoItem>> {
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Message(format!("获取数据库锁失败: {}", e))
        })?;
        
        info!("切换todo完成状态: {}", id);
        conn.execute(
            "UPDATE todos SET completed = ((completed | 1) - (completed & 1)) WHERE id = ?",
            params![id],
        ).map_err(|e| {
            error!("更新todo状态失败: {}", e);
            AppError::Database(e)
        })?;
        
        self.get_all_todos()
    }
    
    // 更新Todo项的优先级
    pub fn update_priority(&self, id: &str, priority: &str) -> AppResult<Vec<TodoItem>> {
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Message(format!("获取数据库锁失败: {}", e))
        })?;
        
        info!("更新todo优先级: {} -> {}", id, priority);
        conn.execute(
            "UPDATE todos SET priority = ? WHERE id = ?",
            params![priority, id],
        ).map_err(|e| {
            error!("更新todo优先级失败: {}", e);
            AppError::Database(e)
        })?;
        
        self.get_all_todos()
    }
    
    // 删除Todo项
    pub fn delete_todo(&self, id: &str) -> AppResult<Vec<TodoItem>> {
        let conn = self.conn.lock().map_err(|e| {
            error!("获取数据库锁失败: {}", e);
            AppError::Message(format!("获取数据库锁失败: {}", e))
        })?;
        
        info!("删除todo: {}", id);
        conn.execute(
            "DELETE FROM todos WHERE id = ?",
            params![id],
        ).map_err(|e| {
            error!("删除todo失败: {}", e);
            AppError::Database(e)
        })?;
        
        self.get_all_todos()
    }
}

// 数据库获取工具类
pub trait AppDatabaseExt {
    fn db(&self) -> Arc<Database>;
}

impl<R: Runtime> AppDatabaseExt for AppHandle<R> {
    fn db(&self) -> Arc<Database> {
        self.state::<Arc<Database>>().inner().clone()
    }
} 