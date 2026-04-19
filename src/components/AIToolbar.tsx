import React from 'react'
import { 
  Sparkles, Wand2, AlignLeft, Type, 
  MessageSquare, Loader2 
} from 'lucide-react'

interface AIToolbarProps {
  onAutoTag: () => void
  onOptimize: (type: string) => void
  loading: boolean
}

export const AIToolbar: React.FC<AIToolbarProps> = ({ 
  onAutoTag, 
  onOptimize, 
  loading 
}) => {
  const optimizeOptions = [
    { id: 'grammar', label: '修正语法', icon: Type },
    { id: 'concise', label: '精简内容', icon: AlignLeft },
    { id: 'expand', label: '扩展内容', icon: MessageSquare },
    { id: 'formal', label: '正式语气', icon: Wand2 },
    { id: 'casual', label: '口语化', icon: MessageSquare },
  ]

  return (
    <div className="px-6 py-3 bg-purple-50 border-b border-purple-100">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-purple-700">
          <Sparkles size={18} />
          <span className="font-medium text-sm">AI 助手</span>
        </div>

        <div className="h-6 w-px bg-purple-200" />

        {/* 自动标签 */}
        <button
          onClick={onAutoTag}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-white text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
          智能标签
        </button>

        <div className="h-6 w-px bg-purple-200" />

        {/* 优化选项 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-purple-600">优化：</span>
          {optimizeOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onOptimize(option.id)}
              disabled={loading}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-white text-gray-700 border border-gray-200 hover:border-purple-300 hover:text-purple-700 transition-colors disabled:opacity-50"
            >
              <option.icon size={12} />
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
