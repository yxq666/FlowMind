import { useState, useEffect, useCallback } from 'react'
import { User } from '../types'

const AUTH_TOKEN_KEY = 'flowmind_auth_token'
const AUTH_USER_KEY = 'flowmind_auth_user'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // 初始化时检查本地存储的认证状态
  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY)
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch (e) {
        localStorage.removeItem(AUTH_TOKEN_KEY)
        localStorage.removeItem(AUTH_USER_KEY)
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const result = await window.electronAPI.login(email, password)
      if (result) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user))
        setToken(result.token)
        setUser(result.user)
        return result
      }
      return null
    } catch (err) {
      console.error('Login error:', err)
      return null
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      const result = await window.electronAPI.register(email, password, name)
      if (result) {
        localStorage.setItem(AUTH_TOKEN_KEY, result.token)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(result.user))
        setToken(result.token)
        setUser(result.user)
        return result
      }
      return null
    } catch (err) {
      console.error('Register error:', err)
      return null
    }
  }, [])

  const logout = useCallback(() => {
    if (token) {
      window.electronAPI.logout(token)
    }
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
    setToken(null)
    setUser(null)
  }, [token])

  return {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout
  }
}
