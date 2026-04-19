import React from 'react'
import { Sidebar } from './Sidebar'
import { NoteList } from './NoteList'
import { Editor } from './Editor'
import { TaskList } from './TaskList'
import { TaskEditor } from './TaskEditor'
import { Calendar } from './Calendar'
import { ScheduleEditor } from './ScheduleEditor'
import { Note, Task, ScheduleEvent } from '../types'

type ViewType = 'notes' | 'tasks' | 'schedules'

interface LayoutProps {
  user: { name: string; email: string } | null
  onLogout: () => void
  activeView: ViewType
  onViewChange: (view: ViewType) => void
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onCreateNote: () => void
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onDeleteNote: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  tags: string[]
  tasks: Task[]
  selectedTask: Task | null
  isCreatingTask: boolean
  onSelectTask: (task: Task) => void
  onCreateTask: () => void
  onSaveTask: (params: any) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  onCloseCreateTask: () => void
  taskSearchQuery: string
  onTaskSearchChange: (query: string) => void
  taskStatusFilter: 'all' | 'todo' | 'in_progress' | 'done'
  onTaskStatusFilterChange: (status: 'all' | 'todo' | 'in_progress' | 'done') => void
  schedules: ScheduleEvent[]
  selectedSchedule: ScheduleEvent | null
  isCreatingSchedule: boolean
  calendarView: 'day' | 'week' | 'month'
  onCalendarViewChange: (view: 'day' | 'week' | 'month') => void
  scheduleDefaultStart?: number
  scheduleDefaultEnd?: number
  onSelectSchedule: (event: ScheduleEvent) => void
  onCreateSchedule: (start: number, end: number) => void
  onSaveSchedule: (params: any) => void
  onUpdateSchedule: (id: string, updates: Partial<ScheduleEvent>) => void
  onDeleteSchedule: (id: string) => void
  onCloseCreateSchedule: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  user,
  onLogout,
  activeView,
  onViewChange,
  notes,
  selectedNote,
  onSelectNote,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  selectedTags,
  onTagSelect,
  tags,
  tasks,
  selectedTask,
  isCreatingTask,
  onSelectTask,
  onCreateTask,
  onSaveTask,
  onUpdateTask,
  onDeleteTask,
  onCloseCreateTask,
  taskSearchQuery,
  onTaskSearchChange,
  taskStatusFilter,
  onTaskStatusFilterChange,
  schedules,
  selectedSchedule,
  isCreatingSchedule,
  calendarView,
  onCalendarViewChange,
  scheduleDefaultStart,
  scheduleDefaultEnd,
  onSelectSchedule,
  onCreateSchedule,
  onSaveSchedule,
  onUpdateSchedule,
  onDeleteSchedule,
  onCloseCreateSchedule
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 自定义标题栏 - 使窗口可拖拽 */}
      <div className="h-8 bg-gray-100 flex items-center px-3 shrink-0 select-none" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex-1 text-center text-xs text-gray-500">FlowMind</div>
      </div>
      {/* 主内容 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          tags={tags}
          selectedTags={selectedTags}
          onTagSelect={onTagSelect}
          onCreateNote={onCreateNote}
          activeView={activeView}
          onViewChange={onViewChange}
          user={user}
          onLogout={onLogout}
        />

        {/* 笔记视图 */}
        {activeView === 'notes' && (
          <>
            <NoteList
              notes={notes}
              selectedNote={selectedNote}
              onSelectNote={onSelectNote}
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
            <Editor
              note={selectedNote}
              onUpdate={onUpdateNote}
              onDelete={onDeleteNote}
            />
          </>
        )}

        {/* 任务视图 */}
        {activeView === 'tasks' && (
          <>
            <TaskList
              tasks={tasks}
              selectedTask={selectedTask}
              onSelectTask={onSelectTask}
              onCreateTask={onCreateTask}
              onUpdateTask={onUpdateTask}
              onDeleteTask={onDeleteTask}
              searchQuery={taskSearchQuery}
              onSearchChange={onTaskSearchChange}
              statusFilter={taskStatusFilter}
              onStatusFilterChange={onTaskStatusFilterChange}
            />
            <TaskEditor
              task={selectedTask}
              isCreating={isCreatingTask}
              onSave={onSaveTask}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onCloseCreate={onCloseCreateTask}
            />
          </>
        )}

        {/* 日程视图 */}
        {activeView === 'schedules' && (
          <div className="flex-1 flex">
            <Calendar
              events={schedules}
              selectedEvent={selectedSchedule}
              onSelectEvent={onSelectSchedule}
              onCreateEvent={onCreateSchedule}
              onUpdateEvent={onUpdateSchedule}
              onDeleteEvent={onDeleteSchedule}
              view={calendarView}
              onViewChange={onCalendarViewChange}
            />
            <ScheduleEditor
              event={selectedSchedule}
              isCreating={isCreatingSchedule}
              defaultStart={scheduleDefaultStart}
              defaultEnd={scheduleDefaultEnd}
              onSave={onSaveSchedule}
              onUpdate={onUpdateSchedule}
              onDelete={onDeleteSchedule}
              onCloseCreate={onCloseCreateSchedule}
            />
          </div>
        )}
      </div>
    </div>
  )
}
