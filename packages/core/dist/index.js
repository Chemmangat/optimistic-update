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
  useOptimisticList: () => useOptimisticList,
  useOptimisticMap: () => useOptimisticMap,
  useOptimisticSet: () => useOptimisticSet,
  useOptimisticValue: () => useOptimisticValue
});
module.exports = __toCommonJS(index_exports);

// src/hooks/useOptimisticList.ts
var import_react = require("react");
function useOptimisticList(initialItems, options) {
  const { idKey, onError, onSuccess } = options;
  const [items, setItems] = (0, import_react.useState)(initialItems);
  const [status, setStatus] = (0, import_react.useState)("idle");
  const [error, setError] = (0, import_react.useState)(null);
  const pendingMutations = (0, import_react.useRef)(/* @__PURE__ */ new Map());
  const mutationCounter = (0, import_react.useRef)(0);
  (0, import_react.useEffect)(() => {
    setItems(initialItems);
  }, [initialItems]);
  (0, import_react.useEffect)(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = (0, import_react.useCallback)(
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
  const addItem = (0, import_react.useCallback)(
    async (item, mutationFn) => {
      await executeMutation(
        (current) => [...current, item],
        mutationFn
      );
    },
    [executeMutation]
  );
  const removeItem = (0, import_react.useCallback)(
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
  const updateItem = (0, import_react.useCallback)(
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
var import_react2 = require("react");
function useOptimisticValue(initialValue, options = {}) {
  const { onError, onSuccess } = options;
  const [value, setValue] = (0, import_react2.useState)(initialValue);
  const [status, setStatus] = (0, import_react2.useState)("idle");
  const [error, setError] = (0, import_react2.useState)(null);
  const pendingMutations = (0, import_react2.useRef)(/* @__PURE__ */ new Map());
  const mutationCounter = (0, import_react2.useRef)(0);
  (0, import_react2.useEffect)(() => {
    setValue(initialValue);
  }, [initialValue]);
  (0, import_react2.useEffect)(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const update = (0, import_react2.useCallback)(
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
var import_react3 = require("react");
function useOptimisticMap(initialMap = /* @__PURE__ */ new Map(), options = {}) {
  const { onError, onSuccess } = options;
  const [map, setMap] = (0, import_react3.useState)(new Map(initialMap));
  const [status, setStatus] = (0, import_react3.useState)("idle");
  const [error, setError] = (0, import_react3.useState)(null);
  const pendingMutations = (0, import_react3.useRef)(/* @__PURE__ */ new Map());
  const mutationCounter = (0, import_react3.useRef)(0);
  (0, import_react3.useEffect)(() => {
    setMap(new Map(initialMap));
  }, [initialMap]);
  (0, import_react3.useEffect)(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = (0, import_react3.useCallback)(
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
  const set = (0, import_react3.useCallback)(
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
  const remove = (0, import_react3.useCallback)(
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
  const clear = (0, import_react3.useCallback)(
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
var import_react4 = require("react");
function useOptimisticSet(initialSet = /* @__PURE__ */ new Set(), options = {}) {
  const { onError, onSuccess } = options;
  const [set, setSet] = (0, import_react4.useState)(new Set(initialSet));
  const [status, setStatus] = (0, import_react4.useState)("idle");
  const [error, setError] = (0, import_react4.useState)(null);
  const pendingMutations = (0, import_react4.useRef)(/* @__PURE__ */ new Map());
  const mutationCounter = (0, import_react4.useRef)(0);
  (0, import_react4.useEffect)(() => {
    setSet(new Set(initialSet));
  }, [initialSet]);
  (0, import_react4.useEffect)(() => {
    return () => {
      pendingMutations.current.forEach((mutation) => {
        mutation.abort.abort();
      });
      pendingMutations.current.clear();
    };
  }, []);
  const executeMutation = (0, import_react4.useCallback)(
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
  const add = (0, import_react4.useCallback)(
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
  const remove = (0, import_react4.useCallback)(
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
  const clear = (0, import_react4.useCallback)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useOptimisticList,
  useOptimisticMap,
  useOptimisticSet,
  useOptimisticValue
});
