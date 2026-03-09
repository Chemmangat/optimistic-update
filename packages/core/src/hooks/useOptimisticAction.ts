import { useState, useCallback, useRef } from 'react'

/**
 * The simplest possible API - just wrap your async function
 * 
 * @example
 * const deleteTodo = useOptimisticAction(
 *   async (id: string) => {
 *     // This runs immediately
 *     setTodos(todos => todos.filter(t => t.id !== id))
 *     
 *     // This runs in background
 *     await fetch(`/api/todos/${id}`, { method: 'DELETE' })
 *   }
 * )
 * 
 * // Just call it
 * await deleteTodo('123')
 */
export function useOptimisticAction<TArgs extends any[]>(
  action: (...args: TArgs) => Promise<void>,
  options?: {
    onError?: (error: Error) => void
    onSuccess?: () => void
  }
) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (...args: TArgs) => {
      setIsPending(true)
      setError(null)

      try {
        await action(...args)
        options?.onSuccess?.()
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Action failed')
        setError(error)
        options?.onError?.(error)
        throw error
      } finally {
        setIsPending(false)
      }
    },
    [action, options]
  )

  return Object.assign(execute, {
    isPending,
    error,
    reset: () => {
      setError(null)
      setIsPending(false)
    }
  })
}
