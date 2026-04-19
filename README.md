# FlowMind

> AI 驱动的智能工作流管理工具 —— 让每一件事都做得更顺畅。

[![Electron](https://img.shields.io/badge/Electron-29-47848F?logo=electron)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

---

## ✨ 简介

**FlowMind**（心流助手）是一款面向知识工作者的 AI 驱动型个人效率工具，专注于将碎片化的信息、任务和灵感自动整合为可执行的工作流。

**核心理念**：不是让你做更多的事，而是让每一件事都做得更顺畅。

通过智能识别用户的工作模式，FlowMind 能够主动优化时间分配，帮助用户进入并保持"心流状态"，实现生产力的最大化。

---

## 🚀 功能特性

### 📝 智能笔记管理
- 创建、编辑、删除笔记
- 富文本编辑器，支持 Markdown 快捷输入
- 自动保存（2 秒防抖）
- 全文搜索（标题 + 内容）
- 笔记标签系统

### 🤖 AI 助手
- **智能标签生成** — 基于内容自动推荐标签
- **内容摘要** — 为长文生成简洁摘要
- **自动分类** — 智能识别笔记类别
- **内容优化** — 语法修正、精简、扩展、语气调整

### ✅ 任务管理
- 创建、编辑、删除任务
- 状态流转：待办 → 进行中 → 已完成
- 优先级设置（低 / 中 / 高）
- 截止日期提醒
- 任务关联笔记

### 📅 日程管理
- **日视图** — 24 小时详细时间轴
- **周视图** — 七天并排展示
- **月视图** — 月度总览
- 点击时间格子快速创建日程
- 事件重复规则（每天 / 每周 / 每月 / 每年）

### 🎨 设计
- 现代深色主题（玻璃拟态 + 渐变光效）
- 响应式布局
- 流畅的动画过渡
- 沉浸式笔记体验

### 📤 导入/导出
- 支持 Markdown、纯文本、JSON 格式
- 数据本地存储，完全离线可用
- 一键备份与恢复

---

## 📸 界面预览

> 截图将在此处添加

---

## 📦 安装

### macOS (Apple Silicon)

1. 下载最新版本的 DMG 文件
2. 双击打开，将 **FlowMind** 拖入 **应用程序** 文件夹
3. 首次运行时，如遇"无法验证开发者"提示，请前往 **系统设置 → 隐私与安全性** → 点击 **"仍要打开"**

### Windows / Linux

目前仅提供 macOS 版本，Windows 和 Linux 版本可通过源码自行构建（见下方）。

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd/Ctrl + N` | 新建笔记 / 任务 |
| `Cmd/Ctrl + F` | 聚焦搜索框 |
| `Cmd/Ctrl + S` | 手动保存 |

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 桌面框架 | [Electron 29](https://www.electronjs.org/) |
| 前端框架 | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| 构建工具 | [Vite](https://vitejs.dev/) |
| 样式 | [Tailwind CSS](https://tailwindcss.com/) |
| 数据存储 | [electron-store](https://github.com/sindresorhus/electron-store) |
| 图标库 | [Lucide React](https://lucide.dev/) |

---

## 🧑‍💻 开发

### 环境要求

- [Node.js](https://nodejs.org/) ≥ 18
- npm ≥ 9

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/yourusername/flowmind.git
cd flowmind

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 打包 Electron 应用
npm run electron:build
```

### 项目结构

```
flowmind/
├── electron/           # Electron 主进程代码
│   ├── main.ts        # 主进程入口
│   ├── preload.ts     # 预加载脚本（安全桥接）
│   └── ipc-handlers.ts # IPC 通信处理
├── src/               # 渲染进程代码
│   ├── components/    # React 组件
│   ├── hooks/         # 自定义 Hooks
│   ├── db/            # 数据库封装
│   ├── services/      # AI 服务（规则引擎）
│   ├── types/         # TypeScript 类型
│   ├── App.tsx        # 主应用组件
│   └── main.tsx       # 渲染进程入口
├── docs/              # 项目文档
├── dist/              # 前端构建产物
├── dist-electron/     # Electron 构建产物
└── package.json
```

---

## 🗺️ 路线图

### Phase 1 — MVP ✅（已完成）
- [x] 基础任务管理
- [x] 基础日程视图（日 / 周 / 月）
- [x] 灵感快速记录
- [x] 基础 AI 助手

### Phase 2 — 核心产品 🚧（进行中）
- [ ] 番茄钟专注模式
- [ ] 工作流看板视图
- [ ] 真实 AI API 集成（OpenAI / Claude）
- [ ] 浏览器插件

### Phase 3 — 智能化
- [ ] AI 日程规划
- [ ] 知识图谱可视化
- [ ] 个性化推荐

### Phase 4 — 生态
- [ ] 移动端应用
- [ ] 团队协作
- [ ] 第三方集成（Notion、Slack 等）

---

## 🤝 参与贡献

我们欢迎所有形式的贡献！

1. **Fork** 本仓库
2. 创建你的功能分支：`git checkout -b feature/AmazingFeature`
3. 提交更改：`git commit -m 'Add some AmazingFeature'`
4. 推送分支：`git push origin feature/AmazingFeature`
5. 提交 **Pull Request**

---

## 📄 许可证

本项目基于 [MIT 许可证](./LICENSE) 开源。

---

## 🙏 致谢

感谢所有为 FlowMind 提供反馈和建议的用户。

**FlowMind** — 让每一件事都做得更顺畅。

---

> **注意**：当前 AI 功能基于规则引擎模拟，后续版本将支持接入 OpenAI、Claude 等真实 AI API。
