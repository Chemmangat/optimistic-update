# @chemmangat/optimistic-update

Extraordinary React hooks for optimistic UI updates with automatic rollback on failure.

## Installation

```bash
npm install @chemmangat/optimistic-update
```

## Hooks

### `useOptimisticList<T>`
Manage lists with optimistic add/remove/update operations.

```tsx
const { items, addItem, removeItem, updateItem } = useOptimisticList(todos, {
  idKey: 'id',
  onError: (err) => toast.error(err.message),
})
```

### `useOptimisticValue<T>`
Manage a single value with optimistic updates.

```tsx
const { value, update } = useOptimisticValue(count, {
  onError: (err) => console.error(err),
})

await update(value + 1, async () => {
  await fetch('/api/increment', { method: 'POST' })
})
```

### `useOptimisticMap<K, V>`
Manage Map data structures with optimistic operations.

```tsx
const { map, set, remove, clear } = useOptimisticMap(userMap, {
  onSuccess: () => console.log('Updated!'),
})
```

### `useOptimisticSet<T>`
Manage Set data structures with optimistic operations.

```tsx
const { set, add, remove, clear } = useOptimisticSet(tags, {
  onError: (err) => toast.error(err.message),
})
```

## Features

- ⚡ Instant UI updates
- 🔄 Automatic rollback on failure
- 🔒 Full TypeScript support
- 🎯 Zero dependencies
- 🧹 Automatic cleanup
- 🎭 Multiple simultaneous mutations

See full documentation at [optimistic-state.dev](https://optimistic-state.dev)
