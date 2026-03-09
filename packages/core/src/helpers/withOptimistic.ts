/**
 * HOC that wraps any async function with optimistic update logic
 * 
 * @example
 * const optimisticDelete = withOptimistic(
 *   (id: string) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
 *   {
 *     onBefore: (id) => setTodos(todos => todos.filter(t => t.id !== id)),
 *     onError: () => refetchTodos()
 *   }
 * )
 * 
 * await optimisticDelete('123')
 */

export interface WithOptimisticOptions<TArgs extends any[], TReturn> {
  onBefore?: (...args: TArgs) => void
  onSuccess?: (result: TReturn) => void
  onError?: (error: Error) => void
}

export function withOptimistic<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  options: WithOptimisticOptions<TArgs, TReturn> = {}
) {
  return async (...args: TArgs): Promise<TReturn> => {
    const { onBefore, onSuccess, onError } = options

    try {
      onBefore?.(...args)
      const result = await fn(...args)
      onSuccess?.(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Operation failed')
      onError?.(error)
      throw error
    }
  }
}
