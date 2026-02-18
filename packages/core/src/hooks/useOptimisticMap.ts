import { useState, useCallback, useRef, useEffect } from 'react'

export interface OptimisticMapOptions {
  onError?: (error: Error) => void
  onSuccess?: () => void
}

type Status = 'idle' | 'pending' | 'error' | 'success'

interface PendingMutation<K, V> {
  id: string
  previousState: Map<K, V>
  abort: AbortController
}

export function useOptimisticMap<K, V>(
  initialMap: Map<K, V> = new Map(),
  options: OptimisticMapOptions = {}
) {
  const { onError, onSuccess } = options
  const [map, setMap] = useState<Map<K, V>>(new Map(initialMap))
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<Error | null>(null)
  
  const pendingMutations = useRef<Map<string, PendingMutation<K, V>>>(new Map())
  const mutationCounter = useRef(0)

  useEffect(() => {
    setMap(new Map(initialMap))
  }, [initialMap])

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
      optimisticUpdate: (current: Map<K, V>) => Map<K, V>,
      mutationFn: () => Promise<void>
    ) => {
      const mutationId = `mutation-${mutationCounter.current++}`
      const abortController = new AbortController()
      
      setMap(current => {
        const newState = optimisticUpdate(new Map(current))
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
          setMap(mutation.previousState)
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

  const set = useCallback(
    async (key: K, value: V, mutationFn: () => Promise<void>) => {
      await executeMutation(
        (current) => {
          const newMap = new Map(current)
          newMap.set(key, value)
          return newMap
        },
        mutationFn
      )
    },
    [executeMutation]
  )

  const remove = useCallback(
    async (key: K, mutationFn: () => Promise<void>) => {
      if (!map.has(key)) {
        console.warn(`Key not found in map`)
        return
      }

      await executeMutation(
        (current) => {
          const newMap = new Map(current)
          newMap.delete(key)
          return newMap
        },
        mutationFn
      )
    },
    [executeMutation, map]
  )

  const clear = useCallback(
    async (mutationFn: () => Promise<void>) => {
      await executeMutation(
        () => new Map(),
        mutationFn
      )
    },
    [executeMutation]
  )

  return {
    map,
    set,
    remove,
    clear,
    status,
    error,
  }
}
