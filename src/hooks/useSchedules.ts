import { useState, useEffect, useCallback } from 'react'
import { ScheduleEvent, CreateScheduleParams, UpdateScheduleParams } from '../types'

export function useSchedules(userId: string | null) {
  const [schedules, setSchedules] = useState<ScheduleEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedules = useCallback(async () => {
    if (!userId) {
      setSchedules([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await window.electronAPI.getAllSchedules()
      setSchedules(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch schedules')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const createSchedule = async (params: CreateScheduleParams): Promise<ScheduleEvent | null> => {
    if (!userId) return null
    try {
      const event = await window.electronAPI.createSchedule(params)
      setSchedules(prev => [...prev, event])
      return event
    } catch (err) {
      setError('Failed to create schedule')
      console.error(err)
      return null
    }
  }

  const updateSchedule = async (id: string, params: UpdateScheduleParams): Promise<boolean> => {
    if (!userId) return false
    try {
      const success = await window.electronAPI.updateSchedule(id, params)
      if (success) {
        setSchedules(prev => prev.map(event => 
          event.id === id ? { ...event, ...params, updatedAt: Date.now() } : event
        ))
      }
      return success
    } catch (err) {
      setError('Failed to update schedule')
      console.error(err)
      return false
    }
  }

  const deleteSchedule = async (id: string): Promise<boolean> => {
    if (!userId) return false
    try {
      const success = await window.electronAPI.deleteSchedule(id)
      if (success) {
        setSchedules(prev => prev.filter(event => event.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete schedule')
      console.error(err)
      return false
    }
  }

  const getScheduleById = async (id: string): Promise<ScheduleEvent | null> => {
    if (!userId) return null
    try {
      return await window.electronAPI.getScheduleById(id)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  const getSchedulesInRange = async (start: number, end: number): Promise<ScheduleEvent[]> => {
    if (!userId) return []
    try {
      return await window.electronAPI.getSchedulesInRange(start, end)
    } catch (err) {
      console.error(err)
      return []
    }
  }

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getScheduleById,
    getSchedulesInRange,
    refresh: fetchSchedules
  }
}
