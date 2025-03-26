pub mod todo;
pub mod db;
pub mod error;
pub mod logging;
pub mod gitlab;
pub mod ai;
pub mod menu;

use std::sync::Arc;
use tauri::Manager;
use log::info;
use tauri::{App, Wry};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run(app: &mut App<Wry>) -> tauri::Result<()> {
  // 获取应用程序数据目录
  let app_data_dir = app.path().app_data_dir()
    .expect("无法获取应用数据目录");

  // 确保目录存在
  if !app_data_dir.exists() {
    std::fs::create_dir_all(&app_data_dir)
      .expect("无法创建应用数据目录");
  }

  // 初始化日志
  let log_path = app_data_dir.join("easy-todo.log");
  match logging::init_logger(log_path) {
    Ok(_) => info!("日志系统初始化成功"),
    Err(e) => eprintln!("日志系统初始化失败: {:?}", e),
  }

  // 初始化数据库
  let db_path = app_data_dir.join("easy-todo.db");
  let db = db::Database::new(db_path)
    .expect("数据库初始化失败");

  // 将数据库句柄保存到应用状态
  app.manage(Arc::new(db));

  info!("应用程序初始化成功");
  Ok(())
}
