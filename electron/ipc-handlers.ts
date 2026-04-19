import { ipcMain, dialog } from 'electron'
import { DatabaseManager } from '../src/db/database'
import { AIService } from '../src/services/ai-service'
import { Note, CreateNoteParams, UpdateNoteParams, CreateTaskParams, UpdateTaskParams, CreateScheduleParams, UpdateScheduleParams } from '../src/types'
import * as fs from 'fs'

const db = new DatabaseManager()
const aiService = new AIService()

// 获取当前请求的用户ID（从 header 获取）
// 在实际实现中，token 验证会返回用户信息
function getUserIdFromToken(token: string): string | null {
  const user = db.validateToken(token)
  return user?.id || null
}

export function setupIpcHandlers() {
  // 确保数据库有默认用户
  if (!db.getCurrentUserId()) {
    db.setCurrentUser('local-user')
  }
  // ============ 认证相关 ============
  ipcMain.handle('auth:register', (_, email: string, password: string, name: string) => {
    return db.register(email, password, name)
  })

  ipcMain.handle('auth:login', (_, email: string, password: string) => {
    return db.login(email, password)
  })

  ipcMain.handle('auth:logout', (_, token: string) => {
    db.logout(token)
  })

  ipcMain.handle('auth:validateToken', (_, token: string) => {
    return db.validateToken(token)
  })

  // 设置当前用户（现在可选，数据库会自动使用默认用户）
  ipcMain.handle('db:setCurrentUser', (_, userId: string) => {
    db.setCurrentUser(userId)
  })

  // ============ 笔记 CRUD ============
  ipcMain.handle('db:getAllNotes', () => {
    return db.getAllNotes()
  })

  ipcMain.handle('db:getNoteById', (_, id: string) => {
    return db.getNoteById(id)
  })

  ipcMain.handle('db:createNote', (_, note: CreateNoteParams) => {
    return db.createNote(note)
  })

  ipcMain.handle('db:updateNote', (_, id: string, note: UpdateNoteParams) => {
    return db.updateNote(id, note)
  })

  ipcMain.handle('db:deleteNote', (_, id: string) => {
    return db.deleteNote(id)
  })

  ipcMain.handle('db:searchNotes', (_, query: string) => {
    return db.searchNotes(query)
  })

  ipcMain.handle('db:getNotesByTag', (_, tag: string) => {
    return db.getNotesByTag(tag)
  })

  ipcMain.handle('db:getAllTags', () => {
    return db.getAllTags()
  })

  // ============ 任务 CRUD ============
  ipcMain.handle('db:getAllTasks', () => {
    return db.getAllTasks()
  })

  ipcMain.handle('db:getTaskById', (_, id: string) => {
    return db.getTaskById(id)
  })

  ipcMain.handle('db:createTask', (_, params: CreateTaskParams) => {
    return db.createTask(params)
  })

  ipcMain.handle('db:updateTask', (_, id: string, params: UpdateTaskParams) => {
    return db.updateTask(id, params)
  })

  ipcMain.handle('db:deleteTask', (_, id: string) => {
    return db.deleteTask(id)
  })

  ipcMain.handle('db:getTasksByStatus', (_, status: string) => {
    return db.getTasksByStatus(status)
  })

  // ============ 日程 CRUD ============
  ipcMain.handle('db:getAllSchedules', () => {
    return db.getAllSchedules()
  })

  ipcMain.handle('db:getScheduleById', (_, id: string) => {
    return db.getScheduleById(id)
  })

  ipcMain.handle('db:createSchedule', (_, params: CreateScheduleParams) => {
    return db.createSchedule(params)
  })

  ipcMain.handle('db:updateSchedule', (_, id: string, params: UpdateScheduleParams) => {
    return db.updateSchedule(id, params)
  })

  ipcMain.handle('db:deleteSchedule', (_, id: string) => {
    return db.deleteSchedule(id)
  })

  ipcMain.handle('db:getSchedulesInRange', (_, start: number, end: number) => {
    return db.getSchedulesInRange(start, end)
  })

  // ============ AI 服务 ============
  ipcMain.handle('ai:generateTags', (_, content: string) => {
    return aiService.generateTags(content)
  })

  ipcMain.handle('ai:generateSummary', (_, content: string) => {
    return aiService.generateSummary(content)
  })

  ipcMain.handle('ai:classifyContent', (_, content: string) => {
    return aiService.classifyContent(content)
  })

  ipcMain.handle('ai:optimizeContent', (_, content: string, type: string) => {
    return aiService.optimizeContent(content, type)
  })

  ipcMain.handle('ai:analyzeNote', (_, note: Note) => {
    return aiService.analyzeNote(note)
  })

  // ============ 文件操作 ============
  ipcMain.handle('file:selectImportFile', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'Text', extensions: ['txt'] },
        { name: 'JSON', extensions: ['json'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('file:selectExportDirectory', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('file:exportNote', async (_, id: string, format: 'md' | 'txt' | 'json') => {
    try {
      const note = db.getNoteById(id)
      if (!note) return false

      const result = await dialog.showSaveDialog({
        defaultPath: `${note.title || 'untitled'}.${format}`,
        filters: [
          { name: format.toUpperCase(), extensions: [format] }
        ]
      })

      if (result.canceled || !result.filePath) return false

      let content: string
      switch (format) {
        case 'json':
          content = JSON.stringify(note, null, 2)
          break
        case 'md':
          content = `# ${note.title}\n\n${note.content}\n\n---\n\nTags: ${note.tags.join(', ')}\nCreated: ${new Date(note.createdAt).toLocaleString()}\nUpdated: ${new Date(note.updatedAt).toLocaleString()}`
          break
        case 'txt':
        default:
          content = `${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}`
          break
      }

      fs.writeFileSync(result.filePath, content, 'utf-8')
      return true
    } catch (error) {
      console.error('Export error:', error)
      return false
    }
  })

  ipcMain.handle('file:exportData', async () => {
    try {
      const result = await dialog.showSaveDialog({
        defaultPath: `flowmind-export-${Date.now()}.json`,
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      })

      if (result.canceled || !result.filePath) return null

      const data = db.exportData()
      fs.writeFileSync(result.filePath, JSON.stringify(data, null, 2), 'utf-8')
      return data
    } catch (error) {
      console.error('Export error:', error)
      return null
    }
  })

  ipcMain.handle('file:importNotes', async (_, filePath: string) => {
    try {
      const content = fs.readFileSync(filePath, 'utf-8')
      const ext = filePath.split('.').pop()?.toLowerCase()
      const importedNotes: Note[] = []

      if (ext === 'json') {
        const data = JSON.parse(content)
        const notes = Array.isArray(data) ? data : [data]
        for (const note of notes) {
          const newNote = db.createNote({
            title: note.title || 'Imported Note',
            content: note.content || '',
            tags: note.tags || []
          })
          importedNotes.push(newNote)
        }
      } else if (ext === 'md' || ext === 'txt') {
        const lines = content.split('\n')
        let title = 'Imported Note'
        let bodyLines: string[] = []
        
        for (const line of lines) {
          if (line.startsWith('# ') && title === 'Imported Note') {
            title = line.substring(2).trim()
          } else {
            bodyLines.push(line)
          }
        }

        const newNote = db.createNote({
          title,
          content: bodyLines.join('\n').trim(),
          tags: []
        })
        importedNotes.push(newNote)
      }

      return importedNotes
    } catch (error) {
      console.error('Import error:', error)
      return []
    }
  })
}
