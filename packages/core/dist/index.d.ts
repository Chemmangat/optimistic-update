interface Options<T> {
    idKey: keyof T;
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
type Status$3 = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticList<T>(initialItems: T[], options: Options<T>): {
    items: T[];
    addItem: (item: T, mutationFn: () => Promise<void>) => Promise<void>;
    removeItem: (id: string, mutationFn: () => Promise<void>) => Promise<void>;
    updateItem: (id: string, updates: Partial<T>, mutationFn: () => Promise<void>) => Promise<void>;
    status: Status$3;
    error: Error | null;
};

interface OptimisticValueOptions {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
type Status$2 = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticValue<T>(initialValue: T, options?: OptimisticValueOptions): {
    value: T;
    update: (newValue: T | ((prev: T) => T), mutationFn: () => Promise<void>) => Promise<void>;
    status: Status$2;
    error: Error | null;
};

interface OptimisticMapOptions {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
type Status$1 = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticMap<K, V>(initialMap?: Map<K, V>, options?: OptimisticMapOptions): {
    map: Map<K, V>;
    set: (key: K, value: V, mutationFn: () => Promise<void>) => Promise<void>;
    remove: (key: K, mutationFn: () => Promise<void>) => Promise<void>;
    clear: (mutationFn: () => Promise<void>) => Promise<void>;
    status: Status$1;
    error: Error | null;
};

interface OptimisticSetOptions {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
}
type Status = 'idle' | 'pending' | 'error' | 'success';
declare function useOptimisticSet<T>(initialSet?: Set<T>, options?: OptimisticSetOptions): {
    set: Set<T>;
    add: (value: T, mutationFn: () => Promise<void>) => Promise<void>;
    remove: (value: T, mutationFn: () => Promise<void>) => Promise<void>;
    clear: (mutationFn: () => Promise<void>) => Promise<void>;
    status: Status;
    error: Error | null;
};

export { type OptimisticMapOptions, type OptimisticSetOptions, type OptimisticValueOptions, type Options, useOptimisticList, useOptimisticMap, useOptimisticSet, useOptimisticValue };
