// 暂时移除菜单功能，等待未来扩展
// 在 Tauri 2.0 中，菜单 API 有较大变化

/// 创建应用菜单（占位函数，暂不实现）
pub fn create_menu() {
    // 暂时不提供菜单功能
}

#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_menu_creation() {
        // 简单测试占位函数是否存在
        create_menu();
        assert!(true, "菜单占位函数存在");
    }
} 