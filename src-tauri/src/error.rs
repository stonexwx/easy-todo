use thiserror::Error;
use std::io;

/// 应用程序错误类型
#[derive(Error, Debug)]
pub enum AppError {
    #[error("数据库错误: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("IO错误: {0}")]
    Io(#[from] io::Error),

    #[error("UUID错误: {0}")]
    Uuid(#[from] uuid::Error),

    #[error("系统时间错误: {0}")]
    SystemTime(#[from] std::time::SystemTimeError),

    #[error("Tauri错误: {0}")]
    Tauri(String),

    #[error("参数错误: {0}")]
    InvalidArgument(String),

    #[error("数据未找到: {0}")]
    NotFound(String),

    #[error("未知错误: {0}")]
    Unknown(String),
}

/// Result类型别名，使用AppError作为错误类型
pub type AppResult<T> = Result<T, AppError>;

impl From<AppError> for String {
    fn from(error: AppError) -> Self {
        error.to_string()
    }
}

impl From<&str> for AppError {
    fn from(message: &str) -> Self {
        AppError::Unknown(message.to_string())
    }
}

impl From<String> for AppError {
    fn from(message: String) -> Self {
        AppError::Unknown(message)
    }
}

/// 将Tauri错误转换为应用程序错误
pub fn tauri_err<E: std::error::Error>(err: E) -> AppError {
    AppError::Tauri(err.to_string())
} 