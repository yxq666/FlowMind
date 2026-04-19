import { useState, useEffect, useCallback } from 'react'

export function useTags(userId: string | null) {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTags = useCallback(async () => {
    if (!userId) {
      setTags([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await window.electronAPI.getAllTags()
      setTags(data)
    } catch (err) {
      console.error('Failed to fetch tags:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTags()
  }, [fetchTags])

  const getNotesByTag = async (tag: string) => {
    if (!userId) return []
    try {
      return await window.electronAPI.getNotesByTag(tag)
    } catch (err) {
      console.error('Failed to get notes by tag:', err)
      return []
    }
  }

  return {
    tags,
    loading,
    refresh: fetchTags,
    getNotesByTag
  }
}
