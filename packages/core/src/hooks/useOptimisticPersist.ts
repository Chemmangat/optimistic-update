import { useState, useEffect, useCallback } from 'react'

export interface PersistOptions<T> {
  key: string
  storage?: Storage
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
}

export function useOptimisticPersist<T>(
  initialValue: T,
  options: PersistOptions<T>
) {
  const {
    key,
    storage = typeof window !== 'undefined' ? window.localStorage : undefined,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options

  const [value, setValue] = useState<T>(() => {
    if (!storage) return initialValue

    try {
      const item = storage.getItem(key)
      return item ? deserialize(item) : initialValue
    } catch (error) {
      console.error('Failed to load from storage:', error)
      return initialValue
    }
  })

  useEffect(() => {
    if (!storage) return

    try {
      storage.setItem(key, serialize(value))
    } catch (error) {
      console.error('Failed to save to storage:', error)
    }
  }, [key, value, storage, serialize])

  const clear = useCallback(() => {
    if (!storage) return
    
    try {
      storage.removeItem(key)
      setValue(initialValue)
    } catch (error) {
      console.error('Failed to clear storage:', error)
    }
  }, [key, initialValue, storage])

  return {
    value,
    setValue,
    clear,
  }
}
