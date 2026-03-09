// src/hooks/useOptimistic.ts
import { useState, useCallback, useRef } from "react";
function useOptimistic(initialValue, options) {
  const [value, setValue] = useState(initialValue);
  const snapshot = useRef(initialValue);
  const isPending = useRef(false);
  const setOptimistic = useCallback(
    (newValue, mutationFn) => {
      if (!mutationFn) {
        const computed2 = typeof newValue === "function" ? newValue(value) : newValue;
        setValue(computed2);
        return;
      }
      if (isPending.current) return;
      isPending.current = true;
      snapshot.current = value;
      const computed = typeof newValue === "function" ? newValue(value) : newValue;
      setValue(computed);
      mutationFn().then(() => {
        snapshot.current = computed;
        options?.onSuccess?.();
      }).catch((err) => {
        setValue(snapshot.current);
        const error = err instanceof Error ? err : new Error("Update failed");
        options?.onError?.(error);
      }).finally(() => {
        isPending.current = false;
      });
    },
    [value, options]
  );
  return [value, setOptimistic];
}

// src/hooks/useOptimisticState.ts
import { useState as useState2, useCallback as useCallback2, useRef as useRef2 } from "react";
function useOptimisticState(initialValue) {
  const [value, setValue] = useState2(initialValue);
  const snapshot = useRef2(initialValue);
  const isPending = useRef2(false);
  const setOptimisticValue = useCallback2(
    (newValue, mutationFn) => {
      if (!mutationFn) {
        setValue(newValue);
        return;
      }
      return (async () => {
        if (isPending.current) return;
        isPending.current = true;
        snapshot.current = value;
        const computed = typeof newValue === "function" ? newValue(value) : newValue;
        setValue(computed);
        try {
          await mutationFn();
          snapshot.current = computed;
        } catch (error) {
          setValue(snapshot.current);
          throw error;
        } finally {
          isPending.current = false;
        }
      })();
    },
    [value]
  );
  return [value, setOptimisticValue];
}

// src/hooks/useOptimisticAction.ts
import { useState as useState3, useCallback as useCallback3 } from "react";
function useOptimisticAction(action, options) {
  const [isPending, setIsPending] = useState3(false);
  const [error, setError] = useState3(null);
  const execute = useCallback3(
    async (...args) => {
      setIsPending(true);
      setError(null);
      try {
        await action(...args);
        options?.onSuccess?.();
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error("Action failed");
        setError(error2);
        options?.onError?.(error2);
        throw error2;
      } finally {
        setIsPending(false);
      }
    },
    [action, options]
  );
  return Object.assign(execute, {
    isPending,
    error,
    reset: () => {
      setError(null);
      setIsPending(false);
    }
  });
}

