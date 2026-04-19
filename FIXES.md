# FlowMind v1.0.1 修复说明

## 已应用的修复

### 1. 改进了 ID 生成方法
**文件**: `src/db/database.ts` (第 57 行)

**问题**: 使用已弃用的 `substr()` 方法可能导致 ID 生成不稳定

**修复**: 替换为更安全的 `substring()` 方法，并添加了长度检查
```typescript
// 旧代码
return ` ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 新代码
const randomStr = Math.random().toString(36)
const randomPart = randomStr.length > 2 ? randomStr.substring(2, 11) : randomStr
return `${Date.now()}-${randomPart}`
```

### 2. 添加了详细的调试日志
为了帮助诊断"笔记无法保存"的问题，我们在关键位置添加了日志：

**主进程日志** (`electron/ipc-handlers.ts`):
- 记录当前用户设置
- 记录笔记创建和更新的调用与结果

**渲染进程日志** (`src/hooks/useNotes.ts`):
- 记录 `createNote` 和 `updateNote` 的调用
- 记录成功/失败状态

**应用初始化日志** (`src/App.tsx`):
- 记录当前用户设置是否成功

## 新增功能

### 3. 日历日视图
**文件**: `src/components/Calendar.tsx`

- 添加了日视图（Day View）选项
- 在日历顶部工具栏添加了「日」切换按钮
- 日视图显示 24 小时时间轴，事件按精确分钟位置显示
- 支持点击时间格子快速创建日程

## 如何测试"无法保存"问题

1. **打开开发者工具**: 
   - 按 `Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows/Linux)
   - 或从菜单：View → Toggle Developer Tools

2. **查看控制台日志**:
   - 观察 `[App]`、`[useNotes]`、`[IPC]` 开头的日志
   - 新建笔记时应该看到 `[useNotes] Creating note` 和 `[IPC] Note created`
   - 保存笔记时应该看到 `[useNotes] Updating note` 和 `[IPC] Note updated`

3. **如果保存失败**:
   - 检查控制台是否有错误信息
   - 查看 `[IPC] Update result: false` 或 `[useNotes] Update failed` 等警告
   - 请将这些日志内容反馈给我们

## 文件位置

Windows: `%APPDATA%/FlowMind/config.json`
macOS: `~/Library/Application Support/FlowMind/config.json`
Linux: `~/.config/FlowMind/config.json`

## 问题反馈

如果仍然遇到"无法保存"的问题，请提供：
1. 控制台中的相关日志
2. 操作系统版本
3. 具体的操作步骤
