# @chemmangat/optimistic-update

Instant UI updates with automatic rollback. One hook, zero config.

```bash
npm install @chemmangat/optimistic-update
```

## The Simplest Example

```tsx
import { useOptimistic } from '@chemmangat/optimistic-update'

function Counter() {
  const [count, setCount] = useOptimistic(0)

  return (
    <button onClick={() => 
      setCount(count + 1, () => fetch('/api/increment', { method: 'POST' }))
    }>
      {count}
    </button>
  )
}
```

That's it. The UI updates instantly. If the fetch fails, it rolls back automatically.

## How It Works

```tsx
const [value, setValue] = useOptimistic(initialValue)

// Set normally (like useState)
setValue(newValue)

// Or with automatic rollback
setValue(newValue, async () => {
  await fetch('/api/endpoint', { method: 'POST' })
})
```

## Real Examples

### Like Button

```tsx
const [likes, setLikes] = useOptimistic(0)
const [liked, setLiked] = useOptimistic(false)

<button onClick={() => {
  setLikes(liked ? likes - 1 : likes + 1, () => fetch('/api/like', { method: 'POST' }))
  setLiked(!liked)
}}>
  {liked ? '❤️' : '🤍'} {likes}
</button>
```

### Delete Todo

```tsx
const [todos, setTodos] = useOptimistic([])

const deleteTodo = (id) => {
  setTodos(
    todos.filter(t => t.id !== id),
    () => fetch(`/api/todos/${id}`, { method: 'DELETE' })
  )
}
```

### Add Todo

```tsx
const [todos, setTodos] = useOptimistic([])

const addTodo = (text) => {
  const newTodo = { id: Date.now(), text, done: false }
  setTodos(
    [...todos, newTodo],
    () => fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify(newTodo)
    })
  )
}
```

### Toggle Checkbox

```tsx
const [todo, setTodo] = useOptimistic({ id: 1, text: 'Buy milk', done: false })

<input
  type="checkbox"
  checked={todo.done}
  onChange={() => 
    setTodo(
      { ...todo, done: !todo.done },
      () => fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ done: !todo.done })
      })
    )
  }
/>
```

## Error Handling

```tsx
const [count, setCount] = useOptimistic(0, {
  onError: (error) => {
    console.error('Failed:', error)
    toast.error('Update failed')
  },
  onSuccess: () => {
    toast.success('Saved!')
  }
})
```

## Advanced Features

Need more? We have hooks for specific use cases:

```tsx
// List operations (add, remove, update by id)
import { useOptimisticList } from '@chemmangat/optimistic-update'

// Batch multiple operations
import { useOptimisticBatch } from '@chemmangat/optimistic-update'

// Retry with exponential backoff
import { useOptimisticQueue } from '@chemmangat/optimistic-update'

// Undo/redo
import { useOptimisticUndo } from '@chemmangat/optimistic-update'
```

## Why This Package?

**Problem:** Users wait for every action
```tsx
const handleClick = async () => {
  setLoading(true)
  await fetch('/api/endpoint')
  await refetch()
  setLoading(false)
}
```

**Solution:** Instant feedback
```tsx
const [data, setData] = useOptimistic(initialData)

const handleClick = () => {
  setData(newData, () => fetch('/api/endpoint'))
}
```

## Features

- Works like `useState` - familiar API
- Automatic rollback on error
- TypeScript support
- 20KB bundle size
- Zero dependencies (just React)
- No providers or setup needed

## Comparison

| | This Package | React Query | SWR |
|---|---|---|---|
| Setup | None | Provider needed | Provider needed |
| API | `useState`-like | Custom hooks | Custom hooks |
| Bundle | 20KB | 40KB | 12KB |
| Use case | Optimistic updates | Data fetching | Data fetching |

## FAQ

**Q: Can I use this with React Query?**  
A: Yes! Use React Query for fetching, this for optimistic updates.

**Q: Does it work with Next.js?**  
A: Yes, works with any React framework.

**Q: What if I need more control?**  
A: Check out `useOptimisticList`, `useOptimisticBatch`, etc. for advanced use cases.

## License

MIT
