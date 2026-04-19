import { contextBridge, ipcRenderer } from 'electron'
import { Note, Task, ScheduleEvent, CreateNoteParams, UpdateNoteParams, CreateTaskParams, UpdateTaskParams, CreateScheduleParams, UpdateScheduleParams, User } from '../src/types'

// 暴露给渲染进程的 API
contextBridge.exposeInMainWorld('electronAPI', {
  // ============ 认证相关 ============
  register: (email: string, password: string, name: string): Promise<{ user: User; token: string } | null> =>
    ipcRenderer.invoke('auth:register', email, password, name),
  
  login: (email: string, password: string): Promise<{ user: User; token: string } | null> =>
    ipcRenderer.invoke('auth:login', email, password),
  
  logout: (token: string): Promise<void> =>
    ipcRenderer.invoke('auth:logout', token),
  
  validateToken: (token: string): Promise<User | null> =>
    ipcRenderer.invoke('auth:validateToken', token),

  // ============ 笔记相关 ============
  getAllNotes: (): Promise<Note[]> =>
    ipcRenderer.invoke('db:getAllNotes'),
  
  getNoteById: (id: string): Promise<Note | null> =>
    ipcRenderer.invoke('db:getNoteById', id),
  
  createNote: (note: CreateNoteParams): Promise<Note> =>
    ipcRenderer.invoke('db:createNote', note),
  
  setCurrentUser: (userId: string): Promise<void> =>
    ipcRenderer.invoke('db:setCurrentUser', userId),
  
  updateNote: (id: string, note: Partial<Note>): Promise<boolean> =>
    ipcRenderer.invoke('db:updateNote', id, note),
  
  deleteNote: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('db:deleteNote', id),
  
  searchNotes: (query: string): Promise<Note[]> =>
    ipcRenderer.invoke('db:searchNotes', query),
  
  getNotesByTag: (tag: string): Promise<Note[]> =>
    ipcRenderer.invoke('db:getNotesByTag', tag),
  
  getAllTags: (): Promise<string[]> =>
    ipcRenderer.invoke('db:getAllTags'),
  
  // ============ 任务相关 ============
  getAllTasks: (): Promise<Task[]> =>
    ipcRenderer.invoke('db:getAllTasks'),
  
  getTaskById: (id: string): Promise<Task | null> =>
    ipcRenderer.invoke('db:getTaskById', id),
  
  createTask: (params: CreateTaskParams): Promise<Task> =>
    ipcRenderer.invoke('db:createTask', params),
  
  updateTask: (id: string, params: UpdateTaskParams): Promise<boolean> =>
    ipcRenderer.invoke('db:updateTask', id, params),
  
  deleteTask: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('db:deleteTask', id),
  
  getTasksByStatus: (status: string): Promise<Task[]> =>
    ipcRenderer.invoke('db:getTasksByStatus', status),
  
  // ============ 日程相关 ============
  getAllSchedules: (): Promise<ScheduleEvent[]> =>
    ipcRenderer.invoke('db:getAllSchedules'),
  
  getScheduleById: (id: string): Promise<ScheduleEvent | null> =>
    ipcRenderer.invoke('db:getScheduleById', id),
  
  createSchedule: (params: CreateScheduleParams): Promise<ScheduleEvent> =>
    ipcRenderer.invoke('db:createSchedule', params),
  
  updateSchedule: (id: string, params: UpdateScheduleParams): Promise<boolean> =>
    ipcRenderer.invoke('db:updateSchedule', id, params),
  
  deleteSchedule: (id: string): Promise<boolean> =>
    ipcRenderer.invoke('db:deleteSchedule', id),
  
  getSchedulesInRange: (start: number, end: number): Promise<ScheduleEvent[]> =>
    ipcRenderer.invoke('db:getSchedulesInRange', start, end),
  
  // ============ AI 服务 ============
  generateTags: (content: string): Promise<string[]> =>
    ipcRenderer.invoke('ai:generateTags', content),
  
  generateSummary: (content: string): Promise<string> =>
    ipcRenderer.invoke('ai:generateSummary', content),
  
  classifyContent: (content: string): Promise<string> =>
    ipcRenderer.invoke('ai:classifyContent', content),
  
  optimizeContent: (content: string, type: string): Promise<string> =>
    ipcRenderer.invoke('ai:optimizeContent', content, type),
  
  analyzeNote: (note: Note): Promise<any> =>
    ipcRenderer.invoke('ai:analyzeNote', note),
  
  // ============ 文件操作 ============
  exportNote: (id: string, format: 'md' | 'txt' | 'json'): Promise<boolean> =>
    ipcRenderer.invoke('file:exportNote', id, format),
  
  exportData: (): Promise<{ notes: Note[]; tasks: Task[]; schedules: ScheduleEvent[]; version: number; exportDate: string }> =>
    ipcRenderer.invoke('file:exportData'),
  
  importNotes: (filePath: string): Promise<Note[]> =>
    ipcRenderer.invoke('file:importNotes', filePath),
  
  selectImportFile: (): Promise<string | null> =>
    ipcRenderer.invoke('file:selectImportFile'),
  
  selectExportDirectory: (): Promise<string | null> =>
    ipcRenderer.invoke('file:selectExportDirectory'),
  
  // ============ 平台信息 ============
  platform: process.platform
})

