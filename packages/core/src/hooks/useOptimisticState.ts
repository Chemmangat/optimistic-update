import { useState, useCallback, useRef } from 'react'

/**
 * Drop-in replacement for useState with automatic rollback
 * 
 * @example
 * // Instead of useState
 * const [count, setCount] = useOptimisticState(0)
 * 
 * // Set with automatic rollback on error
 * setCount(count + 1, async () => {
 *   await fetch('/api/increment', { method: 'POST' })
 * })
 * 
 * // Or just set normally
 * setCount(5)
 */
export function useOptimisticState<T>(
  initialValue: T
): [
  T,
  {
    (newValue: T | ((prev: T) => T)): void
    (newValue: T | ((prev: T) => T), mutationFn: () => Promise<any>): Promise<void>
  }
] {
  const [value, setValue] = useState<T>(initialValue)
  const snapshot = useRef<T>(initialValue)
  const isPending = useRef(false)

  const setOptimisticValue = useCallback(
    (newValue: T | ((prev: T) => T), mutationFn?: () => Promise<any>) => {
      // If no mutation function, just set the value
      if (!mutationFn) {
        setValue(newValue)
        return
      }

      // Optimistic update with rollback
      return (async () => {
        if (isPending.current) return

        isPending.current = true
        snapshot.current = value

        const computed = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(value)
          : newValue

        setValue(computed)

        try {
          await mutationFn()
          snapshot.current = computed
        } catch (error) {
          setValue(snapshot.current)
          throw error
        } finally {
          isPending.current = false
        }
      })()
    },
    [value]
  )

  return [value, setOptimisticValue as any]
}
