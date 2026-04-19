import { useState, useEffect, useCallback } from 'react'
import { 
  Save, Trash2, Sparkles, Download, FileText 
} from 'lucide-react'
import { Note } from '../types'
import { useAI } from '../hooks/useAI'
import { TagInput } from './TagInput'
import { AIToolbar } from './AIToolbar'

interface EditorProps {
  note: Note | null
  onUpdate: (id: string, updates: Partial<Note>) => void
  onDelete: (id: string) => void
}

export const Editor: React.FC<EditorProps> = ({ note, onUpdate, onDelete }) => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [showAIToolbar, setShowAIToolbar] = useState(false)
  const { generateTags, optimizeContent, loading: aiLoading } = useAI()

  // 当选择的笔记变化时，更新编辑器内容
  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setTags(note.tags)
      setHasChanges(false)
    } else {
      setTitle('')
      setContent('')
      setTags([])
      setHasChanges(false)
    }
  }, [note?.id])

  // 自动保存
  useEffect(() => {
    if (!hasChanges || !note) return

    const timer = setTimeout(() => {
      handleSave()
    }, 2000)

    return () => clearTimeout(timer)
  }, [title, content, tags, hasChanges])

  const handleSave = useCallback(() => {
    if (!note || !hasChanges) return
    
    onUpdate(note.id, {
      title,
      content,
      tags
    })
    setHasChanges(false)
  }, [note, title, content, tags, hasChanges, onUpdate])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    setHasChanges(true)
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setHasChanges(true)
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
    setHasChanges(true)
  }

  const handleAutoTag = async () => {
    const text = title + ' ' + content
    const suggestedTags = await generateTags(text)
    const uniqueTags = [...new Set([...tags, ...suggestedTags])]
    setTags(uniqueTags)
    setHasChanges(true)
  }

  const handleOptimize = async (type: string) => {
    const optimized = await optimizeContent(content, type)
    setContent(optimized)
    setHasChanges(true)
  }

  const handleExport = async (format: 'md' | 'txt' | 'json') => {
    if (!note) return
    await window.electronAPI.exportNote(note.id, format)
  }

  const handleDelete = () => {
    if (!note) return
    if (confirm('确定要删除这条笔记吗？')) {
      onDelete(note.id)
    }
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-400">
          <FileText size={64} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg">选择或创建一个笔记开始编辑</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {hasChanges && (
            <span className="text-xs text-orange-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              未保存
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* AI 功能 */}
          <button
            onClick={() => setShowAIToolbar(!showAIToolbar)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
              showAIToolbar ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <Sparkles size={16} />
            AI 助手
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* 导出 */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm hover:bg-gray-100 text-gray-700 transition-colors">
              <Download size={16} />
              导出
            </button>
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button onClick={() => handleExport('md')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg">
                Markdown
              </button>
              <button onClick={() => handleExport('txt')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                纯文本
              </button>
              <button onClick={() => handleExport('json')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 last:rounded-b-lg">
                JSON
              </button>
            </div>
          </div>

          {/* 删除 */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm hover:bg-red-50 text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>

          {/* 保存 */}
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`flex items-center gap-1 px-4 py-1.5 rounded-md text-sm transition-colors ${
              hasChanges
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Save size={16} />
            保存
          </button>
        </div>
      </div>

      {/* AI 工具栏 */}
      {showAIToolbar && (
        <AIToolbar
          onAutoTag={handleAutoTag}
          onOptimize={handleOptimize}
          loading={aiLoading}
        />
      )}

      {/* 编辑器内容 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-6">
          {/* 标题输入 */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="笔记标题"
            className="w-full text-3xl font-bold text-gray-900 placeholder-gray-400 border-none outline-none bg-transparent mb-4"
          />

          {/* 标签输入 */}
          <div className="mb-6">
            <TagInput tags={tags} onChange={handleTagsChange} />
          </div>

          {/* 内容输入 */}
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="开始写作..."
            className="w-full h-[calc(100vh-300px)] resize-none text-gray-700 leading-relaxed placeholder-gray-400 border-none outline-none bg-transparent"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {/* 底部信息 */}
      <div className="px-6 py-2 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
        <span>
          创建于 {new Date(note.createdAt).toLocaleString('zh-CN')}
        </span>
        <span>
          更新于 {new Date(note.updatedAt).toLocaleString('zh-CN')}
        </span>
      </div>
    </div>
  )
}
