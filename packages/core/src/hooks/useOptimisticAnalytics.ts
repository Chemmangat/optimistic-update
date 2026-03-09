import { useEffect, useRef } from 'react'

export interface AnalyticsEvent {
  operation: 'add' | 'remove' | 'update' | 'batch' | 'undo' | 'redo'
  success: boolean
  duration: number
  timestamp: number
}

export interface AnalyticsOptions {
  onEvent?: (event: AnalyticsEvent) => void
  trackErrors?: boolean
  trackTiming?: boolean
}

export function useOptimisticAnalytics(options: AnalyticsOptions = {}) {
  const { onEvent, trackErrors = true, trackTiming = true } = options
  const events = useRef<AnalyticsEvent[]>([])

  const track = (operation: AnalyticsEvent['operation'], success: boolean, duration: number) => {
    const event: AnalyticsEvent = {
      operation,
      success,
      duration,
      timestamp: Date.now(),
    }

    events.current.push(event)
    onEvent?.(event)

    // Keep only last 100 events
    if (events.current.length > 100) {
      events.current.shift()
    }
  }

  const getStats = () => {
    const total = events.current.length
    const successful = events.current.filter(e => e.success).length
    const failed = total - successful
    const avgDuration = events.current.reduce((sum, e) => sum + e.duration, 0) / total || 0

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      avgDuration,
      events: events.current,
    }
  }

  const clear = () => {
    events.current = []
  }

  useEffect(() => {
    return () => {
      events.current = []
    }
  }, [])

  return {
    track,
    getStats,
    clear,
  }
}