// src/hooks/useOptimisticMutation.ts
import { useState as useState4, useCallback as useCallback4 } from "react";
function useOptimisticMutation(mutationFn, options = {}) {
  const { onSuccess, onError, onMutate } = options;
  const [isPending, setIsPending] = useState4(false);
  const [error, setError] = useState4(null);
  const [data, setData] = useState4(null);
  const mutate = useCallback4(
    async (variables) => {
      setIsPending(true);
      setError(null);
      try {
        await onMutate?.(variables);
        const result = await mutationFn(variables);
        setData(result);
        onSuccess?.(result);
      } catch (err) {
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        setError(error2);
        onError?.(error2);
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn, onMutate, onSuccess, onError]
  );
  const reset = useCallback4(() => {
    setError(null);
    setData(null);
    setIsPending(false);
  }, []);
  return {
    mutate,
    isPending,
    error,
    data,
    reset
  };
}

// src/hooks/useOptimisticList.ts
import { useState as useState5, useCallback as useCallback5, useRef as useRef4, useEffect } from "react";
function useOptimisticList(initialItems, options) {
  const { idKey, onError, onSuccess } = options;
  const [items, setItems] = useState5(initialItems);
  const [status, setStatus] = useState5("idle");
  const [error, setError] = useState5(null);
  const pendingMutations = useRef4(/* @__PURE__ */ new Map());
  const mutationCounter = useRef4(0);
  const baselineState = useRef4(initialItems);
  useEffect(() => {
    setItems(initialItems);
    baselineState.current = initialItems;
  }, [initialItems]);
  useEffect(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = useCallback5(
    async (optimisticUpdate, mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      const abortController = new AbortController();
      const previousState = items;
      setItems((current) => {
        const newState = optimisticUpdate(current);
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState,
          abort: abortController
        });
        return newState;
      });
      setStatus("pending");
      setError(null);
      try {
        if (abortController.signal.aborted) {
          return;
        }
        await mutationFn();
        if (abortController.signal.aborted) {
          return;
        }
        pendingMutations.current.delete(mutationId);
        if (pendingMutations.current.size === 0) {
          baselineState.current = items;
          setStatus("success");
          onSuccess?.();
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        pendingMutations.current.delete(mutationId);
        if (pendingMutations.current.size === 0) {
          setItems(baselineState.current);
          setStatus("error");
          setError(error2);
          onError?.(error2);
        } else {
          setItems(baselineState.current);
          let currentState = baselineState.current;
          const remainingMutations = Array.from(pendingMutations.current.values());
          remainingMutations.forEach((mutation) => {
            const mutationIndex = Array.from(pendingMutations.current.keys()).indexOf(mutation.id);
            if (mutationIndex !== -1) {
              const prevState = mutation.previousState;
              const diff = getDiff(prevState, currentState);
              currentState = applyDiff(currentState, diff);
            }
          });
          setItems(currentState);
        }
        onError?.(error2);
      }
    },
    [items, onError, onSuccess]
  );
  const getDiff = (before, after) => {
    return { before, after };
  };
  const applyDiff = (base, diff) => {
    return diff.after;
  };
  const addItem = useCallback5(
    async (item, mutationFn) => {
      await executeMutation(
        (current) => [...current, item],
        mutationFn
      );
    },
    [executeMutation]
  );
  const removeItem = useCallback5(
    async (id, mutationFn) => {
      const itemExists = items.some((item) => String(item[idKey]) === id);
      if (!itemExists) {
        console.warn(`Item with id "${id}" not found`);
        return;
      }
      await executeMutation(
        (current) => current.filter((item) => String(item[idKey]) !== id),
        mutationFn
      );
    },
    [executeMutation, idKey, items]
  );
  const updateItem = useCallback5(
    async (id, updates, mutationFn) => {
      const itemExists = items.some((item) => String(item[idKey]) === id);
      if (!itemExists) {
        console.warn(`Item with id "${id}" not found`);
        return;
      }
      await executeMutation(
        (current) => current.map(
          (item) => String(item[idKey]) === id ? { ...item, ...updates } : item
        ),
        mutationFn
      );
    },
    [executeMutation, idKey, items]
  );
  return {
    items,
    addItem,
    removeItem,
    updateItem,
    status,
    error
  };
}

// src/hooks/useOptimisticBatch.ts
import { useState as useState6, useCallback as useCallback6, useRef as useRef5 } from "react";
function useOptimisticBatch(initialItems, options) {
  const listHook = useOptimisticList(initialItems, options);
  const [isBatching, setIsBatching] = useState6(false);
  const batchQueue = useRef5([]);
  const startBatch = useCallback6(() => {
    setIsBatching(true);
    batchQueue.current = [];
  }, []);
  const commitBatch = useCallback6(async () => {
    setIsBatching(false);
    const operations = [...batchQueue.current];
    batchQueue.current = [];
    await Promise.all(operations.map((op) => op()));
  }, []);
  const cancelBatch = useCallback6(() => {
    setIsBatching(false);
    batchQueue.current = [];
  }, []);
  const addItem = useCallback6(
    async (item, mutationFn) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.addItem(item, mutationFn));
      } else {
        await listHook.addItem(item, mutationFn);
      }
    },
    [isBatching, listHook]
  );
  const removeItem = useCallback6(
    async (id, mutationFn) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.removeItem(id, mutationFn));
      } else {
        await listHook.removeItem(id, mutationFn);
      }
    },
    [isBatching, listHook]
  );
  const updateItem = useCallback6(
    async (id, updates, mutationFn) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.updateItem(id, updates, mutationFn));
      } else {
        await listHook.updateItem(id, updates, mutationFn);
      }
    },
    [isBatching, listHook]
  );
  return {
    ...listHook,
    addItem,
    removeItem,
    updateItem,
    startBatch,
    commitBatch,
    cancelBatch,
    isBatching,
    batchSize: batchQueue.current.length
  };
}

// src/hooks/useOptimisticQueue.ts
import { useState as useState7, useCallback as useCallback7, useRef as useRef6, useEffect as useEffect2 } from "react";
function useOptimisticQueue(options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1e3,
    onError,
    onSuccess,
    onRetry
  } = options;
  const [status, setStatus] = useState7("idle");
  const [queueSize, setQueueSize] = useState7(0);
  const queue = useRef6([]);
  const processing = useRef6(false);
  const mutationCounter = useRef6(0);
  const processQueue = useCallback7(async () => {
    if (processing.current || queue.current.length === 0) return;
    processing.current = true;
    setStatus("pending");
    while (queue.current.length > 0) {
      const mutation = queue.current[0];
      try {
        await mutation.fn();
        queue.current.shift();
        setQueueSize(queue.current.length);
        if (queue.current.length === 0) {
          setStatus("success");
          onSuccess?.();
        }
      } catch (error) {
        mutation.retries++;
        if (mutation.retries >= mutation.maxRetries) {
          queue.current.shift();
          setQueueSize(queue.current.length);
          setStatus("error");
          onError?.(
            error instanceof Error ? error : new Error("Mutation failed"),
            mutation.retries
          );
        } else {
          onRetry?.(mutation.retries);
          await new Promise(
            (resolve) => setTimeout(resolve, retryDelay * Math.pow(2, mutation.retries - 1))
          );
        }
      }
    }
    processing.current = false;
    if (queue.current.length === 0) {
      setStatus("idle");
    }
  }, [maxRetries, retryDelay, onError, onSuccess, onRetry]);
  const enqueue = useCallback7(
    async (mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      queue.current.push({
        id: mutationId,
        fn: mutationFn,
        retries: 0,
        maxRetries
      });
      setQueueSize(queue.current.length);
      await processQueue();
    },
    [maxRetries, processQueue]
  );
  const clear = useCallback7(() => {
    queue.current = [];
    setQueueSize(0);
    setStatus("idle");
  }, []);
  useEffect2(() => {
    return () => {
      queue.current = [];
    };
  }, []);
  return {
    enqueue,
    clear,
    status,
    queueSize
  };
}

