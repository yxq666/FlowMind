import { Note, AIAnalysisResult } from '../types'

// 标签关键词映射（fallback）
const keywordMap: Record<string, string[]> = {
  work: ['工作', '项目', '任务', 'deadline', '会议', '汇报', '客户', '需求', '开发', '代码', '进度', '交付', '排期', '周报', '月报'],
  personal: ['生活', '日记', '心情', '家庭', '朋友', '周末', '假期', '旅行', '购物', '健康', '运动', '美食', '电影', '音乐'],
  idea: ['想法', '创意', '灵感', '构思', '设计', '方案', '改进', '优化', '创新', '突破', '尝试', '实验'],
  important: ['重要', '紧急', '关键', '注意', '提醒', '必须', '立即', '优先', '核心', '重点', '务必'],
  meeting: ['会议', '讨论', '纪要', '议程', '决议', '参会', '发言', '结论', '待办', '行动项'],
  reading: ['阅读', '书籍', '文章', '学习', '笔记', '摘抄', '推荐', '书评', '知识点', '总结'],
  tech: ['技术', '编程', '算法', '架构', '框架', '工具', '开源', 'GitHub', 'API', '数据库'],
  finance: ['财务', '预算', '报销', '发票', '合同', '付款', '收入', '支出', '理财', '投资']
}

// ============ AI API 配置 ============
interface AIConfig {
  provider: 'openai' | 'claude' | 'kimi' | 'rule-based'
  apiKey?: string
  baseUrl?: string
  model?: string
}

const defaultConfig: AIConfig = {
  provider: 'rule-based' // 默认使用规则引擎
}

let aiConfig: AIConfig = { ...defaultConfig }

export function configureAI(config: Partial<AIConfig>) {
  aiConfig = { ...aiConfig, ...config }
}

