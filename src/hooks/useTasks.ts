import { useState, useEffect, useCallback } from 'react'
import { Task, CreateTaskParams, UpdateTaskParams } from '../types'

export function useTasks(userId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setTasks([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await window.electronAPI.getAllTasks()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const createTask = async (params: CreateTaskParams): Promise<Task | null> => {
    if (!userId) return null
    try {
      const task = await window.electronAPI.createTask(params)
      setTasks(prev => [...prev, task])
      return task
    } catch (err) {
      setError('Failed to create task')
      console.error(err)
      return null
    }
  }

  const updateTask = async (id: string, params: UpdateTaskParams): Promise<boolean> => {
    if (!userId) return false
    try {
      const success = await window.electronAPI.updateTask(id, params)
      if (success) {
        setTasks(prev => prev.map(task => 
          task.id === id ? { ...task, ...params, updatedAt: Date.now() } : task
        ))
      }
      return success
    } catch (err) {
      setError('Failed to update task')
      console.error(err)
      return false
    }
  }

  const deleteTask = async (id: string): Promise<boolean> => {
    if (!userId) return false
    try {
      const success = await window.electronAPI.deleteTask(id)
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete task')
      console.error(err)
      return false
    }
  }

  const getTaskById = async (id: string): Promise<Task | null> => {
    if (!userId) return null
    try {
      return await window.electronAPI.getTaskById(id)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    refresh: fetchTasks
  }
}
