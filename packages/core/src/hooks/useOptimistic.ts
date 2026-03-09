import { useState, useCallback, useRef } from 'react'

export interface UseOptimisticOptions<T> {
  onError?: (error: Error) => void
  onSuccess?: () => void
}

/**
 * The simplest possible optimistic update hook
 * Works like useState but with automatic rollback
 * 
 * @example
 * const [count, setCount] = useOptimistic(0)
 * 
 * // Just set normally
 * setCount(5)
 * 
 * // Or with a mutation that auto-rolls back on error
 * setCount(count + 1, async () => {
 *   await fetch('/api/increment', { method: 'POST' })
 * })
 */
export function useOptimistic<T>(
  initialValue: T,
  options?: UseOptimisticOptions<T>
): [T, (newValue: T | ((prev: T) => T), mutationFn?: () => Promise<any>) => void | Promise<void>] {
  const [value, setValue] = useState<T>(initialValue)
  const snapshot = useRef<T>(initialValue)
  const isPending = useRef(false)

  const setOptimistic = useCallback(
    (newValue: T | ((prev: T) => T), mutationFn?: () => Promise<any>) => {
      // No mutation? Just set the value
      if (!mutationFn) {
        const computed = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(value)
          : newValue
        setValue(computed)
        return
      }

      // Optimistic update with rollback
      if (isPending.current) return

      isPending.current = true
      snapshot.current = value

      const computed = typeof newValue === 'function' 
        ? (newValue as (prev: T) => T)(value)
        : newValue

      setValue(computed)

      // Run mutation in background
      mutationFn()
        .then(() => {
          snapshot.current = computed
          options?.onSuccess?.()
        })
        .catch((err) => {
          setValue(snapshot.current)
          const error = err instanceof Error ? err : new Error('Update failed')
          options?.onError?.(error)
        })
        .finally(() => {
          isPending.current = false
        })
    },
    [value, options]
  )

  return [value, setOptimistic as any]
}
