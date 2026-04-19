import React, { useState } from 'react'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'

interface AuthProps {
  onLogin: (token: string, user: any) => void
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('请输入昵称')
          setLoading(false)
          return
        }
        if (password.length < 6) {
          setError('密码至少6位')
          setLoading(false)
          return
        }
        const result = await window.electronAPI.register(email, password, name)
        if (result) {
          onLogin(result.token, result.user)
        } else {
          setError('该邮箱已被注册')
        }
      } else {
        const result = await window.electronAPI.login(email, password)
        if (result) {
          onLogin(result.token, result.user)
        } else {
          setError('邮箱或密码错误')
        }
      }
    } catch (err) {
      setError('操作失败，请重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">F</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">FlowMind</h1>
          <p className="text-gray-500 mt-1">
            {mode === 'login' ? '欢迎回来' : '创建账户'}
          </p>
        </div>

        {/* Tab Switch */}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'login'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              mode === 'register'
                ? 'bg-white text-purple-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            注册
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                昵称
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="输入昵称"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="输入邮箱"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少6位' : '输入密码'}
              required
              minLength={mode === 'register' ? 6 : 1}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : mode === 'login' ? (
              <>
                <LogIn size={18} />
                登录
              </>
            ) : (
              <>
                <UserPlus size={18} />
                注册
              </>
            )}
          </button>
        </form>

        {/* Demo Hint */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center">
            演示模式：注册后即可使用所有功能
          </p>
        </div>
      </div>
    </div>
  )
}
