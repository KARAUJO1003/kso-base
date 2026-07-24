"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => initialValue);

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      setValue(storedValue ? (JSON.parse(storedValue) as T) : initialValue);
    } catch {
      setValue(initialValue);
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage can fail in restricted browser contexts.
    }
  }, [key, value]);

  return [value, setValue] as const;
}
