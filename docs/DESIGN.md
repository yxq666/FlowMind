# FlowMind Desktop - 设计系统文档

## 概述

FlowMind Desktop 采用现代深色主题设计，强调专注、沉浸式的笔记体验。设计语言融合了玻璃拟态、渐变光效和流畅的动画过渡。

---

## 配色方案

### 主色调

| Token | 色值 | 用途 |
|-------|------|------|
| `--primary` | `#6366f1` | 主要操作按钮、链接、高亮 |
| `--primary-dark` | `#4f46e5` | 主色悬停状态、按下状态 |
| `--secondary` | `#8b5cf6` | 次要操作、标签、装饰元素 |
| `--accent` | `#ec4899` | 强调色、重要提示、特殊标签 |

### 背景色

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg` | `#0f0f23` | 应用主背景（深蓝黑） |
| `--surface` | `#1a1a2e` | 卡片、面板背景 |
| `--surface-light` | `#252542` | 输入框、列表项悬停背景 |
| `--surface-hover` | `#2d2d4a` | 交互元素悬停状态 |

### 文字色

| Token | 色值 | 用途 |
|-------|------|------|
| `--text` | `#f1f1f4` | 主要文字 |
| `--text-secondary` | `#c4c4cc` | 次要文字、描述 |
| `--text-muted` | `#a1a1aa` | 占位符、禁用状态、元信息 |
| `--text-inverse` | `#0f0f23` | 深色背景上的浅色文字 |

### 功能色

| Token | 色值 | 用途 |
|-------|------|------|
| `--success` | `#10b981` | 成功状态、完成标记 |
| `--warning` | `#f59e0b` | 警告状态、需要注意 |
| `--error` | `#ef4444` | 错误状态、删除操作 |
| `--info` | `#3b82f6` | 信息提示 |

### 渐变定义

```css
/* 主渐变 - 用于标题、重要按钮 */
--gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);

/* 背景渐变 - 用于装饰性背景 */
--gradient-bg: radial-gradient(ellipse at top, #1a1a2e 0%, #0f0f23 50%, #0a0a1a 100%);

/* 卡片光晕 */
--gradient-glow: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 50%);
```

---

## 字体规范

### 字体族

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### 字号系统

| 样式 | 大小 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| `text-xs` | 12px | 400 | 16px | 标签、徽章文字 |
| `text-sm` | 14px | 400 | 20px | 辅助文字、描述 |
| `text-base` | 16px | 400 | 24px | 正文内容 |
| `text-lg` | 18px | 500 | 28px | 小标题 |
| `text-xl` | 20px | 600 | 30px | 侧边栏标题 |
| `text-2xl` | 24px | 600 | 32px | 区域标题 |
| `text-3xl` | 30px | 700 | 36px | 页面标题 |

### 字重

| Token | 值 | 用途 |
|-------|-----|------|
| `font-normal` | 400 | 正文 |
| `font-medium` | 500 | 按钮、标签 |
| `font-semibold` | 600 | 标题、强调 |
| `font-bold` | 700 | 大标题、数字 |

---

## 间距系统

### 基础单位

基础间距单位为 4px，所有间距基于此倍数：

| Token | 值 | 用途 |
|-------|-----|------|
| `space-1` | 4px | 图标间距、紧凑内联 |
| `space-2` | 8px | 小间距、行内元素 |
| `space-3` | 12px | 按钮内边距、列表项 |
| `space-4` | 16px | 标准间距、卡片内边距 |
| `space-5` | 20px | 中等间距 |
| `space-6` | 24px | 大间距、区块分隔 |
| `space-8` | 32px | 大区块间距 |
| `space-10` | 40px | 页面级间距 |
| `space-12` | 48px | 大区块间距 |

### 布局尺寸

```css
/* 侧边栏 */
--sidebar-width: 320px;
--sidebar-collapsed-width: 64px;

/* 头部 */
--header-height: 64px;

/* 编辑器 */
--editor-max-width: 800px;

/* 卡片 */
--card-border-radius: 12px;
--card-padding: 24px;
```

---

## 圆角系统

| Token | 值 | 用途 |
|-------|-----|------|
| `rounded-sm` | 4px | 小标签、徽章 |
| `rounded-md` | 8px | 按钮、输入框 |
| `rounded-lg` | 12px | 卡片、面板 |
| `rounded-xl` | 16px | 大卡片、模态框 |
| `rounded-2xl` | 20px | 特殊容器 |
| `rounded-full` | 9999px | 圆形元素、头像 |

