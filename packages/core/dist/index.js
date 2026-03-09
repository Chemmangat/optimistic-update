"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  devtools: () => devtools,
  optimisticFetch: () => optimisticFetch,
  useOptimistic: () => useOptimistic,
  useOptimisticAction: () => useOptimisticAction,
  useOptimisticBatch: () => useOptimisticBatch,
  useOptimisticList: () => useOptimisticList,
  useOptimisticMutation: () => useOptimisticMutation,
  useOptimisticQueue: () => useOptimisticQueue,
  useOptimisticState: () => useOptimisticState,
  useOptimisticUndo: () => useOptimisticUndo,
  withOptimistic: () => withOptimistic
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useOptimistic.ts
var import_react = require("react");
function useOptimistic(initialValue, options) {
  const [value, setValue] = (0, import_react.useState)(initialValue);
  const snapshot = (0, import_react.useRef)(initialValue);
  const isPending = (0, import_react.useRef)(false);
  const setOptimistic = (0, import_react.useCallback)(
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
var import_react2 = require("react");
function useOptimisticState(initialValue) {
  const [value, setValue] = (0, import_react2.useState)(initialValue);
  const snapshot = (0, import_react2.useRef)(initialValue);
  const isPending = (0, import_react2.useRef)(false);
  const setOptimisticValue = (0, import_react2.useCallback)(
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
var import_react3 = require("react");
function useOptimisticAction(action, options) {
  const [isPending, setIsPending] = (0, import_react3.useState)(false);
  const [error, setError] = (0, import_react3.useState)(null);
  const execute = (0, import_react3.useCallback)(
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
var import_react4 = require("react");
function useOptimisticMutation(mutationFn, options = {}) {
  const { onSuccess, onError, onMutate } = options;
  const [isPending, setIsPending] = (0, import_react4.useState)(false);
  const [error, setError] = (0, import_react4.useState)(null);
  const [data, setData] = (0, import_react4.useState)(null);
  const mutate = (0, import_react4.useCallback)(
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
  const reset = (0, import_react4.useCallback)(() => {
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
var import_react5 = require("react");
function useOptimisticList(initialItems, options) {
  const { idKey, onError, onSuccess } = options;
  const [items, setItems] = (0, import_react5.useState)(initialItems);
  const [status, setStatus] = (0, import_react5.useState)("idle");
  const [error, setError] = (0, import_react5.useState)(null);
  const pendingMutations = (0, import_react5.useRef)(/* @__PURE__ */ new Map());
  const mutationCounter = (0, import_react5.useRef)(0);
  const baselineState = (0, import_react5.useRef)(initialItems);
  (0, import_react5.useEffect)(() => {
    setItems(initialItems);
    baselineState.current = initialItems;
  }, [initialItems]);
  (0, import_react5.useEffect)(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = (0, import_react5.useCallback)(
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
  const addItem = (0, import_react5.useCallback)(
    async (item, mutationFn) => {
      await executeMutation(
        (current) => [...current, item],
        mutationFn
      );
    },
    [executeMutation]
  );
  const removeItem = (0, import_react5.useCallback)(
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
  const updateItem = (0, import_react5.useCallback)(
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
var import_react6 = require("react");
function useOptimisticBatch(initialItems, options) {
  const listHook = useOptimisticList(initialItems, options);
  const [isBatching, setIsBatching] = (0, import_react6.useState)(false);
  const batchQueue = (0, import_react6.useRef)([]);
  const startBatch = (0, import_react6.useCallback)(() => {
    setIsBatching(true);
    batchQueue.current = [];
  }, []);
  const commitBatch = (0, import_react6.useCallback)(async () => {
    setIsBatching(false);
    const operations = [...batchQueue.current];
    batchQueue.current = [];
    await Promise.all(operations.map((op) => op()));
  }, []);
  const cancelBatch = (0, import_react6.useCallback)(() => {
    setIsBatching(false);
    batchQueue.current = [];
  }, []);
  const addItem = (0, import_react6.useCallback)(
    async (item, mutationFn) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.addItem(item, mutationFn));
      } else {
        await listHook.addItem(item, mutationFn);
      }
    },
    [isBatching, listHook]
  );
  const removeItem = (0, import_react6.useCallback)(
    async (id, mutationFn) => {
      if (isBatching) {
        batchQueue.current.push(() => listHook.removeItem(id, mutationFn));
      } else {
        await listHook.removeItem(id, mutationFn);
      }
    },
    [isBatching, listHook]
  );
  const updateItem = (0, import_react6.useCallback)(
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
var import_react7 = require("react");
function useOptimisticQueue(options = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1e3,
    onError,
    onSuccess,
    onRetry
  } = options;
  const [status, setStatus] = (0, import_react7.useState)("idle");
  const [queueSize, setQueueSize] = (0, import_react7.useState)(0);
  const queue = (0, import_react7.useRef)([]);
  const processing = (0, import_react7.useRef)(false);
  const mutationCounter = (0, import_react7.useRef)(0);
  const processQueue = (0, import_react7.useCallback)(async () => {
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
  const enqueue = (0, import_react7.useCallback)(
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
  const clear = (0, import_react7.useCallback)(() => {
    queue.current = [];
    setQueueSize(0);
    setStatus("idle");
  }, []);
  (0, import_react7.useEffect)(() => {
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
var import_react8 = require("react");
function useOptimisticUndo(initialState, options = {}) {
  const { maxHistory = 50, onUndo, onRedo } = options;
  const [state, setState] = (0, import_react8.useState)(initialState);
  const history = (0, import_react8.useRef)([initialState]);
  const currentIndex = (0, import_react8.useRef)(0);
  const set = (0, import_react8.useCallback)((newState) => {
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
  const undo = (0, import_react8.useCallback)(() => {
    if (currentIndex.current > 0) {
      currentIndex.current--;
      const previousState = history.current[currentIndex.current];
      setState(previousState);
      onUndo?.(previousState);
    }
  }, [onUndo]);
  const redo = (0, import_react8.useCallback)(() => {
    if (currentIndex.current < history.current.length - 1) {
      currentIndex.current++;
      const nextState = history.current[currentIndex.current];
      setState(nextState);
      onRedo?.(nextState);
    }
  }, [onRedo]);
  const reset = (0, import_react8.useCallback)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
