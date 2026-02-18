# @chemmangat/optimistic-update

Extraordinary React hooks for optimistic UI updates with automatic rollback on failure. Make your React apps feel instant with zero effort.

## Problem It Solves

Optimistic updates make your app feel instant, but handling rollbacks manually is error-prone and tedious. This library manages all the complexity for you — apply changes immediately, rollback automatically on failure, and handle multiple simultaneous mutations correctly.

## Installation

```bash
npm install @chemmangat/optimistic-update
```

## Hooks

### `useOptimisticList<T>` - Manage Lists

```tsx
import { useOptimisticList } from '@chemmangat/optimistic-update'

const { items, addItem, removeItem, updateItem } = useOptimisticList(todos, {
  idKey: 'id',
  onError: (err) => toast.error(err.message),
})

await addItem(newTodo, async () => {
  await fetch('/api/todos', { method: 'POST', body: JSON.stringify(newTodo) })
})
```

### `useOptimisticValue<T>` - Manage Single Values

```tsx
import { useOptimisticValue } from '@chemmangat/optimistic-update'

const { value, update } = useOptimisticValue(count, {
  onSuccess: () => console.log('Updated!'),
})

await update(value + 1, async () => {
  await fetch('/api/increment', { method: 'POST' })
})
```

### `useOptimisticMap<K, V>` - Manage Maps

```tsx
import { useOptimisticMap } from '@chemmangat/optimistic-update'

const { map, set, remove, clear } = useOptimisticMap(userMap, {
  onError: (err) => console.error(err),
})

await set('user-1', userData, async () => {
  await fetch('/api/users/user-1', { method: 'PUT', body: JSON.stringify(userData) })
})
```

### `useOptimisticSet<T>` - Manage Sets

```tsx
import { useOptimisticSet } from '@chemmangat/optimistic-update'

const { set, add, remove, clear } = useOptimisticSet(tags, {
  onSuccess: () => console.log('Tag updated!'),
})

await add('react', async () => {
  await fetch('/api/tags', { method: 'POST', body: JSON.stringify({ tag: 'react' }) })
})
```

## Features

- ⚡ **Lightning Fast** - Updates happen instantly in the UI
- 🔄 **Auto Rollback** - Automatic rollback on failure
- 🔒 **Type Safe** - Full TypeScript support with generics
- 🎯 **Zero Dependencies** - Only requires React
- 🧹 **Auto Cleanup** - Handles component unmount gracefully
- 🎭 **Concurrent Safe** - Multiple simultaneous mutations work correctly

## Common Options

All hooks accept similar options:

```typescript
{
  onError?: (error: Error) => void     // Called when rollback happens
  onSuccess?: () => void               // Called when mutation succeeds
}
```

## How Rollback Works

1. You call `addItem`, `removeItem`, or `updateItem`
2. The UI updates immediately (optimistic)
3. The `mutationFn` runs in the background
4. If it succeeds → optimistic state becomes real
5. If it fails → automatically rolls back to the exact previous state (including order)

Multiple simultaneous mutations are handled independently — each can succeed or fail without affecting the others.

## Package Structure

This is a monorepo containing:

- `packages/core` - The npm package with all hooks
- `app/` - Next.js demo application

## TypeScript Support

All hooks are fully typed with generics:

```typescript
interface User {
  userId: string
  name: string
  email: string
}

const { items, updateItem } = useOptimisticList<User>(users, {
  idKey: 'userId',
})

// TypeScript infers Partial<User> for updates
updateItem('123', { name: 'New Name' }, mutationFn)
```

## Live Demo

Try it live: [Vercel Demo](https://use-optimistic-list.vercel.app/demo)

Toggle "Simulate Failure" to see automatic rollback in action.

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the demo.

## Publishing

```bash
npm run build:core
cd packages/core
npm publish
```

## License

MIT
