// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use app_lib::{todo, ai, gitlab, run};

fn main() {
    let builder = tauri::Builder::default()
        .setup(|app| {
            // 如果启用了 updater 特性，则初始化更新器插件
            #[cfg(feature = "updater")]
            {
                let _ = app.handle().plugin(tauri_plugin_updater::Builder::new().build());
            }
            
            Ok(run(app)?)
        })
        .invoke_handler(tauri::generate_handler![
            todo::get_todos,
            todo::create_todo,
            todo::toggle_todo,
            todo::update_priority,
            todo::delete_todo,
            gitlab::save_gitlab_config,
            gitlab::get_gitlab_config,
            gitlab::fetch_gitlab_issues,
            gitlab::convert_issue_to_todo,
            ai::save_ai_config,
            ai::get_ai_config,
            ai::generate_work_report,
        ]);

    builder
        .run(tauri::generate_context!())
        .expect("错误：Tauri应用运行失败");
}
