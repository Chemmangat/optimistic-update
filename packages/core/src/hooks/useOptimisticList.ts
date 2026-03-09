import { useState, useCallback, useRef, useEffect } from 'react'

export interface Options<T> {
  idKey: keyof T
  onError?: (error: Error) => void
  onSuccess?: () => void
}

type Status = 'idle' | 'pending' | 'error' | 'success'

interface PendingMutation {
  id: string
  previousState: unknown[]
  abort: AbortController
}

export function useOptimisticList<T>(
  initialItems: T[],
  options: Options<T>
) {
  const { idKey, onError, onSuccess } = options
  const [items, setItems] = useState<T[]>(initialItems)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<Error | null>(null)
  
  const pendingMutations = useRef<Map<string, PendingMutation>>(new Map())
  const mutationCounter = useRef(0)
  const baselineState = useRef<T[]>(initialItems)

  useEffect(() => {
    setItems(initialItems)
    baselineState.current = initialItems
  }, [initialItems])

  useEffect(() => {
    return () => {
      pendingMutations.current.forEach(mutation => {
        mutation.abort.abort()
      })
      pendingMutations.current.clear()
    }
  }, [])

  const executeMutation = useCallback(
    async (
      optimisticUpdate: (current: T[]) => T[],
      mutationFn: () => Promise<void>
    ) => {
      const mutationId = `mutation-${mutationCounter.current++}`
      const abortController = new AbortController()
      
      const previousState = items
      
      setItems(current => {
        const newState = optimisticUpdate(current)
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState: previousState,
          abort: abortController,
        })
        return newState
      })

      setStatus('pending')
      setError(null)

      try {
        if (abortController.signal.aborted) {
          return
        }

        await mutationFn()

        if (abortController.signal.aborted) {
          return
        }

        pendingMutations.current.delete(mutationId)
        
        if (pendingMutations.current.size === 0) {
          baselineState.current = items
          setStatus('success')
          onSuccess?.()
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return
        }

        const error = err instanceof Error ? err : new Error('Mutation failed')
        
        pendingMutations.current.delete(mutationId)
        
        if (pendingMutations.current.size === 0) {
          setItems(baselineState.current)
          setStatus('error')
          setError(error)
          onError?.(error)
        } else {
          setItems(baselineState.current)
          let currentState = baselineState.current
          const remainingMutations = Array.from(pendingMutations.current.values())
          
          remainingMutations.forEach(mutation => {
            const mutationIndex = Array.from(pendingMutations.current.keys()).indexOf(mutation.id)
            if (mutationIndex !== -1) {
              const prevState = mutation.previousState as T[]
              const diff = getDiff(prevState, currentState)
              currentState = applyDiff(currentState, diff)
            }
          })
          
          setItems(currentState)
        }
        
        onError?.(error)
      }
    },
    [items, onError, onSuccess]
  )
  
  const getDiff = (before: T[], after: T[]): any => {
    return { before, after }
  }
  
  const applyDiff = (base: T[], diff: any): T[] => {
    return diff.after
  }

  const addItem = useCallback(
    async (item: T, mutationFn: () => Promise<void>) => {
      await executeMutation(
        (current) => [...current, item],
        mutationFn
      )
    },
    [executeMutation]
  )

  const removeItem = useCallback(
    async (id: string, mutationFn: () => Promise<void>) => {
      const itemExists = items.some(item => String(item[idKey]) === id)
      
      if (!itemExists) {
        console.warn(`Item with id "${id}" not found`)
        return
      }

      await executeMutation(
        (current) => current.filter(item => String(item[idKey]) !== id),
        mutationFn
      )
    },
    [executeMutation, idKey, items]
  )

  const updateItem = useCallback(
    async (
      id: string,
      updates: Partial<T>,
      mutationFn: () => Promise<void>
    ) => {
      const itemExists = items.some(item => String(item[idKey]) === id)
      
      if (!itemExists) {
        console.warn(`Item with id "${id}" not found`)
        return
      }

      await executeMutation(
        (current) =>
          current.map(item =>
            String(item[idKey]) === id ? { ...item, ...updates } : item
          ),
        mutationFn
      )
    },
    [executeMutation, idKey, items]
  )

  return {
    items,
    addItem,
    removeItem,
    updateItem,
    status,
    error,
  }
}
