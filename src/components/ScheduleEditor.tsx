import React, { useState, useEffect } from 'react'
import { Save, Trash2, Calendar, Clock, Repeat, Link as LinkIcon, X } from 'lucide-react'
import { ScheduleEvent, CreateScheduleParams, RepeatType } from '../types'

interface ScheduleEditorProps {
  event: ScheduleEvent | null
  isCreating: boolean
  defaultStart?: number
  defaultEnd?: number
  onSave: (params: CreateScheduleParams) => void
  onUpdate: (id: string, updates: Partial<ScheduleEvent>) => void
  onDelete: (id: string) => void
  onCloseCreate: () => void
}

const repeatOptions: { value: RepeatType; label: string }[] = [
  { value: 'none', label: '不重复' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'yearly', label: '每年' }
]

export const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  event,
  isCreating,
  defaultStart,
  defaultEnd,
  onSave,
  onUpdate,
  onDelete,
  onCloseCreate
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [repeat, setRepeat] = useState<RepeatType>('none')
  const [taskId, setTaskId] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setStartTime(new Date(event.startTime).toISOString().slice(0, 16))
      setEndTime(new Date(event.endTime).toISOString().slice(0, 16))
      setRepeat(event.repeat)
      setTaskId(event.taskId || '')
      setHasChanges(false)
    } else if (isCreating) {
      const now = new Date()
      const start = defaultStart ? new Date(defaultStart) : now
      const end = defaultEnd ? new Date(defaultEnd) : new Date(now.getTime() + 60 * 60 * 1000)
      
      setTitle('')
      setDescription('')
      setStartTime(start.toISOString().slice(0, 16))
      setEndTime(end.toISOString().slice(0, 16))
      setRepeat('none')
      setTaskId('')
      setHasChanges(false)
    }
  }, [event?.id, isCreating, defaultStart, defaultEnd])

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!title.trim()) return

    const params: CreateScheduleParams = {
      title: title.trim(),
      description: description.trim(),
      startTime: new Date(startTime).getTime(),
      endTime: new Date(endTime).getTime(),
      repeat,
      taskId: taskId || null
    }

    if (isCreating) {
      onSave(params)
    } else if (event) {
      onUpdate(event.id, params)
    }
    setHasChanges(false)
  }

  const handleDelete = () => {
    if (!event) return
    if (confirm('确定删除此日程？')) {
      onDelete(event.id)
    }
  }

  if (!event && !isCreating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <Calendar size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">选择或创建一个日程</p>
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
            {isCreating ? '新建日程' : '编辑日程'}
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
            disabled={!title.trim()}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-sm transition-colors ${
              title.trim()
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
              日程标题 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleChange(setTitle)(e.target.value)}
              placeholder="输入日程标题"
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
              placeholder="添加日程描述..."
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始时间
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => handleChange(setStartTime)(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                结束时间
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => handleChange(setEndTime)(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Repeat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              重复
            </label>
            <div className="relative">
              <Repeat size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={repeat}
                onChange={(e) => handleChange(setRepeat)(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white"
              >
                {repeatOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Task Link */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              关联任务
            </label>
            <div className="relative">
              <LinkIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={taskId}
                onChange={(e) => handleChange(setTaskId)(e.target.value)}
                placeholder="输入关联的任务ID（可选）"
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isCreating && event && (
        <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
          <span>创建于 {new Date(event.createdAt).toLocaleString('zh-CN')}</span>
          <span>更新于 {new Date(event.updatedAt).toLocaleString('zh-CN')}</span>
        </div>
      )}
    </div>
  )
}
