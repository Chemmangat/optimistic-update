// src/hooks/useOptimisticList.ts
import { useState, useCallback, useRef, useEffect } from "react";
function useOptimisticList(initialItems, options) {
  const { idKey, onError, onSuccess } = options;
  const [items, setItems] = useState(initialItems);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const pendingMutations = useRef(/* @__PURE__ */ new Map());
  const mutationCounter = useRef(0);
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  useEffect(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = useCallback(
    async (optimisticUpdate, mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      const abortController = new AbortController();
      setItems((current) => {
        const newState = optimisticUpdate(current);
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState: current,
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
          setStatus("success");
          onSuccess?.();
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        const mutation = pendingMutations.current.get(mutationId);
        if (mutation) {
          setItems(mutation.previousState);
          pendingMutations.current.delete(mutationId);
        }
        if (pendingMutations.current.size === 0) {
          setStatus("error");
          setError(error2);
          onError?.(error2);
        }
      }
    },
    [onError, onSuccess]
  );
  const addItem = useCallback(
    async (item, mutationFn) => {
      await executeMutation(
        (current) => [...current, item],
        mutationFn
      );
    },
    [executeMutation]
  );
  const removeItem = useCallback(
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
  const updateItem = useCallback(
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

// src/hooks/useOptimisticValue.ts
import { useState as useState2, useCallback as useCallback2, useRef as useRef2, useEffect as useEffect2 } from "react";
function useOptimisticValue(initialValue, options = {}) {
  const { onError, onSuccess } = options;
  const [value, setValue] = useState2(initialValue);
  const [status, setStatus] = useState2("idle");
  const [error, setError] = useState2(null);
  const pendingMutations = useRef2(/* @__PURE__ */ new Map());
  const mutationCounter = useRef2(0);
  useEffect2(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect2(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const update = useCallback2(
    async (newValue, mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      const abortController = new AbortController();
      setValue((current) => {
        const updated = typeof newValue === "function" ? newValue(current) : newValue;
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousValue: current,
          abort: abortController
        });
        return updated;
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
          setStatus("success");
          onSuccess?.();
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        const mutation = pendingMutations.current.get(mutationId);
        if (mutation) {
          setValue(mutation.previousValue);
          pendingMutations.current.delete(mutationId);
        }
        if (pendingMutations.current.size === 0) {
          setStatus("error");
          setError(error2);
          onError?.(error2);
        }
      }
    },
    [onError, onSuccess]
  );
  return {
    value,
    update,
    status,
    error
  };
}

// src/hooks/useOptimisticMap.ts
import { useState as useState3, useCallback as useCallback3, useRef as useRef3, useEffect as useEffect3 } from "react";
function useOptimisticMap(initialMap = /* @__PURE__ */ new Map(), options = {}) {
  const { onError, onSuccess } = options;
  const [map, setMap] = useState3(new Map(initialMap));
  const [status, setStatus] = useState3("idle");
  const [error, setError] = useState3(null);
  const pendingMutations = useRef3(/* @__PURE__ */ new Map());
  const mutationCounter = useRef3(0);
  useEffect3(() => {
    setMap(new Map(initialMap));
  }, [initialMap]);
  useEffect3(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = useCallback3(
    async (optimisticUpdate, mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      const abortController = new AbortController();
      setMap((current) => {
        const newState = optimisticUpdate(new Map(current));
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState: current,
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
          setStatus("success");
          onSuccess?.();
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        const mutation = pendingMutations.current.get(mutationId);
        if (mutation) {
          setMap(mutation.previousState);
          pendingMutations.current.delete(mutationId);
        }
        if (pendingMutations.current.size === 0) {
          setStatus("error");
          setError(error2);
          onError?.(error2);
        }
      }
    },
    [onError, onSuccess]
  );
  const set = useCallback3(
    async (key, value, mutationFn) => {
      await executeMutation(
        (current) => {
          const newMap = new Map(current);
          newMap.set(key, value);
          return newMap;
        },
        mutationFn
      );
    },
    [executeMutation]
  );
  const remove = useCallback3(
    async (key, mutationFn) => {
      if (!map.has(key)) {
        console.warn(`Key not found in map`);
        return;
      }
      await executeMutation(
        (current) => {
          const newMap = new Map(current);
          newMap.delete(key);
          return newMap;
        },
        mutationFn
      );
    },
    [executeMutation, map]
  );
  const clear = useCallback3(
    async (mutationFn) => {
      await executeMutation(
        () => /* @__PURE__ */ new Map(),
        mutationFn
      );
    },
    [executeMutation]
  );
  return {
    map,
    set,
    remove,
    clear,
    status,
    error
  };
}

// src/hooks/useOptimisticSet.ts
import { useState as useState4, useCallback as useCallback4, useRef as useRef4, useEffect as useEffect4 } from "react";
function useOptimisticSet(initialSet = /* @__PURE__ */ new Set(), options = {}) {
  const { onError, onSuccess } = options;
  const [set, setSet] = useState4(new Set(initialSet));
  const [status, setStatus] = useState4("idle");
  const [error, setError] = useState4(null);
  const pendingMutations = useRef4(/* @__PURE__ */ new Map());
  const mutationCounter = useRef4(0);
  useEffect4(() => {
    setSet(new Set(initialSet));
  }, [initialSet]);
  useEffect4(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = useCallback4(
    async (optimisticUpdate, mutationFn) => {
      const mutationId = `mutation-${mutationCounter.current++}`;
      const abortController = new AbortController();
      setSet((current) => {
        const newState = optimisticUpdate(new Set(current));
        pendingMutations.current.set(mutationId, {
          id: mutationId,
          previousState: current,
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
          setStatus("success");
          onSuccess?.();
        }
      } catch (err) {
        if (abortController.signal.aborted) {
          return;
        }
        const error2 = err instanceof Error ? err : new Error("Mutation failed");
        const mutation = pendingMutations.current.get(mutationId);
        if (mutation) {
          setSet(mutation.previousState);
          pendingMutations.current.delete(mutationId);
        }
        if (pendingMutations.current.size === 0) {
          setStatus("error");
          setError(error2);
          onError?.(error2);
        }
      }
    },
    [onError, onSuccess]
  );
  const add = useCallback4(
    async (value, mutationFn) => {
      await executeMutation(
        (current) => {
          const newSet = new Set(current);
          newSet.add(value);
          return newSet;
        },
        mutationFn
      );
    },
    [executeMutation]
  );
  const remove = useCallback4(
    async (value, mutationFn) => {
      if (!set.has(value)) {
        console.warn(`Value not found in set`);
        return;
      }
      await executeMutation(
        (current) => {
          const newSet = new Set(current);
          newSet.delete(value);
          return newSet;
        },
        mutationFn
      );
    },
    [executeMutation, set]
  );
  const clear = useCallback4(
    async (mutationFn) => {
      await executeMutation(
        () => /* @__PURE__ */ new Set(),
        mutationFn
      );
    },
    [executeMutation]
  );
  return {
    set,
    add,
    remove,
    clear,
    status,
    error
  };
}
export {
  useOptimisticList,
  useOptimisticMap,
  useOptimisticSet,
  useOptimisticValue
};
