import Store from 'electron-store'
import { Note, CreateNoteParams, UpdateNoteParams, User, Task, ScheduleEvent, CreateTaskParams, UpdateTaskParams, CreateScheduleParams, UpdateScheduleParams } from '../types'

// ============ 数据库版本管理 ============
interface StoreSchema {
  version: number
  // 认证相关
  users: User[]
  passwordHashes: { [email: string]: string }  // email -> password hash
  sessions: { [token: string]: { userId: string; expiresAt: number } }
  // 数据（按用户隔离）
  notes: { [userId: string]: Note[] }
  tasks: { [userId: string]: Task[] }
  schedules: { [userId: string]: ScheduleEvent[] }
  // 用户设置
  settings: { [userId: string]: any }
}

const DB_VERSION = 2

export class DatabaseManager {
  private store: Store<StoreSchema>
  private currentUserId: string | null = null
  private readonly DEFAULT_USER_ID = 'local-user'
  private readonly DEFAULT_USER: User = {
    id: 'local-user',
    name: '本地用户',
    email: 'local@fluxnote.app',
    createdAt: Date.now()
  }

  constructor() {
    this.store = new Store<StoreSchema>({
      name: 'fluxnote-data',
      defaults: {
        version: DB_VERSION,
        users: [],
        passwordHashes: {},
        sessions: {},
        notes: {},
        tasks: {},
        schedules: {},
        settings: {}
      }
    })
    this.migrate()
    this.ensureDefaultUser()
    this.ensureCurrentUser()
  }

  private ensureDefaultUser(): void {
    const users = this.store.get('users', [])
    const defaultUserExists = users.some(u => u.id === this.DEFAULT_USER_ID)
    
    if (!defaultUserExists) {
      users.unshift(this.DEFAULT_USER)
      this.store.set('users', users)
      
      const notes = this.store.get('notes', {})
      const tasks = this.store.get('tasks', {})
      const schedules = this.store.get('schedules', {})
      
      notes[this.DEFAULT_USER_ID] = notes[this.DEFAULT_USER_ID] || []
      tasks[this.DEFAULT_USER_ID] = tasks[this.DEFAULT_USER_ID] || []
      schedules[this.DEFAULT_USER_ID] = schedules[this.DEFAULT_USER_ID] || []
      
      this.store.set('notes', notes)
      this.store.set('tasks', tasks)
      this.store.set('schedules', schedules)
    }
  }

  private ensureCurrentUser(): void {
    if (!this.currentUserId) {
      this.currentUserId = this.DEFAULT_USER_ID
    }
  }

  private getEffectiveUserId(): string {
    return this.currentUserId || this.DEFAULT_USER_ID
  }

  private migrate() {
    const version = this.store.get('version', 0)
    
    // 修复版本1的数据格式转换
    if (version < 1) {
      const oldNotes = this.store.get('notes' as any)
      if (oldNotes && Array.isArray(oldNotes)) {
        this.store.set('notes', { default: oldNotes as Note[] })
        this.store.delete('notes' as any)
      }
    }
    
    // 修复版本2的数据格式问题（某些情况下notes可能仍然是数组）
    const notes = this.store.get('notes' as any)
    if (Array.isArray(notes)) {
      // notes 仍然是数组格式，需要转换为对象格式
      console.log('[DB] Fixing notes format from array to object')
      this.store.set('notes', { [this.DEFAULT_USER_ID]: notes as Note[] })
    }
    
    if (version < DB_VERSION) {
      this.store.set('version', DB_VERSION)
    }
  }

  private generateId(): string {
    const randomStr = Math.random().toString(36)
    const randomPart = randomStr.length > 2 ? randomStr.substring(2, 11) : randomStr
    return `${Date.now()}-${randomPart}`
  }

  // 设置当前用户（登录后调用）- 现在可选，会自动使用默认用户
  setCurrentUser(userId: string | null) {
    this.currentUserId = userId || this.DEFAULT_USER_ID
  }

  // 获取当前用户ID
  getCurrentUserId(): string | null {
    return this.currentUserId || this.DEFAULT_USER_ID
  }