// src/hooks/useOptimisticUndo.ts
import { useState as useState8, useCallback as useCallback8, useRef as useRef7 } from "react";
function useOptimisticUndo(initialState, options = {}) {
  const { maxHistory = 50, onUndo, onRedo } = options;
  const [state, setState] = useState8(initialState);
  const history = useRef7([initialState]);
  const currentIndex = useRef7(0);
  const set = useCallback8((newState) => {
    setState((current) => {
      const updated = typeof newState === "function" ? newState(current) : newState;
      history.current = history.current.slice(0, currentIndex.current + 1);
      history.current.push(updated);
      if (history.current.length > maxHistory) {
        history.current.shift();
      } else {
        currentIndex.current++;
      }
      return updated;
    });
  }, [maxHistory]);
  const undo = useCallback8(() => {
    if (currentIndex.current > 0) {
      currentIndex.current--;
      const previousState = history.current[currentIndex.current];
      setState(previousState);
      onUndo?.(previousState);
    }
  }, [onUndo]);
  const redo = useCallback8(() => {
    if (currentIndex.current < history.current.length - 1) {
      currentIndex.current++;
      const nextState = history.current[currentIndex.current];
      setState(nextState);
      onRedo?.(nextState);
    }
  }, [onRedo]);
  const reset = useCallback8(() => {
    setState(initialState);
    history.current = [initialState];
    currentIndex.current = 0;
  }, [initialState]);
  const canUndo = currentIndex.current > 0;
  const canRedo = currentIndex.current < history.current.length - 1;
  return {
    state,
    set,
    undo,
    redo,
    reset,
    canUndo,
    canRedo,
    historySize: history.current.length
  };
}

// src/helpers/optimisticFetch.ts
async function optimisticFetch(url, options = {}) {
  const { optimistic, ...fetchOptions } = options;
  try {
    optimistic?.update?.();
    const response = await fetch(url, fetchOptions);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response;
  } catch (error) {
    optimistic?.rollback?.();
    throw error;
  }
}

// src/helpers/withOptimistic.ts
function withOptimistic(fn, options = {}) {
  return async (...args) => {
    const { onBefore, onSuccess, onError } = options;
    try {
      onBefore?.(...args);
      const result = await fn(...args);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Operation failed");
      onError?.(error);
      throw error;
    }
  };
}

// src/devtools.ts
var OptimisticDevTools = class {
  constructor() {
    this.events = [];
    this.enabled = false;
  }
  enable() {
    this.enabled = true;
    if (typeof globalThis !== "undefined" && typeof globalThis.window !== "undefined") {
      globalThis.window.__OPTIMISTIC_DEVTOOLS__ = this;
    }
  }
  disable() {
    this.enabled = false;
  }
  log(type, data) {
    if (!this.enabled) return;
    const event = {
      type,
      timestamp: Date.now(),
      data
    };
    this.events.push(event);
    if (this.events.length > 100) {
      this.events.shift();
    }
    if (process.env.NODE_ENV === "development") {
      const emoji = {
        update: "\u26A1",
        rollback: "\u21A9\uFE0F",
        success: "\u2705",
        error: "\u274C"
      }[type];
      console.log(`${emoji} Optimistic ${type}:`, data);
    }
  }
  getEvents() {
    return this.events;
  }
  clear() {
    this.events = [];
  }
  getStats() {
    const total = this.events.length;
    const updates = this.events.filter((e) => e.type === "update").length;
    const rollbacks = this.events.filter((e) => e.type === "rollback").length;
    const successes = this.events.filter((e) => e.type === "success").length;
    const errors = this.events.filter((e) => e.type === "error").length;
    return {
      total,
      updates,
      rollbacks,
      successes,
      errors,
      successRate: total > 0 ? successes / total * 100 : 0
    };
  }
};
var devtools = new OptimisticDevTools();
if (process.env.NODE_ENV === "development") {
  devtools.enable();
}
export {
  devtools,
  optimisticFetch,
  useOptimistic,
  useOptimisticAction,
  useOptimisticBatch,
  useOptimisticList,
  useOptimisticMutation,
  useOptimisticQueue,
  useOptimisticState,
  useOptimisticUndo,
  withOptimistic
};
