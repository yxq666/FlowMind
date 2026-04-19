# FluxNote Desktop

FluxNote 是一个基于 Electron + React + TypeScript + Tailwind CSS 开发的智能笔记应用桌面版。

## 功能特性

- 📝 **笔记管理**：创建、编辑、删除笔记
- 🏷️ **智能标签**：基于关键词自动推荐标签
- 🔍 **全文搜索**：支持标题和内容搜索
- 🤖 **AI 助手**：
  - 智能标签生成
  - 内容摘要生成
  - 自动分类
  - 内容优化（语法修正、精简、扩展等）
- 📤 **导入导出**：支持 Markdown、纯文本、JSON 格式
- 💾 **本地存储**：使用 SQLite 数据库存储数据

## 技术栈

- **框架**: Electron 29
- **前端**: React 18 + TypeScript
- **构建**: Vite
- **样式**: Tailwind CSS
- **数据库**: better-sqlite3
- **图标**: Lucide React

## 项目结构

```
flowmind-desktop/
├── electron/           # Electron 主进程代码
│   ├── main.ts        # 主进程入口
│   ├── preload.ts     # 预加载脚本
│   └── ipc-handlers.ts # IPC 通信处理
├── src/               # 渲染进程代码
│   ├── components/    # React 组件
│   ├── hooks/         # 自定义 Hooks
│   ├── db/            # 数据库封装
│   ├── services/      # AI 服务
│   ├── types/         # TypeScript 类型
│   ├── App.tsx        # 主应用组件
│   ├── main.tsx       # 渲染进程入口
│   └── index.css      # 全局样式
├── docs/              # 文档
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建应用
npm run build

# 打包 Electron 应用
npm run electron:build
```

## 快捷键

- `Cmd/Ctrl + N`: 新建笔记
- `Cmd/Ctrl + F`: 聚焦搜索框

## 标签关键词映射

| 标签 | 关键词 |
|------|--------|
| work | 工作、项目、任务、deadline、会议、汇报、客户、需求、开发、代码 |
| personal | 生活、日记、心情、家庭、朋友、周末、假期、旅行 |
| idea | 想法、创意、灵感、构思、设计、方案、改进、优化 |
| important | 重要、紧急、关键、注意、提醒、必须、立即 |
| meeting | 会议、讨论、纪要、议程、决议、参会 |
| reading | 阅读、书籍、文章、学习、笔记、摘抄 |

## 许可证

MIT
