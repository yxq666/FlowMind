import React from 'react'
import { Plus, Tag, Hash, Star, FileText, Settings, CheckSquare, Calendar, LogOut } from 'lucide-react'

interface SidebarProps {
  tags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
  onCreateNote: () => void
  activeView: 'notes' | 'tasks' | 'schedules'
  onViewChange: (view: 'notes' | 'tasks' | 'schedules') => void
  user: { name: string; email: string } | null
  onLogout: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  tags,
  selectedTags,
  onTagSelect,
  onCreateNote,
  activeView,
  onViewChange,
  user,
  onLogout
}) => {
  const quickFilters = [
    { name: '全部笔记', icon: FileText, value: '', view: 'notes' as const },
    { name: '重要', icon: Star, value: 'important', view: 'notes' as const },
    { name: '工作', icon: Hash, value: 'work', view: 'notes' as const },
    { name: '个人', icon: Tag, value: 'personal', view: 'notes' as const },
  ]

  const mainNav = [
    { name: '笔记', icon: FileText, view: 'notes' as const },
    { name: '任务', icon: CheckSquare, view: 'tasks' as const },
    { name: '日程', icon: Calendar, view: 'schedules' as const },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          FluxNote
        </h1>
      </div>

      {/* Main Navigation */}
      <div className="px-4 py-3 border-b border-gray-100">
        <nav className="space-y-1">
          {mainNav.map((item) => (
            <button
              key={item.name}
              onClick={() => onViewChange(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                activeView === item.view
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon size={18} />
              {item.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Notes Section */}
      {activeView === 'notes' && (
        <>
          {/* 新建按钮 */}
          <div className="p-4">
            <button
              onClick={onCreateNote}
              className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={18} />
              新建笔记
            </button>
          </div>

          {/* 快速筛选 */}
          <div className="px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              快速筛选
            </h3>
            <nav className="space-y-1">
              {quickFilters.map((filter) => (
                <button
                  key={filter.name}
                  onClick={() => onTagSelect(filter.value)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTags.includes(filter.value) || (filter.value === '' && selectedTags.length === 0)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <filter.icon size={16} />
                  {filter.name}
                </button>
              ))}
            </nav>
          </div>

          {/* 标签列表 */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              标签
            </h3>
            <div className="space-y-1">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onTagSelect(tag)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Tag size={16} />
                  <span className="capitalize">{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Tasks & Schedules have their own panels, show nothing extra */}

      {/* 底部设置 & User */}
      <div className="p-4 border-t border-gray-200">
        {user && (
          <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
            <div className="text-xs text-gray-500 truncate">{user.email}</div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button className="flex-1 flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <Settings size={16} />
            设置
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 px-3 py-2 rounded-md text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            title="退出登录"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
