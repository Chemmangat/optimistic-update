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

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 300))
  return NextResponse.json(todos)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { todo, simulateFailure } = body

  await new Promise(resolve => setTimeout(resolve, 800))

  if (simulateFailure) {
    return NextResponse.json(
      { error: 'Simulated failure' },
      { status: 500 }
    )
  }

  todos.push(todo)
  return NextResponse.json(todo, { status: 201 })
}
