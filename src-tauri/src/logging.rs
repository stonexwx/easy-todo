use std::fs::{File, OpenOptions};
use std::io::Write;
use std::path::PathBuf;
use std::sync::{Arc, Mutex};
use chrono::Local;
use log::{LevelFilter, Log, Metadata, Record};

/// 日志级别枚举
pub enum LogLevel {
    Trace,
    Debug,
    Info,
    Warn,
    Error,
}

impl From<LogLevel> for LevelFilter {
    fn from(level: LogLevel) -> Self {
        match level {
            LogLevel::Trace => LevelFilter::Trace,
            LogLevel::Debug => LevelFilter::Debug,
            LogLevel::Info => LevelFilter::Info,
            LogLevel::Warn => LevelFilter::Warn,
            LogLevel::Error => LevelFilter::Error,
        }
    }
}

pub struct FileLogger {
    file: Mutex<File>,
}

impl FileLogger {
    pub fn new(log_path: PathBuf) -> Result<Self, std::io::Error> {
        let file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(log_path)?;
        
        Ok(FileLogger {
            file: Mutex::new(file),
        })
    }
}

impl Log for FileLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            let now = Local::now();
            let message = format!(
                "[{} {} {}:{}] {}\n",
                now.format("%Y-%m-%d %H:%M:%S"),
                record.level(),
                record.file().unwrap_or("unknown"),
                record.line().unwrap_or(0),
                record.args()
            );
            
            let mut file = self.file.lock().unwrap();
            let _ = file.write_all(message.as_bytes());
        }
    }

    fn flush(&self) {
        if let Ok(mut file) = self.file.lock() {
            let _ = file.flush();
        }
    }
}

/// 初始化日志系统
pub fn init_logger(log_path: PathBuf) -> Result<(), log::SetLoggerError> {
    let logger = match FileLogger::new(log_path) {
        Ok(logger) => Arc::new(logger),
        Err(e) => {
            eprintln!("Failed to create logger: {}", e);
            // 如果无法创建日志文件，返回错误
            return Err(log::set_logger(&CONSOLE_LOGGER).unwrap_err());
        }
    };
    
    log::set_max_level(LevelFilter::Info);
    log::set_boxed_logger(Box::new(logger))
}

// 控制台日志记录器作为备用
struct ConsoleLogger;

impl Log for ConsoleLogger {
    fn enabled(&self, metadata: &Metadata) -> bool {
        metadata.level() <= log::Level::Info
    }

    fn log(&self, record: &Record) {
        if self.enabled(record.metadata()) {
            eprintln!("[{} {}:{}] {}", 
                record.level(),
                record.file().unwrap_or("unknown"),
                record.line().unwrap_or(0),
                record.args()
            );
        }
    }

    fn flush(&self) {}
}

static CONSOLE_LOGGER: ConsoleLogger = ConsoleLogger;

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;
    
    #[test]
    fn test_file_logger() {
        let temp_dir = tempdir().expect("无法创建临时目录");
        let log_path = temp_dir.path().join("test.log");
        
        let logger = FileLogger::new(log_path.clone()).expect("无法创建日志记录器");
        let logger = Arc::new(logger);
        
        // 使用静态字符串来避免借用问题
        let record = Record::builder()
            .args(format_args!("测试日志消息"))  // 直接使用字符串文字
            .level(log::Level::Info)
            .target("test_target")
            .file(Some(file!()))
            .line(Some(line!()))
            .build();
        
        logger.log(&record);
        logger.flush();
        
        // 验证日志文件内容
        let log_content = std::fs::read_to_string(log_path).expect("无法读取日志文件");
        assert!(log_content.contains("测试日志消息"));
        assert!(log_content.contains("INFO"));
    }
}
