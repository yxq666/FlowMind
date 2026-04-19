# FluxNote Desktop - 组件规范文档

## 目录

1. [基础组件](#基础组件)
2. [布局组件](#布局组件)
3. [编辑器组件](#编辑器组件)
4. [AI 功能组件](#ai-功能组件)
5. [数据组件](#数据组件)
6. [反馈组件](#反馈组件)

---

## 基础组件

### Button

多功能按钮组件，支持多种变体和尺寸。

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

**样式变体：**
- `primary`: 主色背景，白色文字
- `secondary`: 次色背景，白色文字
- `ghost`: 透明背景，悬停显示背景
- `danger`: 红色背景，用于删除操作
- `gradient`: 渐变背景，用于强调操作

**使用示例：**
```tsx
<Button variant="primary" size="md" icon={<PlusIcon />}>
  新建笔记
</Button>
```

---

### Input

文本输入组件，支持多种类型和状态。

```typescript
interface InputProps {
  type?: 'text' | 'password' | 'email' | 'search' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  rows?: number; // for textarea
  className?: string;
}
```

**特性：**
- 自动调整高度的 textarea
- 内置字符计数
- 错误状态显示
- 聚焦发光效果

---

### Tag

标签组件，用于显示分类标签。

```typescript
interface TagProps {
  label: string;
  color?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
}
```

**颜色映射：**
- `default`: 灰色背景
- `primary`: 靛蓝色
- `secondary`: 紫色
- `accent`: 粉色
- `success`: 绿色
- `warning`: 橙色
- `error`: 红色

---

### IconButton

图标按钮，用于工具栏和操作区。

```typescript
interface IconButtonProps {
  icon: React.ReactNode;
  label: string; // 用于 aria-label
  variant?: 'default' | 'ghost' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  active?: boolean;
  onClick?: () => void;
}
```

---

## 布局组件

### Sidebar

侧边栏容器，包含笔记列表和导航。

```typescript
interface SidebarProps {
  notes: Note[];
  selectedNoteId?: string;
  onSelectNote: (noteId: string) => void;
  onCreateNote: () => void;
  onDeleteNote: (noteId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}
```

**结构：**
```
Sidebar
├── SidebarHeader (搜索框 + 新建按钮)
├── NoteList
│   └── NoteListItem[]
└── SidebarFooter (统计信息)
```

---

### NoteListItem

笔记列表项，显示笔记概览。

```typescript
interface NoteListItemProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    updatedAt: Date;
    isFavorite?: boolean;
  };
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onToggleFavorite: () => void;
}
```

**显示规则：**
- 标题：显示前 2 行，截断用省略号
- 摘要：显示前 60 个字符
- 标签：最多显示 3 个
- 时间：相对时间（今天、昨天、具体日期）

---

### EditorLayout

编辑器布局容器。

```typescript
interface EditorLayoutProps {
  sidebar: React.ReactNode;
  editor: React.ReactNode;
  showSidebar: boolean;
}
```

**布局行为：**
- 桌面端：侧边栏 + 编辑器并排
- 平板：可折叠侧边栏
- 移动端：侧边栏全屏覆盖

---

## 编辑器组件

### NoteEditor

主编辑器组件，包含标题和内容编辑。

```typescript
interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Partial<Note>) => void;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  isDirty: boolean;
  lastSaved?: Date;
}
```

**自动保存：**
- 防抖保存：输入停止 1 秒后自动保存
- 显示保存状态指示器
- 快捷键：Ctrl/Cmd + S 手动保存

---

### TitleInput

笔记标题输入框。

```typescript
interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}
```

**样式：**
- 字体：24px, font-weight 700
- 背景：透明
- 边框：无，底部 2px 透明边框
- 聚焦：底部边框变为主色

---

### ContentEditor

富文本内容编辑器。

```typescript
interface ContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  autoFocus?: boolean;
}
```

**特性：**
- 支持 Markdown 快捷输入
- 自动调整高度
- 占位符提示
- 支持代码块

---

### TagInput

标签输入和管理组件。

```typescript
interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  maxTags?: number;
  placeholder?: string;
}
```

**交互：**
- 输入标签名后按 Enter 添加
- 点击 X 删除标签
- 输入时显示建议列表
- 支持从建议中点击添加

---

## AI 功能组件

### AIToolbar

AI 功能工具栏。

```typescript
interface AIToolbarProps {
  onSummarize: () => void;
  onCategorize: () => void;
  onOptimize: () => void;
  onGenerateTags: () => void;
  isProcessing: boolean;
  hasContent: boolean;
}
```

**按钮：**
- 总结：生成内容摘要
- 分类：自动分类笔记
- 优化：改进写作
- 标签：智能生成标签

---

### AIProcessingIndicator

AI 处理状态指示器。

```typescript
interface AIProcessingIndicatorProps {
  type: 'summarize' | 'categorize' | 'optimize' | 'tag';
  progress?: number;
}
```

**视觉：**
- 脉冲动画
- 处理类型文字
- 可选进度条

---

### SummaryCard

AI 生成的摘要卡片。

```typescript
interface SummaryCardProps {
  summary: string;
  originalLength: number;
  summaryLength: number;
  onApply: () => void;
  onDismiss: () => void;
  onCopy: () => void;
}
```

**显示：**
- 摘要内容
- 压缩比例
- 操作按钮：应用、复制、关闭

---

### CategoryBadge

分类徽章，显示 AI 分类结果。

```typescript
interface CategoryBadgeProps {
  category: string;
  confidence: number;
  onAccept: () => void;
  onReject: () => void;
}
```

---

## 数据组件

### StatsPanel

统计信息面板。

```typescript
interface StatsPanelProps {
  stats: {
    totalNotes: number;
    totalTags: number;
    todayNotes: number;
    thisWeekNotes: number;
    favoriteNotes: number;
  };
}
```

**显示项：**
- 总笔记数
- 总标签数
- 今日笔记
- 本周笔记
- 收藏笔记

---

### ImportExportPanel

数据导入导出面板。

```typescript
interface ImportExportPanelProps {
  onExport: (format: 'json' | 'markdown') => void;
  onImport: (data: string) => void;
  lastBackupDate?: Date;
}
```

**功能：**
- 导出为 JSON
- 导出为 Markdown
- 从 JSON 导入
- 显示上次备份时间

---

### EmptyState

空状态展示。

```typescript
interface EmptyStateProps {
  type: 'no-notes' | 'no-results' | 'no-selection' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**类型：**
- `no-notes`: 没有笔记时
- `no-results`: 搜索无结果
- `no-selection`: 未选择笔记
- `error`: 错误状态

---

## 反馈组件

### Toast

通知提示组件。

```typescript
interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}
```

**位置：** 右上角
**自动关闭：** 默认 3 秒

---

### ConfirmDialog

确认对话框。

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}
```

---

### LoadingSpinner

加载指示器。

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white';
}
```

---

### Skeleton

骨架屏加载占位。

```typescript
interface SkeletonProps {
  type: 'text' | 'title' | 'card' | 'list';
  lines?: number;
  className?: string;
}
```

---

## 复合组件

### SearchBox

搜索框组件。

```typescript
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
}
```

**特性：**
- 搜索图标
- 清除按钮（有内容时显示）
- 快捷键聚焦（Ctrl/Cmd + K）

---

### NoteCard

笔记卡片（用于网格视图）。

```typescript
interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
  onFavorite: () => void;
}
```

---

### Toolbar

工具栏组件。

```typescript
interface ToolbarProps {
  items: ToolbarItem[];
  position?: 'top' | 'bottom';
}

interface ToolbarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}
```

---

## 类型定义

### 核心类型

```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  category?: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  summary?: string;
}

interface Tag {
  id: string;
  name: string;
  color?: string;
  count: number;
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  fontSize: 'sm' | 'md' | 'lg';
  sidebarCollapsed: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
}
```

---

## 组件组合示例

### 完整编辑器页面

```tsx
<EditorLayout
  sidebar={
    <Sidebar
      notes={notes}
      selectedNoteId={selectedNoteId}
      onSelectNote={handleSelectNote}
      onCreateNote={handleCreateNote}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  }
  editor={
    selectedNote ? (
      <NoteEditor
        note={selectedNote}
        onTitleChange={handleTitleChange}
        onContentChange={handleContentChange}
        isDirty={isDirty}
        lastSaved={lastSaved}
      />
    ) : (
      <EmptyState type="no-selection" />
    )
  }
/>
```
