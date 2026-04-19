import React, { useState, useEffect } from 'react'
import { Save, Trash2, Calendar, Link as LinkIcon, X, Loader2 } from 'lucide-react'
import { Task, TaskStatus, TaskPriority, CreateTaskParams } from '../types'

interface TaskEditorProps {
  task: Task | null
  isCreating: boolean
  onSave: (params: CreateTaskParams) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
  onDelete: (id: string) => void
  onCloseCreate: () => void
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: '待办' },
  { value: 'in_progress', label: '进行中' },
  { value: 'done', label: '已完成' }
]

const priorityOptions: { value: TaskPriority; label: string; color: string }[] = [
  { value: 'low', label: '低', color: 'bg-green-500' },
  { value: 'medium', label: '中', color: 'bg-yellow-500' },
  { value: 'high', label: '高', color: 'bg-red-500' }
]

export const TaskEditor: React.FC<TaskEditorProps> = ({
  task,
  isCreating,
  onSave,
  onUpdate,
  onDelete,
  onCloseCreate
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [noteId, setNoteId] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
      setPriority(task.priority)
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
      setNoteId(task.noteId || '')
      setHasChanges(false)
    } else if (isCreating) {
      setTitle('')
      setDescription('')
      setStatus('todo')
      setPriority('medium')
      setDueDate('')
      setNoteId('')
      setHasChanges(false)
    }
  }, [task?.id, isCreating])

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!title.trim()) return

    const params: CreateTaskParams = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).getTime() : null,
      noteId: noteId || null
    }

    if (isCreating) {
      onSave(params)
    } else if (task) {
      onUpdate(task.id, params)
    }
    setHasChanges(false)
  }

  const handleDelete = () => {
    if (!task) return
    if (confirm('确定删除此任务？')) {
      onDelete(task.id)
    }
  }

  if (!task && !isCreating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} />
          </div>
          <p className="text-lg">选择或创建一个任务</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          {isCreating && (
            <button
              onClick={onCloseCreate}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            {isCreating ? '新建任务' : '编辑任务'}
          </h2>
          {hasChanges && (
            <span className="text-xs text-orange-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              未保存
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isCreating && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm hover:bg-red-50 text-red-600 transition-colors"
            >
              <Trash2 size={16} />
              删除
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!title.trim() || (!hasChanges && !isCreating)}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-sm transition-colors ${
              title.trim() && (hasChanges || isCreating)
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              任务标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange(setTitle)(e.target.value)}
              placeholder="输入任务标题"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              描述
            </label>
            <textarea
              value={description}
              onChange={(e) => handleChange(setDescription)(e.target.value)}
              placeholder="添加任务描述..."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <div className="flex gap-2">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange(setStatus)(option.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      status === option.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <div className="flex gap-2">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleChange(setPriority)(option.value)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      priority === option.value
                        ? `${option.color} text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${option.color.replace('bg-', 'bg-')}`} 
                      style={{ backgroundColor: priority === option.value ? 'white' : option.color.replace('bg-', '') }} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              截止日期
            </label>
            <div className="relative">
              <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => handleChange(setDueDate)(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Note Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关联笔记
            </label>
            <div className="relative">
              <LinkIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={noteId}
                onChange={(e) => handleChange(setNoteId)(e.target.value)}
                placeholder="输入关联的笔记ID（可选）"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isCreating && task && (
        <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
          <span>创建于 {new Date(task.createdAt).toLocaleString('zh-CN')}</span>
          <span>更新于 {new Date(task.updatedAt).toLocaleString('zh-CN')}</span>
        </div>
      )}
    </div>
  )
}