---

## 阴影系统

```css
/* 小阴影 - 按钮、小卡片 */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);

/* 标准阴影 - 卡片、面板 */
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -2px rgba(0, 0, 0, 0.3);

/* 大阴影 - 模态框、下拉菜单 */
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -4px rgba(0, 0, 0, 0.4);

/* 发光阴影 - 焦点状态、激活状态 */
--shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);
--shadow-glow-accent: 0 0 20px rgba(236, 72, 153, 0.3);
```

---

## 边框系统

```css
/* 标准边框 */
--border-thin: 1px solid rgba(255, 255, 255, 0.1);
--border-medium: 1px solid rgba(255, 255, 255, 0.15);
--border-strong: 1px solid rgba(255, 255, 255, 0.2);

/* 焦点边框 */
--border-focus: 1px solid #6366f1;

/* 玻璃拟态边框 */
--border-glass: 1px solid rgba(255, 255, 255, 0.08);
```

---

## 动画与过渡

### 过渡时长

| Token | 值 | 用途 |
|-------|-----|------|
| `duration-fast` | 150ms | 按钮悬停、小交互 |
| `duration-normal` | 200ms | 标准过渡 |
| `duration-slow` | 300ms | 大元素动画、模态框 |
| `duration-slower` | 500ms | 复杂动画 |

### 缓动函数

```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
```

### 预设动画

```css
/* 淡入 */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 从下方滑入 */
@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* 缩放弹出 */
@keyframes scaleIn {
  from { 
    opacity: 0; 
    transform: scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: scale(1); 
  }
}

/* 脉冲发光 */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(99, 102, 241, 0); }
}

/* 渐变流动 */
@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 骨架屏闪烁 */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### 应用动画

| 场景 | 动画 | 时长 | 缓动 |
|------|------|------|------|
| 卡片出现 | `scaleIn` | 300ms | `ease-spring` |
| 列表项进入 | `slideUp` | 200ms | `ease-out` |
| 模态框打开 | `scaleIn` + `fadeIn` | 300ms | `ease-spring` |
| 按钮悬停 | `transform` | 150ms | `ease-default` |
| 加载状态 | `shimmer` | 1.5s | `linear` |
| AI 处理中 | `pulse` | 2s | `ease-default` |

---

## 玻璃拟态效果

```css
.glass {
  background: rgba(26, 26, 46, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-strong {
  background: rgba(26, 26, 46, 0.85);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 图标规范

- 使用 Lucide React 图标库
- 标准尺寸：16px (sm), 20px (md), 24px (lg)
- 线条粗细：2px
- 颜色继承父元素文字颜色

---

## 响应式断点

| 断点 | 宽度 | 说明 |
|------|------|------|
| `sm` | 640px | 小屏设备 |
| `md` | 768px | 平板 |
| `lg` | 1024px | 小桌面 |
| `xl` | 1280px | 标准桌面 |
| `2xl` | 1536px | 大桌面 |

---

## Z-Index 层级

| 层级 | 值 | 用途 |
|------|-----|------|
| `z-base` | 0 | 基础内容 |
| `z-dropdown` | 100 | 下拉菜单 |
| `z-sticky` | 200 | 粘性头部 |
| `z-modal` | 300 | 模态框 |
| `z-popover` | 400 | 弹出层 |
| `z-tooltip` | 500 | 工具提示 |
| `z-toast` | 600 | 通知提示 |

---

## 无障碍设计

### 焦点状态

- 所有交互元素必须有可见的焦点指示器
- 焦点环：`2px solid #6366f1`，偏移 `2px`
- 键盘导航顺序符合视觉顺序

### 对比度

- 正文文字与背景对比度 ≥ 4.5:1
- 大文字与背景对比度 ≥ 3:1
- 交互元素对比度 ≥ 3:1

### 动画

- 尊重 `prefers-reduced-motion` 设置
- 关键信息不依赖动画传达

---

## 设计原则

1. **深度感**：通过阴影、渐变和玻璃效果创造层次
2. **聚焦**：深色背景减少干扰，突出内容
3. **流畅**：所有交互都有平滑过渡
4. **一致**：相同功能的元素视觉一致
5. **呼吸**：充足的留白让界面不拥挤
