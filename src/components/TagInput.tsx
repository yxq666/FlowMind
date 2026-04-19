import React, { useState, KeyboardEvent } from 'react'
import { X, Plus, Tag } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
}

export const TagInput: React.FC<TagInputProps> = ({ 
  tags, 
  onChange, 
  suggestions = [] 
}) => {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const addTag = (tag: string) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setInput('')
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  )

  // 预设标签颜色
  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      work: 'bg-blue-100 text-blue-700 border-blue-200',
      personal: 'bg-green-100 text-green-700 border-green-200',
      idea: 'bg-purple-100 text-purple-700 border-purple-200',
      important: 'bg-red-100 text-red-700 border-red-200',
      meeting: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      reading: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      tech: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      finance: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    return colors[tag] || 'bg-gray-100 text-gray-700 border-gray-200'
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
        <Tag size={16} className="text-gray-400" />
        
        {tags.map((tag) => (
          <span
            key={tag}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getTagColor(tag)}`}
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="hover:bg-black/10 rounded p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder={tags.length === 0 ? '添加标签...' : ''}
          className="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* 建议下拉 */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
            >
              <Plus size={14} className="text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
