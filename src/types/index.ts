// ============ 笔记相关 ============
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: number
  updatedAt: number
  userId?: string // 用户关联
}

export interface CreateNoteParams {
  title: string
  content: string
  tags: string[]
}

export interface UpdateNoteParams {
  title?: string
  content?: string
  tags?: string[]
}

// ============ 用户认证相关 ============
export interface User {
  id: string
  email: string
  name: string
  createdAt: number
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
}

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  email: string
  password: string
  name: string
}

// ============ 任务相关 ============
export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: number | null
  noteId: string | null // 关联的笔记ID
  userId: string
  createdAt: number
  updatedAt: number
}

export interface CreateTaskParams {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: number | null
  noteId?: string | null
}

export interface UpdateTaskParams {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  dueDate?: number | null
  noteId?: string | null
}

// ============ 日程相关 ============
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface ScheduleEvent {
  id: string
  title: string
  description: string
  startTime: number
  endTime: number
  repeat: RepeatType
  taskId: string | null // 关联的任务ID
  userId: string
  createdAt: number
  updatedAt: number
}

export interface CreateScheduleParams {
  title: string
  description?: string
  startTime: number
  endTime: number
  repeat?: RepeatType
  taskId?: string | null
}

export interface UpdateScheduleParams {
  title?: string
  description?: string
  startTime?: number
  endTime?: number
  repeat?: RepeatType
  taskId?: string | null
}

// ============ AI 功能相关 ============
export type AIFunction = 'tags' | 'summary' | 'classify' | 'optimize'

export interface AIOptimizeOptions {
  type: 'grammar' | 'concise' | 'expand' | 'formal' | 'casual'
}

export interface AIAnalysisResult {
  suggestedTags: string[]
  summary: string
  category: string
  wordCount: number
  readingTime: number
}

// ============ 搜索过滤 ============
export interface SearchFilters {
  tags?: string[]
  dateFrom?: number
  dateTo?: number
  query?: string
}

// ============ 应用状态 ============
export interface AppState {
  notes: Note[]
  selectedNoteId: string | null
  searchQuery: string
  selectedTags: string[]
  isLoading: boolean
}

// ============ 编辑器状态 ============
export interface EditorState {
  isEditing: boolean
  hasChanges: boolean
  autoSaveEnabled: boolean
}

// ============ 标签统计 ============
export interface TagStats {
  name: string
  count: number
}
