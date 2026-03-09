/**
 * Drop-in replacement for fetch with automatic optimistic updates
 * 
 * @example
 * // Before
 * await fetch('/api/todos/123', { method: 'DELETE' })
 * 
 * // After - with automatic UI update
 * await optimisticFetch('/api/todos/123', { 
 *   method: 'DELETE',
 *   optimistic: {
 *     update: () => setTodos(todos => todos.filter(t => t.id !== '123')),
 *     rollback: () => refetchTodos()
 *   }
 * })
 */

export interface OptimisticFetchOptions extends RequestInit {
  optimistic?: {
    update?: () => void
    rollback?: () => void
  }
}

export async function optimisticFetch(
  url: string,
  options: OptimisticFetchOptions = {}
): Promise<Response> {
  const { optimistic, ...fetchOptions } = options

  try {
    optimistic?.update?.()
    const response = await fetch(url, fetchOptions)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    return response
  } catch (error) {
    optimistic?.rollback?.()
    throw error
  }
}
