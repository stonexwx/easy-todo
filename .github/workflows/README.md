# GitHub Actions 工作流说明

本目录包含多个 GitHub Actions 工作流配置，用于自动化测试、构建和发布应用程序。

## 工作流列表

### rust-test.yml

**目的**: 测试 Rust 后端代码

**触发条件**:
- 推送到 main、master 或 develop 分支，且更改了 Rust 代码
- 创建针对这些分支的 PR，且更改了 Rust 代码

**执行的任务**:
- 安装 Rust 工具链
- 运行代码格式检查 (`cargo fmt --check`)
- 运行静态分析检查 (`cargo clippy`)
- 执行单元测试 (`cargo test`)

### build.yml

**目的**: 验证应用程序在各个平台上的构建过程

**触发条件**:
- 推送到 main、master 或 develop 分支
- 创建针对这些分支的 PR

**执行的任务**:
- 在 Windows、macOS 和 Linux 上构建应用
- 安装前端和后端依赖
- 构建前端代码
- 使用 Tauri 构建完整应用

### dependency-check.yml

**目的**: 定期检查依赖项更新

**触发条件**:
- 每周日自动执行
- 可以手动触发执行

**执行的任务**:
- 检查 Rust 依赖项更新
- 检查 NPM 依赖项更新

### release.yml

**目的**: 自动构建和发布应用程序

**触发条件**:
- 推送以 'v' 开头的标签（例如 v1.0.0）

**执行的任务**:
- 在 Windows、macOS 和 Linux 上构建应用
- 创建 GitHub Release
- 上传构建的应用程序包

## 所需的 Secrets

部分工作流需要配置以下 GitHub Secrets:

- `GITHUB_TOKEN`: 自动提供，用于操作仓库
- `TAURI_PRIVATE_KEY`: Tauri 代码签名私钥
- `TAURI_KEY_PASSWORD`: Tauri 私钥密码

## 手动触发工作流

部分工作流支持手动触发:

1. 进入 GitHub 仓库页面
2. 点击 "Actions" 选项卡
3. 从左侧列表选择工作流
4. 点击 "Run workflow" 按钮
5. 选择分支并确认

## 工作流维护

定期检查和更新工作流配置，确保:

- 使用最新版本的 Actions
- 依赖项和工具版本保持更新
- 系统依赖项保持正确 