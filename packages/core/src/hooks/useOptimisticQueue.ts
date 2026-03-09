import { useState, useCallback, useRef, useEffect } from 'react'

export interface QueueOptions {
  maxRetries?: number
  retryDelay?: number
  onError?: (error: Error, retryCount: number) => void
  onSuccess?: () => void
  onRetry?: (retryCount: number) => void
}

type Status = 'idle' | 'pending' | 'error' | 'success'

interface QueuedMutation {
  id: string
  fn: () => Promise<void>
  retries: number
  maxRetries: number
}

export function useOptimisticQueue(options: QueueOptions = {}) {
  const { 
    maxRetries = 3, 
    retryDelay = 1000,
    onError, 
    onSuccess,
    onRetry 
  } = options
  
  const [status, setStatus] = useState<Status>('idle')
  const [queueSize, setQueueSize] = useState(0)
  const queue = useRef<QueuedMutation[]>([])
  const processing = useRef(false)
  const mutationCounter = useRef(0)

  const processQueue = useCallback(async () => {
    if (processing.current || queue.current.length === 0) return
    
    processing.current = true
    setStatus('pending')

    while (queue.current.length > 0) {
      const mutation = queue.current[0]
      
      try {
        await mutation.fn()
        queue.current.shift()
        setQueueSize(queue.current.length)
        
        if (queue.current.length === 0) {
          setStatus('success')
          onSuccess?.()
        }
      } catch (error) {
        mutation.retries++
        
        if (mutation.retries >= mutation.maxRetries) {
          queue.current.shift()
          setQueueSize(queue.current.length)
          setStatus('error')
          onError?.(
            error instanceof Error ? error : new Error('Mutation failed'),
            mutation.retries
          )
        } else {
          onRetry?.(mutation.retries)
          await new Promise(resolve => 
            setTimeout(resolve, retryDelay * Math.pow(2, mutation.retries - 1))
          )
        }
      }
    }

    processing.current = false
    if (queue.current.length === 0) {
      setStatus('idle')
    }
  }, [maxRetries, retryDelay, onError, onSuccess, onRetry])

  const enqueue = useCallback(
    async (mutationFn: () => Promise<void>) => {
      const mutationId = `mutation-${mutationCounter.current++}`
      
      queue.current.push({
        id: mutationId,
        fn: mutationFn,
        retries: 0,
        maxRetries,
      })
      
      setQueueSize(queue.current.length)
      await processQueue()
    },
    [maxRetries, processQueue]
  )

  const clear = useCallback(() => {
    queue.current = []
    setQueueSize(0)
    setStatus('idle')
  }, [])

  useEffect(() => {
    return () => {
      queue.current = []
    }
  }, [])

  return {
    enqueue,
    clear,
    status,
    queueSize,
  }
}
