import React from 'react'
import { Search, Clock, Tag } from 'lucide-react'
import { Note } from '../types'

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const NoteList: React.FC<NoteListProps> = ({
  notes,
  selectedNote,
  onSelectNote,
  searchQuery,
  onSearchChange
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return '昨天'
    } else if (days < 7) {
      return `${days} 天前`
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  const getPreview = (content: string, maxLength: number = 60) => {
    const plainText = content.replace(/[#*`\[\]]/g, '').replace(/\n/g, ' ')
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* 搜索栏 */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 笔记列表 */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileTextIcon className="mb-2" size={48} />
            <p className="text-sm">暂无笔记</p>
            <p className="text-xs text-gray-400 mt-1">点击左侧新建按钮创建笔记</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`w-full text-left p-4 transition-colors hover:bg-white ${
                  selectedNote?.id === note.id ? 'bg-white border-l-4 border-blue-500' : ''
                }`}
              >
                <h3 className="font-medium text-gray-900 truncate mb-1">
                  {note.title || '无标题'}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {getPreview(note.content)}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {formatDate(note.updatedAt)}
                  </div>
                  {note.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Tag size={12} />
                      {note.tags.length}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// 简单的文件图标组件
const FileTextIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
)
