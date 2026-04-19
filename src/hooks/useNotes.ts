import { useState, useEffect, useCallback } from 'react'
import { Note, CreateNoteParams, UpdateNoteParams } from '../types'

export function useNotes(userId: string | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotes = useCallback(async () => {
    if (!userId) {
      setNotes([])
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const data = await window.electronAPI.getAllNotes()
      setNotes(data)
      setError(null)
    } catch (err) {
      setError('Failed to fetch notes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const createNote = async (params: CreateNoteParams): Promise<Note | null> => {
    if (!userId) {
      console.error('[useNotes] createNote: userId is null')
      return null
    }
    try {
      const note = await window.electronAPI.createNote(params)
      setNotes(prev => [note, ...prev])
      return note
    } catch (err) {
      setError('Failed to create note')
      console.error('Error creating note:', err)
      return null
    }
  }

  const updateNote = async (id: string, params: UpdateNoteParams): Promise<boolean> => {
    if (!userId) {
      console.error('[useNotes] updateNote: userId is null')
      return false
    }
    try {
      const success = await window.electronAPI.updateNote(id, params)
      if (success) {
        setNotes(prev => prev.map(note => 
          note.id === id ? { ...note, ...params, updatedAt: Date.now() } : note
        ))
      }
      return success
    } catch (err) {
      setError('Failed to update note')
      console.error('Error updating note:', err)
      return false
    }
  }

  const deleteNote = async (id: string): Promise<boolean> => {
    if (!userId) return false
    try {
      const success = await window.electronAPI.deleteNote(id)
      if (success) {
        setNotes(prev => prev.filter(note => note.id !== id))
      }
      return success
    } catch (err) {
      setError('Failed to delete note')
      console.error(err)
      return false
    }
  }

  const searchNotes = async (query: string): Promise<Note[]> => {
    if (!userId) return []
    try {
      return await window.electronAPI.searchNotes(query)
    } catch (err) {
      console.error(err)
      return []
    }
  }

  const getNoteById = async (id: string): Promise<Note | null> => {
    if (!userId) return null
    try {
      return await window.electronAPI.getNoteById(id)
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    getNoteById,
    refresh: fetchNotes
  }
}
