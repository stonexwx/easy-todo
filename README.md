# Easy Todo

一个使用Tauri 2.0、Rust和React构建的跨平台Todo应用程序。

## 功能特性

- 支持优先级矩阵管理任务
- 从GitLab同步任务
- 自动生成工作报告
- 跨平台支持（Windows、macOS、Linux）

## 开发指南

### 前提条件

- Node.js (v18+)
- Rust (1.71+)
- Tauri CLI
- Yarn

### 安装依赖

```bash
# 安装前端依赖
yarn install

# 安装Tauri CLI
cargo install tauri-cli
```

### 开发

```bash
# 启动开发服务器
yarn dev
```

### 构建

```bash
# 构建应用
yarn build
```

## 自动化测试

项目使用GitHub Actions进行自动化测试和构建。工作流配置位于`.github/workflows/`目录。

### 工作流说明

1. **Rust Tests** - 后端代码测试
   - 运行单元测试
   - 执行代码分析
   - 检查代码格式

2. **Build Check** - 跨平台构建测试
   - 在Windows、macOS和Linux上测试构建
   - 测试前端和后端的集成

3. **依赖版本检查** - 定期检查依赖更新
   - 每周自动检查Rust和Yarn依赖的更新
   - 可以手动触发检查

4. **发布应用** - 自动化发布流程
   - 标记新版本时自动构建
   - 为所有支持的平台创建发布包

### 手动触发工作流

可以通过GitHub界面手动触发某些工作流：

1. 进入项目的GitHub页面
2. 点击"Actions"选项卡
3. 从左侧列表选择要运行的工作流
4. 点击"Run workflow"按钮

## 许可证

[MIT](LICENSE)

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **语言**: TypeScript
- **样式**: SCSS + TailwindCSS
- **测试**: Vitest + React Testing Library
- **API模拟**: MSW (Mock Service Worker)
- **代码格式化**: Prettier

## 项目结构

```
easy-todo/
├── public/              # 静态资源
├── src/
│   ├── assets/          # 图片、字体等资源
│   ├── components/      # 可复用组件
│   ├── hooks/           # 自定义React Hooks
│   ├── layouts/         # 布局组件
│   ├── pages/           # 页面组件
│   ├── services/        # API服务和数据获取
│   ├── styles/          # 全局样式和变量
│   ├── test/            # 测试配置和工具
│   ├── utils/           # 工具函数
│   ├── App.tsx          # 应用入口组件
│   └── main.tsx         # 应用渲染入口
├── .prettierrc.json     # Prettier配置
├── index.html           # HTML模板
├── postcss.config.js    # PostCSS配置
├── tailwind.config.js   # TailwindCSS配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
└── vitest.config.ts     # Vitest配置
```

## 开始使用

### 安装依赖

```bash
yarn
```

### 开发模式

```bash
yarn dev
```

### 构建生产版本

```bash
yarn build
```

### 运行测试

```bash
# 运行所有测试
yarn test

# 监视模式
yarn test:watch

# 生成测试覆盖率报告
yarn test:coverage
```

### 代码格式化

```bash
yarn format
```

## 特性

- 添加、编辑、删除和标记待办事项
- 响应式设计，适应各种屏幕尺寸
- 完整的测试覆盖
- 模块化和可扩展的项目结构

## 技术实现亮点

1. **样式系统**: 结合 SCSS 和 TailwindCSS，既可使用工具类快速开发，又保留自定义样式的灵活性
2. **测试策略**: 使用 Vitest 和 React Testing Library 进行组件测试，MSW 用于模拟 API 调用
3. **项目结构**: 采用功能优先的组织方式，提高代码可维护性和可扩展性
4. **路径别名**: 使用 `@/` 作为 src 目录的别名，简化导入路径
