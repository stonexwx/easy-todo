mod todo;
mod db;
mod error;
mod logging;

use std::sync::Arc;
use db::Database;
use tauri::Manager;
use log::{info, error};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // 初始化日志系统
  logging::init(
    logging::LogLevel::Debug,
    cfg!(debug_assertions), // 在调试模式下启用文件日志
    Some("./easy-todo.log")
  );

  info!("应用程序启动");

  tauri::Builder::default()
    .setup(|app| {
      info!("初始化应用程序...");
      // 初始化数据库
      match Database::new(&app.handle()) {
        Ok(db) => {
          info!("数据库初始化成功");
          app.manage(Arc::new(db));
          Ok(())
        },
        Err(e) => {
          error!("数据库初始化失败: {}", e);
          Err(Box::new(e))
        }
      }
    })
    .invoke_handler(tauri::generate_handler![
      todo::create_todo,
      todo::get_todos,
      todo::toggle_todo,
      todo::update_priority,
      todo::delete_todo,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
    
  info!("应用程序关闭");
}
