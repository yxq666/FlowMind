import { useState, useCallback } from 'react'
import { Note } from '../types'

export function useAI() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateTags = useCallback(async (content: string): Promise<string[]> => {
    try {
      setLoading(true)
      setError(null)
      return await window.electronAPI.generateTags(content)
    } catch (err) {
      setError('Failed to generate tags')
      console.error(err)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const generateSummary = useCallback(async (content: string): Promise<string> => {
    try {
      setLoading(true)
      setError(null)
      return await window.electronAPI.generateSummary(content)
    } catch (err) {
      setError('Failed to generate summary')
      console.error(err)
      return ''
    } finally {
      setLoading(false)
    }
  }, [])

  const classifyContent = useCallback(async (content: string): Promise<string> => {
    try {
      setLoading(true)
      setError(null)
      return await window.electronAPI.classifyContent(content)
    } catch (err) {
      setError('Failed to classify content')
      console.error(err)
      return 'general'
    } finally {
      setLoading(false)
    }
  }, [])

  const optimizeContent = useCallback(async (content: string, type: string): Promise<string> => {
    try {
      setLoading(true)
      setError(null)
      return await window.electronAPI.optimizeContent(content, type)
    } catch (err) {
      setError('Failed to optimize content')
      console.error(err)
      return content
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeNote = useCallback(async (note: Note): Promise<any> => {
    try {
      setLoading(true)
      setError(null)
      return await window.electronAPI.analyzeNote(note)
    } catch (err) {
      setError('Failed to analyze note')
      console.error(err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    generateTags,
    generateSummary,
    classifyContent,
    optimizeContent,
    analyzeNote
  }
}
