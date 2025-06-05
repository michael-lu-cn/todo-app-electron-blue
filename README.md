# 待办事项应用

一个简洁、美观的跨平台待办事项管理应用，基于Electron和React构建，专为macOS设计。

## 功能特点

- 📝 待办事项管理：创建、编辑、删除和标记完成待办事项
- 🏷️ 分类管理：对待办事项进行分类整理
- 🔍 实时搜索：快速查找待办事项
- 🎨 主题定制：支持浅色/深色模式和8种主题颜色
- 📅 截止日期：设置并追踪任务截止日期
- ⭐ 优先级：为任务设置优先级（低/中/高）
- 💻 专为macOS优化

## 安装

从[GitHub Releases](https://github.com/michael-lu-cn/todo-app-electron-blue/releases)下载最新版本：

- macOS: `.dmg` 或 `.zip`

## 开发

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 运行开发环境

```bash
pnpm start
```

### 构建应用

```bash
pnpm make
```

## 发布流程

本项目使用GitHub Actions自动构建和发布应用。发布流程如下：

1. 运行发布脚本创建新版本：

```bash
pnpm release
```

2. 输入版本提交信息（版本号会自动递增）

3. 推送到GitHub：

```bash
git push origin main && git push origin v版本号
```

4. GitHub Actions将自动构建应用并创建Release

## 目录结构

```
├── src/
│   ├── main/         # Electron主进程代码
│   ├── renderer/     # React渲染进程代码
│   └── shared/       # 共享类型和工具
├── .github/          # GitHub配置
├── scripts/          # 构建和发布脚本
└── design/           # 设计文档和原型
```

## 许可证

MIT