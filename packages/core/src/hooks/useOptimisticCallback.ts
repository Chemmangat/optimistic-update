import { useCallback, useRef } from 'react'

/**
 * Like useCallback but with automatic state snapshot and rollback
 * 
 * @example
 * const [todos, setTodos] = useState([])
 * 
 * const deleteTodo = useOptimisticCallback(
 *   async (id: string) => {
 *     await fetch(`/api/todos/${id}`, { method: 'DELETE' })
 *   },
 *   [todos],
 *   {
 *     onBefore: (id) => setTodos(todos => todos.filter(t => t.id !== id)),
 *     onError: (snapshot) => setTodos(snapshot[0]) // Auto rollback
 *   }
 * )
 */
export function useOptimisticCallback<TArgs extends any[], TReturn>(
  callback: (...args: TArgs) => Promise<TReturn>,
  deps: any[],
  options?: {
    onBefore?: (...args: TArgs) => void
    onSuccess?: (result: TReturn) => void
    onError?: (snapshot: any[]) => void
  }
) {
  const snapshot = useRef<any[]>([])

  return useCallback(
    async (...args: TArgs): Promise<TReturn> => {
      // Save snapshot of dependencies
      snapshot.current = [...deps]

      try {
        options?.onBefore?.(...args)
        const result = await callback(...args)
        options?.onSuccess?.(result)
        return result
      } catch (error) {
        options?.onError?.(snapshot.current)
        throw error
      }
    },
    [...deps, callback, options]
  )
}