  // ============ 密码处理 ============
  private hashPassword(password: string): string {
    const salt = 'flowmind_salt_2024'
    return Buffer.from(`${password}:${salt}`).toString('base64')
  }

  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash
  }

  // ============ 认证相关 ============
  register(email: string, password: string, name: string): { user: User; token: string } | null {
    const users = this.store.get('users', [])
    
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return null
    }

    const passwordHash = this.hashPassword(password)
    const user: User = {
      id: this.generateId(),
      email: email.toLowerCase(),
      name,
      createdAt: Date.now()
    }

    const token = this.generateId() + '_' + this.generateId()
    const sessions = this.store.get('sessions', {})
    const passwordHashes = this.store.get('passwordHashes', {})

    users.push(user)
    sessions[token] = {
      userId: user.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    }
    passwordHashes[email.toLowerCase()] = passwordHash

    const notes = this.store.get('notes', {})
    const tasks = this.store.get('tasks', {})
    const schedules = this.store.get('schedules', {})

    notes[user.id] = []
    tasks[user.id] = []
    schedules[user.id] = []

    this.store.set('users', users)
    this.store.set('sessions', sessions)
    this.store.set('passwordHashes', passwordHashes)
    this.store.set('notes', notes)
    this.store.set('tasks', tasks)
    this.store.set('schedules', schedules)

    // 自动登录
    this.setCurrentUser(user.id)

    return { user, token }
  }

  login(email: string, password: string): { user: User; token: string } | null {
    const users = this.store.get('users', [])
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

    if (!user) return null

    const passwordHashes = this.store.get('passwordHashes', {})
    const storedHash = passwordHashes[email.toLowerCase()]
    const inputHash = this.hashPassword(password)
    
    if (!storedHash || inputHash !== storedHash) {
      return null
    }

    const token = this.generateId() + '_' + this.generateId()
    const sessions = this.store.get('sessions', {})

    sessions[token] = {
      userId: user.id,
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
    }

    this.store.set('sessions', sessions)

    // 自动登录
    this.setCurrentUser(user.id)

    return { user, token }
  }

  logout(token: string): void {
    const sessions = this.store.get('sessions', {})
    delete sessions[token]
    this.store.set('sessions', sessions)
    this.setCurrentUser(null)
  }

  validateToken(token: string): User | null {
    const sessions = this.store.get('sessions', {})
    const session = sessions[token]

    if (!session) return null
    if (session.expiresAt < Date.now()) {
      delete sessions[token]
      this.store.set('sessions', sessions)
      return null
    }

    const users = this.store.get('users', [])
    const user = users.find(u => u.id === session.userId)
    if (!user) return null

    return user
  }

  getUserById(userId: string): User | null {
    const users = this.store.get('users', [])
    const user = users.find(u => u.id === userId)
    if (!user) return null
    return user
  }

  // ============ 笔记相关 ============
  createNote(params: CreateNoteParams): Note {
    const userId = this.getEffectiveUserId()
    const id = this.generateId()
    const now = Date.now()
    const note: Note = {
      id,
      title: params.title || '',
      content: params.content || '',
      tags: params.tags || [],
      createdAt: now,
      updatedAt: now,
      userId
    }

    const notes = this.store.get('notes', {})
    if (!notes[userId]) notes[userId] = []
    notes[userId].unshift(note)
    this.store.set('notes', notes)

    return note
  }

  getAllNotes(): Note[] {
    const userId = this.getEffectiveUserId()
    const notes = this.store.get('notes', {})
    return notes[userId] || []
  }

  getNoteById(id: string): Note | null {
    const userId = this.getEffectiveUserId()
    const notes = this.store.get('notes', {})
    const userNotes = notes[userId] || []
    return userNotes.find(n => n.id === id) || null
  }

  updateNote(id: string, params: UpdateNoteParams): boolean {
    const userId = this.getEffectiveUserId()
    const notes = this.store.get('notes', {})
    const userNotes = notes[userId] || []
    const index = userNotes.findIndex(n => n.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Note not found: ${id} for user: ${userId}`)
      return false
    }

    const note = userNotes[index]
    
    if (params.title !== undefined) note.title = params.title
    if (params.content !== undefined) note.content = params.content
    if (params.tags !== undefined) note.tags = params.tags
    
    note.updatedAt = Date.now()
    
    userNotes.splice(index, 1)
    userNotes.unshift(note)
    notes[userId] = userNotes
    this.store.set('notes', notes)
    
    return true
  }

  deleteNote(id: string): boolean {
    const userId = this.getEffectiveUserId()
    const notes = this.store.get('notes', {})
    const userNotes = notes[userId] || []
    const index = userNotes.findIndex(n => n.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Note not found: ${id} for user: ${userId}`)
      return false
    }
    
    userNotes.splice(index, 1)
    notes[userId] = userNotes
    this.store.set('notes', notes)
    
    return true
  }

  searchNotes(query: string): Note[] {
    const userId = this.getEffectiveUserId()
    if (!query.trim()) return this.getAllNotes()
    
    const userNotes = this.getAllNotes()
    const lowerQuery = query.toLowerCase()
    
    return userNotes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) ||
      note.content.toLowerCase().includes(lowerQuery)
    )
  }

  getNotesByTag(tag: string): Note[] {
    const userId = this.getEffectiveUserId()
    const userNotes = this.getAllNotes()
    return userNotes.filter(note => note.tags.includes(tag))
  }

  getAllTags(): string[] {
    const userId = this.getEffectiveUserId()
    const userNotes = this.getAllNotes()
    const tagSet = new Set<string>()
    
    for (const note of userNotes) {
      note.tags.forEach(tag => tagSet.add(tag))
    }
    
    return Array.from(tagSet).sort()
  }

  getTagStats(): { name: string; count: number }[] {
    const userId = this.getEffectiveUserId()
    const userNotes = this.getAllNotes()
    const tagCount = new Map<string, number>()
    
    for (const note of userNotes) {
      note.tags.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1)
      })
    }
    
    return Array.from(tagCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }

  // ============ 任务相关 ============
  createTask(params: CreateTaskParams): Task {
    const userId = this.getEffectiveUserId()
    const id = this.generateId()
    const now = Date.now()
    const task: Task = {
      id,
      title: params.title,
      description: params.description || '',
      status: params.status || 'todo',
      priority: params.priority || 'medium',
      dueDate: params.dueDate || null,
      noteId: params.noteId || null,
      userId,
      createdAt: now,
      updatedAt: now
    }

    const tasks = this.store.get('tasks', {})
    if (!tasks[userId]) tasks[userId] = []
    tasks[userId].push(task)
    this.store.set('tasks', tasks)

    return task
  }

  getAllTasks(): Task[] {
    const userId = this.getEffectiveUserId()
    const tasks = this.store.get('tasks', {})
    return tasks[userId] || []
  }

  getTaskById(id: string): Task | null {
    const userId = this.getEffectiveUserId()
    const tasks = this.store.get('tasks', {})
    const userTasks = tasks[userId] || []
    return userTasks.find(t => t.id === id) || null
  }

  updateTask(id: string, params: UpdateTaskParams): boolean {
    const userId = this.getEffectiveUserId()
    const tasks = this.store.get('tasks', {})
    const userTasks = tasks[userId] || []
    const index = userTasks.findIndex(t => t.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Task not found: ${id} for user: ${userId}`)
      return false
    }

    const task = userTasks[index]
    
    if (params.title !== undefined) task.title = params.title
    if (params.description !== undefined) task.description = params.description
    if (params.status !== undefined) task.status = params.status
    if (params.priority !== undefined) task.priority = params.priority
    if (params.dueDate !== undefined) task.dueDate = params.dueDate
    if (params.noteId !== undefined) task.noteId = params.noteId
    
    task.updatedAt = Date.now()
    
    tasks[userId] = userTasks
    this.store.set('tasks', tasks)
    
    return true
  }

  deleteTask(id: string): boolean {
    const userId = this.getEffectiveUserId()
    const tasks = this.store.get('tasks', {})
    const userTasks = tasks[userId] || []
    const index = userTasks.findIndex(t => t.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Task not found: ${id} for user: ${userId}`)
      return false
    }
    
    userTasks.splice(index, 1)
    tasks[userId] = userTasks
    this.store.set('tasks', tasks)
    
    return true
  }

  getTasksByStatus(status: string): Task[] {
    const userId = this.getEffectiveUserId()
    const userTasks = this.getAllTasks()
    return userTasks.filter(t => t.status === status)
  }

  // ============ 日程相关 ============
  createSchedule(params: CreateScheduleParams): ScheduleEvent {
    const userId = this.getEffectiveUserId()
    const id = this.generateId()
    const now = Date.now()
    const event: ScheduleEvent = {
      id,
      title: params.title,
      description: params.description || '',
      startTime: params.startTime,
      endTime: params.endTime,
      repeat: params.repeat || 'none',
      taskId: params.taskId || null,
      userId,
      createdAt: now,
      updatedAt: now
    }

    const schedules = this.store.get('schedules', {})
    if (!schedules[userId]) schedules[userId] = []
    schedules[userId].push(event)
    this.store.set('schedules', schedules)

    return event
  }

  getAllSchedules(): ScheduleEvent[] {
    const userId = this.getEffectiveUserId()
    const schedules = this.store.get('schedules', {})
    return schedules[userId] || []
  }

  getScheduleById(id: string): ScheduleEvent | null {
    const userId = this.getEffectiveUserId()
    const schedules = this.store.get('schedules', {})
    const userSchedules = schedules[userId] || []
    return userSchedules.find(s => s.id === id) || null
  }

  updateSchedule(id: string, params: UpdateScheduleParams): boolean {
    const userId = this.getEffectiveUserId()
    const schedules = this.store.get('schedules', {})
    const userSchedules = schedules[userId] || []
    const index = userSchedules.findIndex(s => s.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Schedule not found: ${id} for user: ${userId}`)
      return false
    }

    const event = userSchedules[index]
    
    if (params.title !== undefined) event.title = params.title
    if (params.description !== undefined) event.description = params.description
    if (params.startTime !== undefined) event.startTime = params.startTime
    if (params.endTime !== undefined) event.endTime = params.endTime
    if (params.repeat !== undefined) event.repeat = params.repeat
    if (params.taskId !== undefined) event.taskId = params.taskId
    
    event.updatedAt = Date.now()
    
    schedules[userId] = userSchedules
    this.store.set('schedules', schedules)
    
    return true
  }

  deleteSchedule(id: string): boolean {
    const userId = this.getEffectiveUserId()
    const schedules = this.store.get('schedules', {})
    const userSchedules = schedules[userId] || []
    const index = userSchedules.findIndex(s => s.id === id)
    
    if (index === -1) {
      console.warn(`[DB] Schedule not found: ${id} for user: ${userId}`)
      return false
    }
    
    userSchedules.splice(index, 1)
    schedules[userId] = userSchedules
    this.store.set('schedules', schedules)
    
    return true
  }

  getSchedulesInRange(start: number, end: number): ScheduleEvent[] {
    const userId = this.getEffectiveUserId()
    const userSchedules = this.getAllSchedules()
    return userSchedules.filter(s => 
      (s.startTime >= start && s.startTime <= end) ||
      (s.endTime >= start && s.endTime <= end) ||
      (s.startTime <= start && s.endTime >= end)
    )
  }

  // ============ 导出/导入 ============
  exportData(): { notes: Note[]; tasks: Task[]; schedules: ScheduleEvent[]; version: number; exportDate: string } {
    return {
      notes: this.getAllNotes(),
      tasks: this.getAllTasks(),
      schedules: this.getAllSchedules(),
      version: this.store.get('version', DB_VERSION),
      exportDate: new Date().toISOString()
    }
  }

  importData(data: { notes?: Note[]; tasks?: Task[]; schedules?: ScheduleEvent[] }): boolean {
    try {
      if (data.notes && Array.isArray(data.notes)) {
        const notes = this.store.get('notes', {})
        const userId = this.currentUserId
        if (userId) {
          notes[userId] = data.notes
          this.store.set('notes', notes)
        }
      }
      if (data.tasks && Array.isArray(data.tasks)) {
        const tasks = this.store.get('tasks', {})
        const userId = this.currentUserId
        if (userId) {
          tasks[userId] = data.tasks
          this.store.set('tasks', tasks)
        }
      }
      if (data.schedules && Array.isArray(data.schedules)) {
        const schedules = this.store.get('schedules', {})
        const userId = this.currentUserId
        if (userId) {
          schedules[userId] = data.schedules
          this.store.set('schedules', schedules)
        }
      }
      return true
    } catch (err) {
      console.error('Import error:', err)
      return false
    }
  }
}

// 单例实例
let dbInstance: DatabaseManager | null = null

export function getDatabase(): DatabaseManager {
  if (!dbInstance) {
    dbInstance = new DatabaseManager()
  }
  return dbInstance
}

export function resetDatabase(): void {
  dbInstance = null
}
