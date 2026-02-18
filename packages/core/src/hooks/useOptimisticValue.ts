import { useState, useCallback, useRef, useEffect } from 'react'

export interface OptimisticValueOptions {
  onError?: (error: Error) => void
  onSuccess?: () => void
}

type Status = 'idle' | 'pending' | 'error' | 'success'

interface PendingMutation<T> {
  id: string
  previousValue: T
  abort: AbortController
}

export function useOptimisticValue<T>(
  initialValue: T,
  options: OptimisticValueOptions = {}
) {
  const { onError, onSuccess } = options
  const [value, setValue] = useState<T>(initialValue)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<Error | null>(null)
  
  const pendingMutations = useRef<Map<string, PendingMutation<T>>>(new Map())
  const mutationCounter = useRef(0)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    return () => {
      pendingMutations.current.forEach(mutation => {
        mutation.abort.abort()
      })
      pendingMutations.current.clear()
    }
  }, [])

  const update = useCallback(
    async (newValue: T | ((prev: T) => T), mutationFn: () => Promise<void>) => {
      const mutationId = `mutation-${mutationCounter.current++}`
      const abortController = new AbortController()
      
      setValue(current => {
        const updated = typeof newValue === 'function' 
          ? (newValue as (prev: T) => T)(current)
          : newValue
        
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousValue: current,
          abort: abortController,
        })
        return updated
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
          setValue(mutation.previousValue)
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

  return {
    value,
    update,
    status,
    error,
  }
}
