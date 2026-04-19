import React, { useState, useCallback, useEffect } from 'react'
import { Layout } from './components/Layout'
import { useNotes } from './hooks/useNotes'
import { useTags } from './hooks/useTags'
import { useTasks } from './hooks/useTasks'
import { useSchedules } from './hooks/useSchedules'
import { Note, Task, ScheduleEvent, TaskStatus, CreateTaskParams } from './types'

// 模拟已登录用户（去掉登录功能后使用）
const mockUser = { id: 'local-user', name: '本地用户', email: 'local@flowmind.app' }

function App() {
  // Notes
  const { notes, createNote, updateNote, deleteNote, refresh: refreshNotes } = useNotes(mockUser.id)
  const { tags, refresh: refreshTags } = useTags(mockUser.id)
  
  // Tasks
  const { tasks, createTask, updateTask, deleteTask } = useTasks(mockUser.id)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [taskSearchQuery, setTaskSearchQuery] = useState('')
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | TaskStatus>('all')
  
  // Schedules
  const { schedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules(mockUser.id)
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleEvent | null>(null)
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false)
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week')
  const [scheduleDefaults, setScheduleDefaults] = useState<{ start: number; end: number } | null>(null)
  
  // Notes state
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([])
  
  // Active view
  const [activeView, setActiveView] = useState<'notes' | 'tasks' | 'schedules'>('notes')

  // 数据库现在自动使用默认用户，无需手动设置
  // 保留此useEffect用于未来可能的初始化操作
  useEffect(() => {
    // 初始化完成，可以在这里添加其他启动逻辑
  }, [])

  // Filter notes
  useEffect(() => {
    let result = notes

    if (selectedTags.length > 0) {
      result = result.filter(note => 
        selectedTags.some(tag => note.tags.includes(tag))
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      )
    }

    setFilteredNotes(result)
  }, [notes, searchQuery, selectedTags])

  // Handlers
  const handleSelectNote = useCallback((note: Note) => {
    setSelectedNote(note)
  }, [])

  const handleCreateNote = useCallback(async () => {
    const newNote = await createNote({
      title: '',
      content: '',
      tags: []
    })
    if (newNote) {
      setSelectedNote(newNote)
    }
  }, [createNote])

  // 初始化空笔记（仅首次加载时）
  useEffect(() => {
    let isMounted = true
    
    const initEmptyNote = async () => {
      // 如果没有笔记，创建一个空笔记
      if (notes.length === 0 && !selectedNote) {
        const newNote = await createNote({
          title: '',
          content: '',
          tags: []
        })
        if (newNote && isMounted) {
          setSelectedNote(newNote)
        }
      }
    }
    
    initEmptyNote()
    
    return () => {
      isMounted = false
    }
  }, []) // 空依赖数组，确保只在组件首次挂载时执行

  const handleUpdateNote = useCallback(async (id: string, updates: Partial<Note>) => {
    await updateNote(id, updates)
    if (selectedNote?.id === id) {
      setSelectedNote(prev => prev ? { ...prev, ...updates } : null)
    }
    await refreshTags()
  }, [updateNote, selectedNote, refreshTags])

  const handleDeleteNote = useCallback(async (id: string) => {
    await deleteNote(id)
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
    await refreshTags()
  }, [deleteNote, selectedNote, refreshTags])

  const handleTagSelect = useCallback((tag: string) => {
    setSelectedTags(prev => {
      if (tag === '') return []
      if (prev.includes(tag)) return prev.filter(t => t !== tag)
      return [...prev, tag]
    })
  }, [])

  // Task handlers
  const handleSelectTask = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsCreatingTask(false)
  }, [])

  const handleCreateTask = useCallback(() => {
    setSelectedTask(null)
    setIsCreatingTask(true)
  }, [])

  const handleSaveTask = useCallback(async (params: CreateTaskParams) => {
    const task = await createTask(params)
    if (task) {
      setSelectedTask(task)
      setIsCreatingTask(false)
    }
  }, [createTask])

  const handleUpdateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    await updateTask(id, updates)
    if (selectedTask?.id === id) {
      setSelectedTask(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [updateTask, selectedTask])

  const handleDeleteTask = useCallback(async (id: string) => {
    await deleteTask(id)
    if (selectedTask?.id === id) {
      setSelectedTask(null)
    }
    setIsCreatingTask(false)
  }, [deleteTask, selectedTask])

  const handleCloseCreateTask = useCallback(() => {
    setIsCreatingTask(false)
  }, [])

  // Schedule handlers
  const handleSelectSchedule = useCallback((event: ScheduleEvent) => {
    setSelectedSchedule(event)
    setIsCreatingSchedule(false)
    setScheduleDefaults(null)
  }, [])

  const handleCreateSchedule = useCallback((start: number, end: number) => {
    setSelectedSchedule(null)
    setIsCreatingSchedule(true)
    setScheduleDefaults({ start, end })
  }, [])

  const handleSaveSchedule = useCallback(async (params: any) => {
    const event = await createSchedule(params)
    if (event) {
      setSelectedSchedule(event)
      setIsCreatingSchedule(false)
      setScheduleDefaults(null)
    }
  }, [createSchedule])

  const handleUpdateSchedule = useCallback(async (id: string, updates: Partial<ScheduleEvent>) => {
    await updateSchedule(id, updates)
    if (selectedSchedule?.id === id) {
      setSelectedSchedule(prev => prev ? { ...prev, ...updates } : null)
    }
  }, [updateSchedule, selectedSchedule])

  const handleDeleteSchedule = useCallback(async (id: string) => {
    await deleteSchedule(id)
    if (selectedSchedule?.id === id) {
      setSelectedSchedule(null)
    }
    setIsCreatingSchedule(false)
  }, [deleteSchedule, selectedSchedule])

  const handleCloseCreateSchedule = useCallback(() => {
    setIsCreatingSchedule(false)
    setScheduleDefaults(null)
  }, [])

  // Logout handler
  const handleLogout = useCallback(() => {
    // 不再做登出操作，直接刷新即可
    setSelectedNote(null)
    setSelectedTask(null)
    setSelectedSchedule(null)
    setActiveView('notes')
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        if (activeView === 'notes') handleCreateNote()
        else if (activeView === 'tasks') handleCreateTask()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeView, handleCreateNote, handleCreateTask])

  return (
    <Layout
      user={{ name: mockUser.name, email: mockUser.email }}
      onLogout={handleLogout}
      activeView={activeView}
      onViewChange={setActiveView}
      notes={filteredNotes}
      selectedNote={selectedNote}
      onSelectNote={handleSelectNote}
      onCreateNote={handleCreateNote}
      onUpdateNote={handleUpdateNote}
      onDeleteNote={handleDeleteNote}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      selectedTags={selectedTags}
      onTagSelect={handleTagSelect}
      tags={tags}
      tasks={tasks}
      selectedTask={selectedTask}
      isCreatingTask={isCreatingTask}
      onSelectTask={handleSelectTask}
      onCreateTask={handleCreateTask}
      onSaveTask={handleSaveTask}
      onUpdateTask={handleUpdateTask}
      onDeleteTask={handleDeleteTask}
      onCloseCreateTask={handleCloseCreateTask}
      taskSearchQuery={taskSearchQuery}
      onTaskSearchChange={setTaskSearchQuery}
      taskStatusFilter={taskStatusFilter}
      onTaskStatusFilterChange={setTaskStatusFilter}
      schedules={schedules}
      selectedSchedule={selectedSchedule}
      isCreatingSchedule={isCreatingSchedule}
      calendarView={calendarView}
      onCalendarViewChange={setCalendarView}
      scheduleDefaultStart={scheduleDefaults?.start}
      scheduleDefaultEnd={scheduleDefaults?.end}
      onSelectSchedule={handleSelectSchedule}
      onCreateSchedule={handleCreateSchedule}
      onSaveSchedule={handleSaveSchedule}
      onUpdateSchedule={handleUpdateSchedule}
      onDeleteSchedule={handleDeleteSchedule}
      onCloseCreateSchedule={handleCloseCreateSchedule}
    />
  )
}

export default App
