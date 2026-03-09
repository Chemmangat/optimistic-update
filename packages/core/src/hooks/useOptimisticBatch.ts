import { useState, useCallback, useRef } from 'react'
import { useOptimisticList, Options } from './useOptimisticList'

export function useOptimisticBatch<T>(
  initialItems: T[],
  options: Options<T>
) {
  const listHook = useOptimisticList(initialItems, options)
  const [isBatching, setIsBatching] = useState(false)
  const batchQueue = useRef<(() => Promise<void>)[]>([])

  const startBatch = useCallback(() => {
    setIsBatching(true)
    batchQueue.current = []
  }, [])

  const commitBatch = useCallback(async () => {
    setIsBatching(false)
    const operations = [...batchQueue.current]
    batchQueue.current = []
    
    await Promise.all(operations.map(op => op()))
  }, [])

  const cancelBatch = useCallback(() => {
    setIsBatching(false)
    batchQueue.current = []
  }, [])

  const addItem = useCallback(
    async (item: T, mutationFn: () => Promise<void>) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.addItem(item, mutationFn))
      } else {
        await listHook.addItem(item, mutationFn)
      }
    },
    [isBatching, listHook]
  )

  const removeItem = useCallback(
    async (id: string, mutationFn: () => Promise<void>) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.removeItem(id, mutationFn))
      } else {
        await listHook.removeItem(id, mutationFn)
      }
    },
    [isBatching, listHook]
  )

  const updateItem = useCallback(
    async (id: string, updates: Partial<T>, mutationFn: () => Promise<void>) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.updateItem(id, updates, mutationFn))
      } else {
        await listHook.updateItem(id, updates, mutationFn)
      }
    },
    [isBatching, listHook]
  )

  return {
    ...listHook,
    addItem,
    removeItem,
    updateItem,
    startBatch,
    commitBatch,
    cancelBatch,
    isBatching,
    batchSize: batchQueue.current.length,
  }
}
