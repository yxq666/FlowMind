import React from 'react'
import { CheckCircle2, Circle, Clock, AlertCircle, MoreVertical, Trash2, Edit2, Link } from 'lucide-react'
import { Task, TaskStatus, TaskPriority } from '../types'

interface TaskListProps {
  tasks: Task[]
  selectedTask: Task | null
  onSelectTask: (task: Task) => void
  onCreateTask: () => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
  onDeleteTask: (id: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: TaskStatus | 'all'
  onStatusFilterChange: (status: TaskStatus | 'all') => void
}

const priorityConfig: Record<TaskPriority, { label: string; color: string; icon: typeof AlertCircle }> = {
  low: { label: '低', color: 'text-green-600 bg-green-50', icon: Clock },
  medium: { label: '中', color: 'text-yellow-600 bg-yellow-50', icon: AlertCircle },
  high: { label: '高', color: 'text-red-600 bg-red-50', icon: AlertCircle }
}

const statusConfig: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: '待办', color: 'text-gray-600 bg-gray-100' },
  in_progress: { label: '进行中', color: 'text-blue-600 bg-blue-100' },
  done: { label: '已完成', color: 'text-green-600 bg-green-100' }
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  selectedTask,
  onSelectTask,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const [menuOpenId, setMenuOpenId] = React.useState<string | null>(null)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchQuery || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDueDate = (timestamp: number | null) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return { text: '已过期', overdue: true }
    if (days === 0) return { text: '今天', overdue: false }
    if (days === 1) return { text: '明天', overdue: false }
    if (days < 7) return { text: `${days}天后`, overdue: false }
    return { text: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }), overdue: false }
  }

  const toggleStatus = (task: Task) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo'
    }
    onUpdateTask(task.id, { status: nextStatus[task.status] })
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">任务</h2>
          <button
            onClick={onCreateTask}
            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
          >
            + 新建
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1">
          {(['all', 'todo', 'in_progress', 'done'] as const).map((status) => (
            <button
              key={status}
              onClick={() => onStatusFilterChange(status)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' ? '全部' : statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <CheckCircle2 size={48} className="mb-2 opacity-50" />
            <p className="text-sm">暂无任务</p>
            <p className="text-xs text-gray-400 mt-1">点击新建按钮创建任务</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTasks.map((task) => {
              const priority = priorityConfig[task.priority]
              const status = statusConfig[task.status]
              const dueInfo = formatDueDate(task.dueDate)
              const isSelected = selectedTask?.id === task.id

              return (
                <div
                  key={task.id}
                  className={`relative p-4 hover:bg-white transition-colors cursor-pointer ${
                    isSelected ? 'bg-white border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => onSelectTask(task)}
                >
                  {/* Menu Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setMenuOpenId(menuOpenId === task.id ? null : task.id)
                    }}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded"
                  >
                    <MoreVertical size={16} className="text-gray-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpenId === task.id && (
                    <div className="absolute top-8 right-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleStatus(task)
                          setMenuOpenId(null)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <CheckCircle2 size={14} />
                        切换状态
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpenId(null)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                      >
                        <Edit2 size={14} />
                        编辑
                      </button>
                      {task.noteId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setMenuOpenId(null)
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          <Link size={14} />
                          查看笔记
                        </button>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('确定删除此任务？')) {
                            onDeleteTask(task.id)
                          }
                          setMenuOpenId(null)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600"
                      >
                        <Trash2 size={14} />
                        删除
                      </button>
                    </div>
                  )}

                  {/* Task Content */}
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleStatus(task)
                      }}
                      className="mt-0.5"
                    >
                      {task.status === 'done' ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : task.status === 'in_progress' ? (
                        <Clock size={20} className="text-blue-500" />
                      ) : (
                        <Circle size={20} className="text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-gray-900 truncate ${
                        task.status === 'done' ? 'line-through text-gray-500' : ''
                      }`}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        {/* Priority Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${priority.color}`}>
                          <priority.icon size={12} />
                          {priority.label}
                        </span>

                        {/* Due Date */}
                        {dueInfo && (
                          <span className={`text-xs ${
                            dueInfo.overdue ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            {dueInfo.text}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