// TypeScript 类型声明
declare global {
  interface Window {
    electronAPI: {
      // 认证
      register: (email: string, password: string, name: string) => Promise<{ user: User; token: string } | null>
      login: (email: string, password: string) => Promise<{ user: User; token: string } | null>
      logout: (token: string) => Promise<void>
      validateToken: (token: string) => Promise<User | null>
      
      // 笔记
      getAllNotes: () => Promise<Note[]>
      getNoteById: (id: string) => Promise<Note | null>
      createNote: (note: CreateNoteParams) => Promise<Note>
      setCurrentUser: (userId: string) => Promise<void>
      updateNote: (id: string, note: Partial<Note>) => Promise<boolean>
      deleteNote: (id: string) => Promise<boolean>
      searchNotes: (query: string) => Promise<Note[]>
      getNotesByTag: (tag: string) => Promise<Note[]>
      getAllTags: () => Promise<string[]>
      
      // 任务
      getAllTasks: () => Promise<Task[]>
      getTaskById: (id: string) => Promise<Task | null>
      createTask: (params: CreateTaskParams) => Promise<Task>
      updateTask: (id: string, params: UpdateTaskParams) => Promise<boolean>
      deleteTask: (id: string) => Promise<boolean>
      getTasksByStatus: (status: string) => Promise<Task[]>
      
      // 日程
      getAllSchedules: () => Promise<ScheduleEvent[]>
      getScheduleById: (id: string) => Promise<ScheduleEvent | null>
      createSchedule: (params: CreateScheduleParams) => Promise<ScheduleEvent>
      updateSchedule: (id: string, params: UpdateScheduleParams) => Promise<boolean>
      deleteSchedule: (id: string) => Promise<boolean>
      getSchedulesInRange: (start: number, end: number) => Promise<ScheduleEvent[]>
      
      // AI
      generateTags: (content: string) => Promise<string[]>
      generateSummary: (content: string) => Promise<string>
      classifyContent: (content: string) => Promise<string>
      optimizeContent: (content: string, type: string) => Promise<string>
      analyzeNote: (note: Note) => Promise<any>
      
      // 文件
      exportNote: (id: string, format: 'md' | 'txt' | 'json') => Promise<boolean>
      exportData: () => Promise<{ notes: Note[]; tasks: Task[]; schedules: ScheduleEvent[]; version: number; exportDate: string }>
      importNotes: (filePath: string) => Promise<Note[]>
      selectImportFile: () => Promise<string | null>
      selectExportDirectory: () => Promise<string | null>
      
      // 平台
      platform: string
    }
  }
}
