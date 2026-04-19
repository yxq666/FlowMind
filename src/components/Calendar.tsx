import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from 'lucide-react'
import { ScheduleEvent } from '../types'

interface CalendarProps {
  events: ScheduleEvent[]
  selectedEvent: ScheduleEvent | null
  onSelectEvent: (event: ScheduleEvent) => void
  onCreateEvent: (startTime: number, endTime: number) => void
  onUpdateEvent: (id: string, updates: Partial<ScheduleEvent>) => void
  onDeleteEvent: (id: string) => void
  view: 'day' | 'week' | 'month'
  onViewChange: (view: 'day' | 'week' | 'month') => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS_CN = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const Calendar: React.FC<CalendarProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
  onCreateEvent,
  onUpdateEvent,
  onDeleteEvent,
  view,
  onViewChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const startOfWeek = useMemo(() => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d
  }, [currentDate])

  const startOfMonth = useMemo(() => {
    const d = new Date(currentDate)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d
  }, [currentDate])

  const monthDays = useMemo(() => {
    const start = new Date(startOfMonth)
    const days: Date[] = []
    
    // 填充上月的日期
    const startDay = start.getDay()
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(start)
      d.setDate(d.getDate() - i - 1)
      days.push(d)
    }
    
    // 当月日期
    const end = new Date(start)
    end.setMonth(end.getMonth() + 1)
    end.setDate(0)
    
    for (let i = 1; i <= end.getDate(); i++) {
      const d = new Date(start)
      d.setDate(i)
      days.push(d)
    }
    
    // 填充下月的日期（补满6周）
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(end)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    
    return days
  }, [startOfMonth])

  const weekDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(d.getDate() + i)
      days.push(d)
    }
    return days
  }, [startOfWeek])

  const getEventsForDate = (date: Date) => {
    const start = date.getTime()
    const end = start + 24 * 60 * 60 * 1000
    return events.filter(e => 
      (e.startTime >= start && e.startTime < end) ||
      (e.endTime > start && e.endTime <= end) ||
      (e.startTime <= start && e.endTime >= end)
    )
  }

  const getEventsForHour = (date: Date, hour: number) => {
    const dayStart = new Date(date)
    dayStart.setHours(hour, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(hour, 59, 59, 999)
    
    return events.filter(e =>
      (e.startTime <= dayEnd.getTime() && e.endTime >= dayStart.getTime())
    )
  }

  const navigatePrev = () => {
    const newDate = new Date(currentDate)
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setCurrentDate(newDate)
  }

  const navigateNext = () => {
    const newDate = new Date(currentDate)
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const formatHeader = () => {
    if (view === 'month') {
      return `${currentDate.getFullYear()}年 ${currentDate.getMonth() + 1}月`
    } else if (view === 'week') {
      const weekStart = startOfWeek
      const weekEnd = new Date(startOfWeek)
      weekEnd.setDate(weekEnd.getDate() + 6)
      return `${weekStart.getMonth() + 1}/${weekStart.getDate()} - ${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`
    } else {
      return currentDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    }
  }

  const handleCellClick = (date: Date, hour?: number) => {
    const start = new Date(date)
    if (hour !== undefined) {
      start.setHours(hour, 0, 0, 0)
    }
    const end = new Date(start)
    end.setHours(end.getHours() + 1)
    onCreateEvent(start.getTime(), end.getTime())
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">日程</h2>
          
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={navigatePrev}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded"
            >
              今天
            </button>
            <button
              onClick={navigateNext}
              className="p-1.5 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <span className="text-lg font-medium">{formatHeader()}</span>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('day')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'day' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              日
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              周
            </button>
            <button
              onClick={() => onViewChange('month')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                view === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              月
            </button>
          </div>

          <button
            onClick={() => {
              const now = new Date()
              handleCellClick(now, now.getHours())
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
          >
            <Plus size={16} />
            新建日程
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        {view === 'month' ? (
          /* Month View */
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {DAYS_CN.map((day, i) => (
                <div key={day} className={`py-3 text-center text-sm font-medium ${
                  i === 0 || i === 6 ? 'text-gray-500' : 'text-gray-700'
                }`}>
                  {day}
                </div>
              ))}
            </div>

            {/* Day Cells */}
            <div className="grid grid-cols-7">
              {monthDays.map((date, index) => {
                const dayEvents = getEventsForDate(date)
                const isWeekend = date.getDay() === 0 || date.getDay() === 6
                
                return (
                  <div
                    key={index}
                    onClick={() => handleCellClick(date)}
                    className={`min-h-[100px] border-b border-r border-gray-100 p-1 cursor-pointer hover:bg-gray-50 transition-colors ${
                      !isCurrentMonth(date) ? 'bg-gray-50' : ''
                    } ${isWeekend ? 'bg-gray-50/50' : ''}`}
                  >
                    <div className={`text-sm p-1 ${
                      isToday(date) 
                        ? 'w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center' 
                        : isCurrentMonth(date)
                          ? 'text-gray-900'
                          : 'text-gray-400'
                    }`}>
                      {date.getDate()}
                    </div>
                    
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onSelectEvent(event)
                          }}
                          className={`text-xs px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                            event.taskId 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 px-1">
                          +{dayEvents.length - 3} 更多
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : view === 'week' ? (
          /* Week View */
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="py-3 text-center text-sm text-gray-500"></div>
              {weekDays.map((date, i) => (
                <div key={i} className={`py-3 text-center ${
                  isToday(date) ? 'bg-blue-50' : ''
                }`}>
                  <div className={`text-sm ${isToday(date) ? 'text-blue-600' : 'text-gray-500'}`}>
                    {DAYS_CN[date.getDay()]}
                  </div>
                  <div className={`text-lg font-medium ${
                    isToday(date) 
                      ? 'w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto'
                      : 'text-gray-900'
                  }`}>
                    {date.getDate()}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-8 relative">
              {/* Time Labels */}
              <div className="border-r border-gray-100">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-12 border-b border-gray-100 pr-2 text-right">
                    <span className="text-xs text-gray-400">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Columns */}
              {weekDays.map((date, dayIndex) => {
                const dayEvents = getEventsForDate(date)
                
                return (
                  <div key={dayIndex} className={`relative border-r border-gray-100 ${isToday(date) ? 'bg-blue-50/30' : ''}`}>
                    {HOURS.map((hour) => {
                      const hourEvents = getEventsForHour(date, hour)
                      
                      return (
                        <div
                          key={hour}
                          onClick={() => handleCellClick(date, hour)}
                          className="h-12 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        >
                          {hourEvents.map((event) => {
                            const eventStart = new Date(event.startTime)
                            const eventEnd = new Date(event.endTime)
                            const startMinutes = eventStart.getHours() === hour ? eventStart.getMinutes() : 0
                            const endMinutes = eventEnd.getHours() === hour ? eventEnd.getMinutes() : 60
                            const duration = endMinutes - startMinutes
                            
                            return (
                              <div
                                key={event.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onSelectEvent(event)
                                }}
                                style={{ height: `${duration * 0.67}px`, minHeight: '20px' }}
                                className={`absolute left-0.5 right-0.5 bg-blue-500 text-white text-xs px-1 rounded cursor-pointer hover:opacity-80 overflow-hidden ${
                                  event.taskId ? 'bg-purple-500' : ''
                                }`}
                              >
                                <div className="font-medium truncate">{event.title}</div>
                                {duration > 40 && (
                                  <div className="text-white/80 truncate">
                                    {eventStart.getHours()}:{eventStart.getMinutes().toString().padStart(2, '0')} - 
                                    {eventEnd.getHours()}:{eventEnd.getMinutes().toString().padStart(2, '0')}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="min-w-[600px]">
            {/* Day Header */}
            <div className="border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className={`py-4 text-center ${isToday(currentDate) ? 'bg-blue-50' : ''}`}>
                <div className={`text-sm ${isToday(currentDate) ? 'text-blue-600' : 'text-gray-500'}`}>
                  {DAYS_CN[currentDate.getDay()]}
                </div>
                <div className={`text-2xl font-medium mt-1 ${
                  isToday(currentDate) 
                    ? 'w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto'
                    : 'text-gray-900'
                }`}>
                  {currentDate.getDate()}
                </div>
              </div>
            </div>

            {/* Time Grid */}
            <div className="grid grid-cols-[80px_1fr] relative">
              {/* Time Labels */}
              <div className="border-r border-gray-100">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-16 border-b border-gray-100 pr-3 text-right flex items-start justify-end pt-1">
                    <span className="text-xs text-gray-400">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>
                ))}
              </div>

              {/* Day Column */}
              <div className={`relative ${isToday(currentDate) ? 'bg-blue-50/30' : ''}`}>
                {HOURS.map((hour) => {
                  const hourEvents = getEventsForHour(currentDate, hour)
                  
                  return (
                    <div
                      key={hour}
                      onClick={() => handleCellClick(currentDate, hour)}
                      className="h-16 border-b border-gray-100 hover:bg-gray-50 cursor-pointer relative"
                    >
                      {hourEvents.map((event) => {
                        const eventStart = new Date(event.startTime)
                        const eventEnd = new Date(event.endTime)
                        const startHour = eventStart.getHours()
                        const endHour = eventEnd.getHours()
                        const startMinutes = startHour === hour ? eventStart.getMinutes() : 0
                        const endMinutes = endHour === hour ? eventEnd.getMinutes() : 60
                        const duration = endMinutes - startMinutes
                        const topOffset = startMinutes * (64 / 60) // h-16 = 64px
                        
                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectEvent(event)
                            }}
                            style={{ 
                              top: `${topOffset}px`,
                              height: `${Math.max(duration * (64 / 60), 20)}px`
                            }}
                            className={`absolute left-1 right-1 bg-blue-500 text-white text-xs px-2 rounded cursor-pointer hover:opacity-90 overflow-hidden ${
                              event.taskId ? 'bg-purple-500' : ''
                            }`}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-white/80 truncate text-[10px]">
                              {eventStart.getHours()}:{eventStart.getMinutes().toString().padStart(2, '0')} - 
                              {eventEnd.getHours()}:{eventEnd.getMinutes().toString().padStart(2, '0')}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
