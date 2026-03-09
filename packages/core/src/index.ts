// 🎯 Start here - this is all you need
export { useOptimistic } from './hooks/useOptimistic'

// 🔧 Alternative APIs (if you prefer different styles)
export { useOptimisticState } from './hooks/useOptimisticState'
export { useOptimisticAction } from './hooks/useOptimisticAction'
export { useOptimisticMutation } from './hooks/useOptimisticMutation'

// 🚀 Advanced features (when you need them)
export { useOptimisticList } from './hooks/useOptimisticList'
export { useOptimisticBatch } from './hooks/useOptimisticBatch'
export { useOptimisticQueue } from './hooks/useOptimisticQueue'
export { useOptimisticUndo } from './hooks/useOptimisticUndo'

// 🛠️ Utilities
export { optimisticFetch } from './helpers/optimisticFetch'
export { withOptimistic } from './helpers/withOptimistic'
export { devtools } from './devtools'

// Types
export type { UseOptimisticOptions } from './hooks/useOptimistic'
export type { MutationOptions } from './hooks/useOptimisticMutation'
export type { OptimisticFetchOptions } from './helpers/optimisticFetch'
export type { Options } from './hooks/useOptimisticList'
export type { QueueOptions } from './hooks/useOptimisticQueue'
export type { UndoOptions } from './hooks/useOptimisticUndo'
