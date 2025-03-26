use std::fmt;
use std::io;

/// 应用程序的结果类型
pub type AppResult<T> = Result<T, AppError>;

/// 应用程序错误类型
#[derive(Debug)]
pub enum AppError {
    Io(io::Error),
    Database(rusqlite::Error),
    Json(serde_json::Error),
    Tauri(String),
    SystemTime(std::time::SystemTimeError),
    Message(String),
}

impl std::error::Error for AppError {}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::Io(err) => write!(f, "IO错误: {}", err),
            AppError::Database(err) => write!(f, "数据库错误: {}", err),
            AppError::Json(err) => write!(f, "JSON错误: {}", err),
            AppError::Tauri(err) => write!(f, "Tauri错误: {}", err),
            AppError::SystemTime(err) => write!(f, "系统时间错误: {}", err),
            AppError::Message(msg) => write!(f, "{}", msg),
        }
    }
}

impl From<io::Error> for AppError {
    fn from(err: io::Error) -> Self {
        AppError::Io(err)
    }
}

impl From<rusqlite::Error> for AppError {
    fn from(err: rusqlite::Error) -> Self {
        AppError::Database(err)
    }
}

impl From<serde_json::Error> for AppError {
    fn from(err: serde_json::Error) -> Self {
        AppError::Json(err)
    }
}

impl From<std::time::SystemTimeError> for AppError {
    fn from(err: std::time::SystemTimeError) -> Self {
        AppError::SystemTime(err)
    }
}

impl From<String> for AppError {
    fn from(msg: String) -> Self {
        AppError::Message(msg)
    }
}

impl From<&str> for AppError {
    fn from(msg: &str) -> Self {
        AppError::Message(msg.to_string())
    }
}

impl From<AppError> for String {
    fn from(err: AppError) -> Self {
        err.to_string()
    }
}

/// 将Tauri错误转换为应用程序错误
pub fn tauri_err<E: std::error::Error>(err: E) -> AppError {
    AppError::Tauri(err.to_string())
} 