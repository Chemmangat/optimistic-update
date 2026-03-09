interface UseOptimisticOptions<T> {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
/**
 * The simplest possible optimistic update hook
 * Works like useState but with automatic rollback
 *
 * @example
 * const [count, setCount] = useOptimistic(0)
 *
 * // Just set normally
 * setCount(5)
 *
 * // Or with a mutation that auto-rolls back on error
 * setCount(count + 1, async () => {
 *   await fetch('/api/increment', { method: 'POST' })
 * })
 */
declare function useOptimistic<T>(initialValue: T, options?: UseOptimisticOptions<T>): [T, (newValue: T | ((prev: T) => T), mutationFn?: () => Promise<any>) => void | Promise<void>];

/**
 * Drop-in replacement for useState with automatic rollback
 *
 * @example
 * // Instead of useState
 * const [count, setCount] = useOptimisticState(0)
 *
 * // Set with automatic rollback on error
 * setCount(count + 1, async () => {
 *   await fetch('/api/increment', { method: 'POST' })
 * })
 *
 * // Or just set normally
 * setCount(5)
 */
declare function useOptimisticState<T>(initialValue: T): [
    T,
    {
        (newValue: T | ((prev: T) => T)): void;
        (newValue: T | ((prev: T) => T), mutationFn: () => Promise<any>): Promise<void>;
    }
];

/**
 * The simplest possible API - just wrap your async function
 *
 * @example
 * const deleteTodo = useOptimisticAction(
 *   async (id: string) => {
 *     // This runs immediately
 *     setTodos(todos => todos.filter(t => t.id !== id))
 *
 *     // This runs in background
 *     await fetch(`/api/todos/${id}`, { method: 'DELETE' })
 *   }
 * )
 *
 * // Just call it
 * await deleteTodo('123')
 */
declare function useOptimisticAction<TArgs extends any[]>(action: (...args: TArgs) => Promise<void>, options?: {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}): ((...args: TArgs) => Promise<void>) & {
    isPending: boolean;
    error: Error | null;
    reset: () => void;
};

interface MutationOptions<TData, TVariables> {
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
    onMutate?: (variables: TVariables) => void | Promise<void>;
}
/**
 * TanStack Query-style mutation with optimistic updates
 *
 * @example
 * const deleteTodo = useOptimisticMutation(
 *   async (id: string) => {
 *     await fetch(`/api/todos/${id}`, { method: 'DELETE' })
 *   },
 *   {
 *     onMutate: (id) => {
 *       setTodos(todos => todos.filter(t => t.id !== id))
 *     },
 *     onError: () => {
 *       // Refetch or rollback
 *     }
 *   }
 * )
 *
 * deleteTodo.mutate('123')
 */
declare function useOptimisticMutation<TData = unknown, TVariables = void>(mutationFn: (variables: TVariables) => Promise<TData>, options?: MutationOptions<TData, TVariables>): {
    mutate: (variables: TVariables) => Promise<void>;
    isPending: boolean;
    error: Error | null;
    data: TData | null;
    reset: () => void;
};

interface Options<T> {
    idKey: keyof T;
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
type Status$1 = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticList<T>(initialItems: T[], options: Options<T>): {
    items: T[];
    addItem: (item: T, mutationFn: () => Promise<void>) => Promise<void>;
    removeItem: (id: string, mutationFn: () => Promise<void>) => Promise<void>;
    updateItem: (id: string, updates: Partial<T>, mutationFn: () => Promise<void>) => Promise<void>;
    status: Status$1;
    error: Error | null;
};

declare function useOptimisticBatch<T>(initialItems: T[], options: Options<T>): {
    addItem: (item: T, mutationFn: () => Promise<void>) => Promise<void>;
    removeItem: (id: string, mutationFn: () => Promise<void>) => Promise<void>;
    updateItem: (id: string, updates: Partial<T>, mutationFn: () => Promise<void>) => Promise<void>;
    startBatch: () => void;
    commitBatch: () => Promise<void>;
    cancelBatch: () => void;
    isBatching: boolean;
    batchSize: number;
    items: T[];
    status: "error" | "idle" | "pending" | "success";
    error: Error | null;
};

interface QueueOptions {
    maxRetries?: number;
    retryDelay?: number;
    onError?: (error: Error, retryCount: number) => void;
    onSuccess?: () => void;
    onRetry?: (retryCount: number) => void;
}
type Status = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticQueue(options?: QueueOptions): {
    enqueue: (mutationFn: () => Promise<void>) => Promise<void>;
    clear: () => void;
    status: Status;
    queueSize: number;
};

interface UndoOptions<T> {
    maxHistory?: number;
    onUndo?: (state: T) => void;
    onRedo?: (state: T) => void;
}
declare function useOptimisticUndo<T>(initialState: T, options?: UndoOptions<T>): {
    state: T;
    set: (newState: T | ((prev: T) => T)) => void;
    undo: () => void;
    redo: () => void;
    reset: () => void;
    canUndo: boolean;
    canRedo: boolean;
    historySize: number;
};

/**
 * Drop-in replacement for fetch with automatic optimistic updates
 *
 * @example
 * // Before
 * await fetch('/api/todos/123', { method: 'DELETE' })
 *
 * // After - with automatic UI update
 * await optimisticFetch('/api/todos/123', {
 *   method: 'DELETE',
 *   optimistic: {
 *     update: () => setTodos(todos => todos.filter(t => t.id !== '123')),
 *     rollback: () => refetchTodos()
 *   }
 * })
 */
interface OptimisticFetchOptions extends RequestInit {
    optimistic?: {
        update?: () => void;
        rollback?: () => void;
    };
}
declare function optimisticFetch(url: string, options?: OptimisticFetchOptions): Promise<Response>;

/**
 * HOC that wraps any async function with optimistic update logic
 *
 * @example
 * const optimisticDelete = withOptimistic(
 *   (id: string) => fetch(`/api/todos/${id}`, { method: 'DELETE' }),
 *   {
 *     onBefore: (id) => setTodos(todos => todos.filter(t => t.id !== id)),
 *     onError: () => refetchTodos()
 *   }
 * )
 *
 * await optimisticDelete('123')
 */
interface WithOptimisticOptions<TArgs extends any[], TReturn> {
    onBefore?: (...args: TArgs) => void;
    onSuccess?: (result: TReturn) => void;
    onError?: (error: Error) => void;
}
declare function withOptimistic<TArgs extends any[], TReturn>(fn: (...args: TArgs) => Promise<TReturn>, options?: WithOptimisticOptions<TArgs, TReturn>): (...args: TArgs) => Promise<TReturn>;

/**
 * Development tools for debugging optimistic updates
 */
interface OptimisticEvent {
    type: 'update' | 'rollback' | 'success' | 'error';
    timestamp: number;
    data: any;
}
declare class OptimisticDevTools {
    private events;
    private enabled;
    enable(): void;
    disable(): void;
    log(type: OptimisticEvent['type'], data: any): void;
    getEvents(): OptimisticEvent[];
    clear(): void;
    getStats(): {
        total: number;
        updates: number;
        rollbacks: number;
        successes: number;
        errors: number;
        successRate: number;
    };
}
declare const devtools: OptimisticDevTools;

export { type MutationOptions, type OptimisticFetchOptions, type Options, type QueueOptions, type UndoOptions, type UseOptimisticOptions, devtools, optimisticFetch, useOptimistic, useOptimisticAction, useOptimisticBatch, useOptimisticList, useOptimisticMutation, useOptimisticQueue, useOptimisticState, useOptimisticUndo, withOptimistic };
