import { useState, useCallback, useRef, useEffect } from 'react'

export interface OptimisticSetOptions {
  onError?: (error: Error) => void
  onSuccess?: () => void
}

type Status = 'idle' | 'pending' | 'error' | 'success'

interface PendingMutation<T> {
  id: string
  previousState: Set<T>
  abort: AbortController
}

export function useOptimisticSet<T>(
  initialSet: Set<T> = new Set(),
  options: OptimisticSetOptions = {}
) {
  const { onError, onSuccess } = options
  const [set, setSet] = useState<Set<T>>(new Set(initialSet))
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<Error | null>(null)
  
  const pendingMutations = useRef<Map<string, PendingMutation<T>>>(new Map())
  const mutationCounter = useRef(0)

  useEffect(() => {
    setSet(new Set(initialSet))
  }, [initialSet])

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
      optimisticUpdate: (current: Set<T>) => Set<T>,
      mutationFn: () => Promise<void>
    ) => {
      const mutationId = `mutation-${mutationCounter.current++}`
      const abortController = new AbortController()
      
      setSet(current => {
        const newState = optimisticUpdate(new Set(current))
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState: current,
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
          setStatus('success')
          onSuccess?.()
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return
        }

        const error = err instanceof Error ? err : new Error('Mutation failed')
        
        const mutation = pendingMutations.current.get(mutationId)
        if (mutation) {
          setSet(mutation.previousState)
          pendingMutations.current.delete(mutationId)
        }

        if (pendingMutations.current.size === 0) {
          setStatus('error')
          setError(error)
          onError?.(error)
        }
      }
    },
    [onError, onSuccess]
  )

  const add = useCallback(
    async (value: T, mutationFn: () => Promise<void>) => {
      await executeMutation(
        (current) => {
          const newSet = new Set(current)
          newSet.add(value)
          return newSet
        },
        mutationFn
      )
    },
    [executeMutation]
  )

  const remove = useCallback(
    async (value: T, mutationFn: () => Promise<void>) => {
      if (!set.has(value)) {
        console.warn(`Value not found in set`)
        return
      }

      await executeMutation(
        (current) => {
          const newSet = new Set(current)
          newSet.delete(value)
          return newSet
        },
        mutationFn
      )
    },
    [executeMutation, set]
  )

  const clear = useCallback(
    async (mutationFn: () => Promise<void>) => {
      await executeMutation(
        () => new Set(),
        mutationFn
      )
    },
    [executeMutation]
  )

  return {
    set,
    add,
    remove,
    clear,
    status,
    error,
  }
}
