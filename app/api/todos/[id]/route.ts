import { NextRequest, NextResponse } from 'next/server'

interface Todo {
  id: string
  text: string
  completed: boolean
}

let todos: Todo[] = [
  { id: '1', text: 'Learn React', completed: true },
  { id: '2', text: 'Build optimistic UI', completed: false },
  { id: '3', text: 'Deploy to production', completed: false },
]

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const { simulateFailure } = await request.json()

  await new Promise(resolve => setTimeout(resolve, 800))

  if (simulateFailure) {
    return NextResponse.json(
      { error: 'Simulated failure' },
      { status: 500 }
    )
  }

  todos = todos.filter(todo => todo.id !== id)
  return NextResponse.json({ success: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  const body = await request.json()
  const { updates, simulateFailure } = body

  await new Promise(resolve => setTimeout(resolve, 800))

  if (simulateFailure) {
    return NextResponse.json(
      { error: 'Simulated failure' },
      { status: 500 }
    )
  }

  const todoIndex = todos.findIndex(todo => todo.id === id)
  if (todoIndex === -1) {
    return NextResponse.json(
      { error: 'Todo not found' },
      { status: 404 }
    )
  }

  todos[todoIndex] = { ...todos[todoIndex], ...updates }
  return NextResponse.json(todos[todoIndex])
}
