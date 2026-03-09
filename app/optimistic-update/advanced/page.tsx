'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  useOptimisticBatch, 
  useOptimisticQueue,
  useOptimisticUndo 
} from '@chemmangat/optimistic-update'

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function AdvancedDemo() {
  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Learn batch operations', completed: false },
    { id: '2', title: 'Try retry logic', completed: false },
    { id: '3', title: 'Test undo/redo', completed: false },
  ])

  // Batch Demo
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const { 
    items, 
    removeItem, 
    startBatch, 
    commitBatch, 
    isBatching, 
    batchSize 
  } = useOptimisticBatch(tasks, {
    idKey: 'id',
    onSuccess: () => console.log('Batch completed!'),
  })

  // Queue Demo
  const { enqueue, status: queueStatus, queueSize } = useOptimisticQueue({
    maxRetries: 3,
    retryDelay: 1000,
    onRetry: (count) => console.log(`Retry ${count}`),
  })

  // Undo Demo
  const { 
    state: noteText, 
    set: setNoteText, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    historySize 
  } = useOptimisticUndo('Type something...', {
    maxHistory: 20,
  })

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const bulkDelete = async () => {
    startBatch()
    selectedIds.forEach(id => {
      removeItem(id, async () => {
        await new Promise(resolve => setTimeout(resolve, 100))
      })
    })
    await commitBatch()
    setSelectedIds(new Set())
  }

  const simulateQueuedOperation = async () => {
    await enqueue(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Operation completed')
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <nav className="mb-8">
          <Link href="/optimistic-update/demo" className="text-blue-400 hover:text-blue-300">
            ← Back to Basic Demo
          </Link>
        </nav>

        <h1 className="text-3xl font-bold text-white mb-2">Advanced Features</h1>
        <p className="text-gray-400 mb-8">Batch operations, retry logic, and undo/redo</p>

        {/* Batch Operations */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Batch Operations
            {isBatching && <span className="ml-2 text-sm text-yellow-400">({batchSize} queued)</span>}
          </h2>
          <p className="text-gray-400 text-sm mb-4">Select multiple items and delete them in one transaction</p>
          
          <div className="space-y-2 mb-4">
            {items.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded">
                <input
                  type="checkbox"
                  checked={selectedIds.has(task.id)}
                  onChange={() => toggleSelection(task.id)}
                  className="w-5 h-5"
                />
                <span className="text-gray-200">{task.title}</span>
              </div>
            ))}
          </div>

          <button
            onClick={bulkDelete}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Selected ({selectedIds.size})
          </button>
        </div>

        {/* Queue with Retry */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Queue with Retry
            {queueSize > 0 && <span className="ml-2 text-sm text-blue-400">({queueSize} in queue)</span>}
          </h2>
          <p className="text-gray-400 text-sm mb-4">Operations are queued and retried automatically on failure</p>
          
          <div className="flex gap-3 items-center">
            <button
              onClick={simulateQueuedOperation}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add to Queue
            </button>
            <span className="text-gray-400">Status: {queueStatus}</span>
          </div>
        </div>

        {/* Undo/Redo */}
        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">
            Undo/Redo
            <span className="ml-2 text-sm text-gray-400">({historySize} states)</span>
          </h2>
          <p className="text-gray-400 text-sm mb-4">History management with undo/redo support</p>
          
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full h-32 px-4 py-2 bg-gray-900 border border-gray-600 text-gray-100 rounded mb-3"
            placeholder="Type something..."
          />
          
          <div className="flex gap-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              ⟲ Undo
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              ⟳ Redo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
