'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useOptimisticList } from '@chemmangat/optimistic-update'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function DemoPage() {
  const [initialTodos, setInitialTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [simulateFailure, setSimulateFailure] = useState(false)
  const [newTodoText, setNewTodoText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)

  const { items: todos, addItem, removeItem, updateItem, status, error } = useOptimisticList<Todo>(
    initialTodos,
    {
      idKey: 'id',
      onError: (error) => {
        setToast({ message: error.message, type: 'error' })
        setTimeout(() => setToast(null), 3000)
      },
      onSuccess: () => {
        setToast({ message: 'Success!', type: 'success' })
        setTimeout(() => setToast(null), 2000)
      },
    }
  )

  useEffect(() => {
    fetch('/api/todos')
      .then(res => res.json())
      .then(data => {
        setInitialTodos(data)
        setIsLoading(false)
      })
      .catch(err => {
        console.error('Failed to load todos:', err)
        setIsLoading(false)
      })
  }, [])

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodoText.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: newTodoText.trim(),
      completed: false,
    }

    setNewTodoText('')

    await addItem(newTodo, async () => {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: newTodo, simulateFailure }),
      })

      if (!response.ok) {
        throw new Error('Failed to add todo')
      }
    })
  }

  const handleRemoveTodo = async (id: string) => {
    await removeItem(id, async () => {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ simulateFailure }),
      })

      if (!response.ok) {
        throw new Error('Failed to remove todo')
      }
    })
  }

  const handleToggleTodo = async (todo: Todo) => {
    await updateItem(
      todo.id,
      { completed: !todo.completed },
      async () => {
        const response = await fetch(`/api/todos/${todo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: { completed: !todo.completed },
            simulateFailure,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update todo')
        }
      }
    )
  }

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return

    await updateItem(
      id,
      { text: editText.trim() },
      async () => {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: { text: editText.trim() },
            simulateFailure,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update todo')
        }
      }
    )

    setEditingId(null)
    setEditText('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditText('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <nav className="max-w-2xl mx-auto mb-8 flex justify-between items-center">
        <Link href="/optimistic-update/about" className="text-blue-400 hover:text-blue-300 transition-colors">
          ← About
        </Link>
        <a 
          href="https://chemmangathari.in" 
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 text-sm shadow-lg"
        >
          Visit Site
        </a>
      </nav>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            @chemmangat/optimistic-update
          </h1>
          <p className="text-gray-400">
            Optimistic UI updates with automatic rollback
          </p>
        </div>

        {simulateFailure && (
          <div className="mb-6 bg-red-900/30 border border-red-500/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-300 text-sm font-medium">
                Failure mode active — all mutations will fail and rollback
              </p>
            </div>
          </div>
        )}

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Settings</h2>
            <div className="flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-300">
                  Simulate Failure
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-lg shadow-2xl p-6">
          <form onSubmit={handleAddTodo} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="Add a new todo..."
                className="flex-1 px-4 py-2 bg-gray-900 border border-gray-600 text-gray-100 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={status === 'pending'}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Add
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {todos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No todos yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:bg-gray-900/70 hover:border-gray-600 transition-all duration-200"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="w-5 h-5 text-blue-500 bg-gray-800 border-gray-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                  
                  {editingId === todo.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveEdit(todo.id)}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={`flex-1 ${
                          todo.completed
                            ? 'line-through text-gray-500'
                            : 'text-gray-200'
                        } transition-all duration-200`}
                      >
                        {todo.text}
                      </span>
                      <button
                        onClick={() => handleStartEdit(todo)}
                        className="px-3 py-1 text-sm text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleRemoveTodo(todo.id)}
                        className="px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {status === 'pending' && (
            <div className="mt-4 text-center text-sm text-gray-400">
              Processing...
            </div>
          )}
        </div>

        {toast && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 backdrop-blur-lg ${
              toast.type === 'error'
                ? 'bg-red-600/90 text-white border border-red-500'
                : 'bg-green-600/90 text-white border border-green-500'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </div>
  )
}
