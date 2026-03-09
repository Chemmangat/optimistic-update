/**
 * Development tools for debugging optimistic updates
 */

interface OptimisticEvent {
  type: 'update' | 'rollback' | 'success' | 'error'
  timestamp: number
  data: any
}

class OptimisticDevTools {
  private events: OptimisticEvent[] = []
  private enabled = false

  enable() {
    this.enabled = true
    if (typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined') {
      ((globalThis as any).window as any).__OPTIMISTIC_DEVTOOLS__ = this
    }
  }

  disable() {
    this.enabled = false
  }

  log(type: OptimisticEvent['type'], data: any) {
    if (!this.enabled) return

    const event: OptimisticEvent = {
      type,
      timestamp: Date.now(),
      data,
    }

    this.events.push(event)

    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events.shift()
    }

    // Log to console in dev mode
    if (process.env.NODE_ENV === 'development') {
      const emoji = {
        update: '⚡',
        rollback: '↩️',
        success: '✅',
        error: '❌',
      }[type]

      console.log(`${emoji} Optimistic ${type}:`, data)
    }
  }

  getEvents() {
    return this.events
  }

  clear() {
    this.events = []
  }

  getStats() {
    const total = this.events.length
    const updates = this.events.filter(e => e.type === 'update').length
    const rollbacks = this.events.filter(e => e.type === 'rollback').length
    const successes = this.events.filter(e => e.type === 'success').length
    const errors = this.events.filter(e => e.type === 'error').length

    return {
      total,
      updates,
      rollbacks,
      successes,
      errors,
      successRate: total > 0 ? (successes / total) * 100 : 0,
    }
  }
}

export const devtools = new OptimisticDevTools()

// Auto-enable in development
if (process.env.NODE_ENV === 'development') {
  devtools.enable()
}
