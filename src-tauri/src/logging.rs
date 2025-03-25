use env_logger::{Builder, Env};
use log::LevelFilter;
use std::sync::Once;
use std::fs::File;

/// 日志级别枚举
#[derive(Debug, Clone, Copy)]
pub enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace,
}

impl From<LogLevel> for LevelFilter {
    fn from(level: LogLevel) -> Self {
        match level {
            LogLevel::Error => LevelFilter::Error,
            LogLevel::Warn => LevelFilter::Warn,
            LogLevel::Info => LevelFilter::Info,
            LogLevel::Debug => LevelFilter::Debug,
            LogLevel::Trace => LevelFilter::Trace,
        }
    }
}

static INIT: Once = Once::new();

/// 初始化日志系统
/// 
/// # Arguments
/// 
/// * `level` - 日志级别
/// * `with_file` - 是否记录到文件
/// * `file_path` - 日志文件路径，如果with_file为true则必须提供
pub fn init(level: LogLevel, with_file: bool, file_path: Option<&str>) {
    INIT.call_once(|| {
        let mut builder = Builder::from_env(Env::default().default_filter_or("info"));
        
        builder.filter_level(level.into());
        builder.format_timestamp_secs();
        builder.format_module_path(true);
        builder.format_target(true);
        
        if with_file {
            if let Some(path) = file_path {
                match File::create(path) {
                    Ok(file) => {
                        builder.target(env_logger::Target::Pipe(Box::new(file)));
                        // 同时输出到控制台
                        builder.target(env_logger::Target::Stdout);
                    },
                    Err(e) => {
                        eprintln!("无法创建日志文件: {}", e);
                    }
                }
            }
        }
        
        builder.init();
        
        log::info!("日志系统初始化完成，级别: {:?}", level);
    });
} 