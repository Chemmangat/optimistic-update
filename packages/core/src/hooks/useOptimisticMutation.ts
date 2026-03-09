import { useState, useCallback } from 'react'

export interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
  onMutate?: (variables: TVariables) => void | Promise<void>
}

/**
 * TanStack Query-style mutation with optimistic updates
 * 
 * @example
 * const deleteTodo = useOptimisticMutation(
 *   async (id: string) => {
 *     await fetch(`/api/todos/${id}`, { method: 'DELETE' })
 *   },
 *   {
 *     onMutate: (id) => {
 *       setTodos(todos => todos.filter(t => t.id !== id))
 *     },
 *     onError: () => {
 *       // Refetch or rollback
 *     }
 *   }
 * )
 * 
 * deleteTodo.mutate('123')
 */
export function useOptimisticMutation<TData = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
) {
  const { onSuccess, onError, onMutate } = options
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<TData | null>(null)

  const mutate = useCallback(
    async (variables: TVariables) => {
      setIsPending(true)
      setError(null)

      try {
        await onMutate?.(variables)
        const result = await mutationFn(variables)
        setData(result)
        onSuccess?.(result)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Mutation failed')
        setError(error)
        onError?.(error)
      } finally {
        setIsPending(false)
      }
    },
    [mutationFn, onMutate, onSuccess, onError]
  )

  const reset = useCallback(() => {
    setError(null)
    setData(null)
    setIsPending(false)
  }, [])

  return {
    mutate,
    isPending,
    error,
    data,
    reset,
  }
}