// ============ AI API 调用 ============
async function callAI(messages: { role: string; content: string }[], options?: { temperature?: number; maxTokens?: number }): Promise<string> {
  const { provider, apiKey, baseUrl, model } = aiConfig

  if (provider === 'rule-based' || !apiKey) {
    throw new Error('No valid AI provider configured')
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  let endpoint = ''
  let body: any = {
    messages,
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1000
  }

  switch (provider) {
    case 'openai':
      headers['Authorization'] = `Bearer ${apiKey}`
      endpoint = (baseUrl || 'https://api.openai.com/v1') + '/chat/completions'
      body.model = model || 'gpt-3.5-turbo'
      break

    case 'claude':
      headers['x-api-key'] = apiKey
      headers['anthropic-version'] = '2023-06-01'
      endpoint = (baseUrl || 'https://api.anthropic.com') + '/v1/messages'
      body.model = model || 'claude-3-haiku-20240307'
      delete body.max_tokens
      body.max_tokens = options?.maxTokens || 1024
      break

    case 'kimi':
      headers['Authorization'] = `Bearer ${apiKey}`
      endpoint = (baseUrl || 'https://api.moonshot.cn/v1') + '/chat/completions'
      body.model = model || 'moonshot-v1-8k'
      break
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`)
    }

    const data = await response.json()

    // 解析不同 provider 的响应格式
    switch (provider) {
      case 'openai':
      case 'kimi':
        return data.choices?.[0]?.message?.content || ''
      case 'claude':
        return data.content?.[0]?.text || ''
      default:
        return ''
    }
  } catch (error) {
    console.error('AI API call failed:', error)
    throw error
  }
}

// ============ AI 服务类 ============
export class AIService {
  
  /**
   * 基于关键词规则生成标签
   */
  generateTags(content: string): string[] {
    if (!content || content.trim().length === 0) {
      return []
    }

    const tags: string[] = []
    const lowerContent = content.toLowerCase()

    for (const [tag, keywords] of Object.entries(keywordMap)) {
      for (const keyword of keywords) {
        if (lowerContent.includes(keyword.toLowerCase())) {
          if (!tags.includes(tag)) {
            tags.push(tag)
          }
          break
        }
      }
    }

    if (tags.length === 0) {
      const extractedTags = this.extractKeywords(content, 3)
      tags.push(...extractedTags)
    }

    return tags
  }

  /**
   * 调用 AI 生成标签
   */
  async generateTagsAI(content: string): Promise<string[]> {
    if (!content || content.trim().length === 0) {
      return []
    }

    try {
      const systemPrompt = `你是一个标签生成助手。根据用户的内容，生成3-5个相关的中文标签。
标签应该是简洁的词语，如：工作、个人、重要、会议、创意、学习、技术、财务等。
只返回标签列表，用逗号分隔，不要其他内容。`

      const response = await callAI([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `请为以下内容生成标签：\n\n${content.substring(0, 2000)}` }
      ])

      return response.split(/[,，、\n]/)
        .map(t => t.trim())
        .filter(t => t.length > 0)
        .slice(0, 5)
    } catch (error) {
      // fallback to rule-based
      return this.generateTags(content)
    }
  }

  /**
   * 生成内容摘要
   */
  generateSummary(content: string, maxLength: number = 100): string {
    if (!content || content.trim().length === 0) {
      return ''
    }

    const cleanContent = content
      .replace(/[#*`\[\]\(\)]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

    if (cleanContent.length <= maxLength) {
      return cleanContent
    }

    const sentences = cleanContent.split(/[。！？.!?]/)
    let summary = ''
    
    for (const sentence of sentences) {
      if ((summary + sentence).length <= maxLength) {
        summary += sentence + '。'
      } else {
        break
      }
    }

    if (summary.length < maxLength / 2) {
      summary = cleanContent.substring(0, maxLength) + '...'
    }

    return summary.trim()
  }

  /**
   * 调用 AI 生成摘要
   */
  async generateSummaryAI(content: string, maxLength: number = 100): Promise<string> {
    if (!content || content.trim().length === 0) {
      return ''
    }

    try {
      const response = await callAI([
        { 
          role: 'system', 
          content: `你是一个摘要生成助手。请用约${maxLength}个字生成内容的摘要。要求简洁、有信息量。` 
        },
        { role: 'user', content: `请为以下内容生成摘要：\n\n${content.substring(0, 3000)}` }
      ])

      return response.trim().substring(0, maxLength)
    } catch (error) {
      return this.generateSummary(content, maxLength)
    }
  }

  /**
   * 内容分类
   */
  classifyContent(content: string): string {
    if (!content || content.trim().length === 0) {
      return 'uncategorized'
    }

    const tags = this.generateTags(content)
    
    if (tags.length === 0) {
      return 'general'
    }

    const priorityOrder = ['important', 'work', 'meeting', 'idea', 'reading', 'personal', 'tech', 'finance']
    
    for (const priority of priorityOrder) {
      if (tags.includes(priority)) {
        return priority
      }
    }

    return tags[0]
  }

  /**
   * 调用 AI 进行分类
   */
  async classifyContentAI(content: string): Promise<string> {
    if (!content || content.trim().length === 0) {
      return 'uncategorized'
    }

    try {
      const response = await callAI([
        { 
          role: 'system', 
          content: `你是一个内容分类助手。请将内容分类到以下类别之一：
- work（工作）
- personal（个人生活）
- meeting（会议）
- idea（创意想法）
- reading（阅读学习）
- tech（技术）
- finance（财务）
- important（重要事项）
- general（一般）

只返回分类名称，不要其他内容。` 
        },
        { role: 'user', content: `请分类以下内容：\n\n${content.substring(0, 2000)}` }
      ])

      const validCategories = ['work', 'personal', 'meeting', 'idea', 'reading', 'tech', 'finance', 'important', 'general']
      const category = response.trim().toLowerCase()
      return validCategories.includes(category) ? category : 'general'
    } catch (error) {
      return this.classifyContent(content)
    }
  }

  /**
   * 内容优化
   */
  optimizeContent(content: string, type: string): string {
    if (!content || content.trim().length === 0) {
      return content
    }

    switch (type) {
      case 'grammar':
        return this.fixGrammar(content)
      case 'concise':
        return this.makeConcise(content)
      case 'expand':
        return this.expandContent(content)
      case 'formal':
        return this.makeFormal(content)
      case 'casual':
        return this.makeCasual(content)
      default:
        return content
    }
  }

  /**
   * 调用 AI 优化内容
   */
  async optimizeContentAI(content: string, type: string): Promise<string> {
    if (!content || content.trim().length === 0) {
      return content
    }

    const typeInstructions: Record<string, string> = {
      grammar: '修正语法错误和错别字',
      concise: '精简内容，删除冗余表达',
      expand: '扩展内容，使其更详细',
      formal: '改为正式语气',
      casual: '改为口语化表达'
    }

    try {
      const instruction = typeInstructions[type] || '优化内容'
      const response = await callAI([
        { 
          role: 'system', 
          content: `你是一个内容优化助手。请${instruction}。只返回优化后的内容，不要解释。` 
        },
        { role: 'user', content: `请优化以下内容：\n\n${content}` }
      ])

      return response.trim()
    } catch (error) {
      return this.optimizeContent(content, type)
    }
  }

  /**
   * 提取关键词
   */
  private extractKeywords(content: string, count: number = 5): string[] {
    const words = content
      .toLowerCase()
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 2)

    const frequency = new Map<string, number>()
    const stopWords = new Set(['这个', '那个', '然后', '就是', '什么', '可以', '需要', '进行', '使用', '通过'])

    for (const word of words) {
      if (!stopWords.has(word) && word.length >= 2) {
        frequency.set(word, (frequency.get(word) || 0) + 1)
      }
    }

    return Array.from(frequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word]) => word)
  }

  private fixGrammar(content: string): string {
    return content
      .replace(/，\s*/g, '，')
      .replace(/。\s*/g, '。')
      .replace(/！\s*/g, '！')
      .replace(/？\s*/g, '？')
      .replace(/:\s*/g, '：')
      .replace(/;\s*/g, '；')
      .replace(/\s+/g, ' ')
      .trim()
  }

  private makeConcise(content: string): string {
    return content
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .replace(/(然后|接着|还有|另外|此外)[，,]/g, '')
      .trim()
  }

  private expandContent(content: string): string {
    const lines = content.split('\n')
    const expanded: string[] = []

    for (const line of lines) {
      expanded.push(line)
      if (line.trim() && !line.startsWith('#') && !line.startsWith('-')) {
        expanded.push('')
      }
    }

    return expanded.join('\n').trim()
  }

  private makeFormal(content: string): string {
    const informalPatterns: [RegExp, string][] = [
      [/我觉得/g, '我认为'],
      [/挺好的/g, '效果良好'],
      [/还行/g, '尚可'],
      [/搞定/g, '完成'],
      [/啥/g, '什么'],
      [/咋/g, '怎么'],
    ]

    let result = content
    for (const [pattern, replacement] of informalPatterns) {
      result = result.replace(pattern, replacement)
    }

    return result
  }

  private makeCasual(content: string): string {
    const formalPatterns: [RegExp, string][] = [
      [/笔者认为/g, '我觉得'],
      [/综上所述/g, '总的来说'],
      [/因此/g, '所以'],
      [/然而/g, '不过'],
      [/此外/g, '还有'],
    ]

    let result = content
    for (const [pattern, replacement] of formalPatterns) {
      result = result.replace(pattern, replacement)
    }

    return result
  }

  /**
   * 分析笔记内容，返回建议
   */
  analyzeNote(note: Note): AIAnalysisResult {
    const wordCount = this.countWords(note.content)
    const readingTime = Math.ceil(wordCount / 300)

    return {
      suggestedTags: this.generateTags(note.title + ' ' + note.content),
      summary: this.generateSummary(note.content),
      category: this.classifyContent(note.content),
      wordCount,
      readingTime
    }
  }

  /**
   * 调用 AI 分析笔记
   */
  async analyzeNoteAI(note: Note): Promise<AIAnalysisResult> {
    const wordCount = this.countWords(note.content)
    const readingTime = Math.ceil(wordCount / 300)

    try {
      const [tags, summary, category] = await Promise.all([
        this.generateTagsAI(note.title + ' ' + note.content),
        this.generateSummaryAI(note.content),
        this.classifyContentAI(note.content)
      ])

      return {
        suggestedTags: tags,
        summary,
        category,
        wordCount,
        readingTime
      }
    } catch (error) {
      return this.analyzeNote(note)
    }
  }

  private countWords(content: string): number {
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length
    const englishWords = (content.match(/[a-zA-Z]+/g) || []).length
    return chineseChars + englishWords
  }
}
