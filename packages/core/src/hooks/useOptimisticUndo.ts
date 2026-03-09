import { useState, useCallback, useRef } from 'react'

export interface UndoOptions<T> {
  maxHistory?: number
  onUndo?: (state: T) => void
  onRedo?: (state: T) => void
}

export function useOptimisticUndo<T>(
  initialState: T,
  options: UndoOptions<T> = {}
) {
  const { maxHistory = 50, onUndo, onRedo } = options
  
  const [state, setState] = useState<T>(initialState)
  const history = useRef<T[]>([initialState])
  const currentIndex = useRef(0)

  const set = useCallback((newState: T | ((prev: T) => T)) => {
    setState(current => {
      const updated = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(current)
        : newState
      
      history.current = history.current.slice(0, currentIndex.current + 1)
      history.current.push(updated)
      
      if (history.current.length > maxHistory) {
        history.current.shift()
      } else {
        currentIndex.current++
      }
      
      return updated
    })
  }, [maxHistory])

  const undo = useCallback(() => {
    if (currentIndex.current > 0) {
      currentIndex.current--
      const previousState = history.current[currentIndex.current]
      setState(previousState)
      onUndo?.(previousState)
    }
  }, [onUndo])

  const redo = useCallback(() => {
    if (currentIndex.current < history.current.length - 1) {
      currentIndex.current++
      const nextState = history.current[currentIndex.current]
      setState(nextState)
      onRedo?.(nextState)
    }
  }, [onRedo])

  const reset = useCallback(() => {
    setState(initialState)
    history.current = [initialState]
    currentIndex.current = 0
  }, [initialState])

  const canUndo = currentIndex.current > 0
  const canRedo = currentIndex.current < history.current.length - 1

  return {
    state,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historySize: history.current.length,
  }
}
