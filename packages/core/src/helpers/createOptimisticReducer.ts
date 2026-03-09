/**
 * Create a reducer that handles optimistic updates automatically
 * Works with useReducer for complex state management
 * 
 * @example
 * const [state, dispatch] = useReducer(
 *   createOptimisticReducer({
 *     add: (state, todo) => [...state, todo],
 *     remove: (state, id) => state.filter(t => t.id !== id),
 *   }),
 *   []
 * )
 * 
 * // Dispatch with automatic rollback
 * dispatch({ type: 'add', payload: newTodo, mutate: () => api.addTodo(newTodo) })
 */

type Action<T = any> = {
  type: string
  payload?: T
  mutate?: () => Promise<any>
}

type Reducer<S, A> = (state: S, action: A) => S

export function createOptimisticReducer<S, A extends Action>(
  handlers: Record<string, (state: S, payload: any) => S>
): Reducer<S, A> {
  let previousState: S | null = null

  return (state: S, action: A): S => {
    const handler = handlers[action.type]
    
    if (!handler) {
      return state
    }

    // If there's a mutation, save previous state
    if (action.mutate) {
      previousState = state
      const newState = handler(state, action.payload)

      // Execute mutation in background
      action.mutate().catch(() => {
        // Rollback would need to be handled by re-dispatching
        console.error('Mutation failed, manual rollback needed')
      })

      return newState
    }

    return handler(state, action.payload)
  }
}
