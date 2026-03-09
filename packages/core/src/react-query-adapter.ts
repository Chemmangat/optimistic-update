/**
 * Adapter for React Query / TanStack Query users
 * Makes migration super easy
 */

export function createOptimisticMutation<TData, TVariables>(config: {
  mutationFn: (variables: TVariables) => Promise<TData>
  onMutate?: (variables: TVariables) => Promise<any> | any
  onSuccess?: (data: TData, variables: TVariables) => void
  onError?: (error: Error, variables: TVariables, context: any) => void
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void
}) {
  return {
    mutationFn: config.mutationFn,
    onMutate: config.onMutate,
    onSuccess: config.onSuccess,
    onError: config.onError,
    onSettled: config.onSettled,
  }
}

/**
 * @example
 * // React Query style
 * const mutation = useMutation({
 *   mutationFn: deleteTodo,
 *   onMutate: async (id) => {
 *     await queryClient.cancelQueries(['todos'])
 *     const previous = queryClient.getQueryData(['todos'])
 *     queryClient.setQueryData(['todos'], old => old.filter(t => t.id !== id))
 *     return { previous }
 *   },
 *   onError: (err, id, context) => {
 *     queryClient.setQueryData(['todos'], context.previous)
 *   }
 * })
 * 
 * // Our style (simpler)
 * const deleteTodo = useOptimisticMutation(
 *   (id) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
 *   {
 *     onMutate: (id) => setTodos(todos => todos.filter(t => t.id !== id)),
 *     onError: () => refetchTodos()
 *   }
 * )
 */
