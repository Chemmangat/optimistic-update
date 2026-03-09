export interface MiddlewareContext<T = any> {
  operation: 'add' | 'remove' | 'update' | 'set' | 'clear'
  payload: T
  timestamp: number
  metadata?: Record<string, any>
}

export type Middleware<T = any> = (
  context: MiddlewareContext<T>,
  next: () => Promise<void>
) => Promise<void>

export interface MiddlewareOptions {
  onError?: (error: Error) => void
}

export function createMiddleware<T = any>(
  middlewares: Middleware<T>[]
): (context: MiddlewareContext<T>, finalFn: () => Promise<void>) => Promise<void> {
  return async (context: MiddlewareContext<T>, finalFn: () => Promise<void>) => {
    let index = 0

    const next = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++]
        await middleware(context, next)
      } else {
        await finalFn()
      }
    }

    await next()
  }
}

export const loggingMiddleware: Middleware = async (context, next) => {
  console.log(`[Optimistic] ${context.operation}`, context.payload)
  const start = Date.now()
  await next()
  console.log(`[Optimistic] ${context.operation} completed in ${Date.now() - start}ms`)
}

export const analyticsMiddleware: Middleware = async (context, next) => {
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).window !== 'undefined') {
    const win = (globalThis as any).window
    if (win.gtag) {
      win.gtag('event', 'optimistic_update', {
        operation: context.operation,
        timestamp: context.timestamp,
      })
    }
  }
  await next()
}

export const validationMiddleware = <T>(
  validator: (payload: T) => boolean | Promise<boolean>
): Middleware<T> => {
  return async (context, next) => {
    const isValid = await validator(context.payload)
    if (!isValid) {
      throw new Error('Validation failed')
    }
    await next()
  }
}
