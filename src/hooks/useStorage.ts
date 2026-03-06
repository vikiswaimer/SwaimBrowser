/**
 * useStorage Hook
 * Хук для работы с хранилищем данных на всех платформах.
 */

import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

export function useStorage<T>(
  key: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadValue = async () => {
      setIsLoading(true);
      try {
        const stored = await storage.get<T>(key, defaultValue);
        setValue(stored);
      } catch (error) {
        console.error(`Failed to load ${key} from storage:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        await storage.set(key, newValue);
        setValue(newValue);
      } catch (error) {
        console.error(`Failed to save ${key} to storage:`, error);
        throw error;
      }
    },
    [key]
  );

  return [value, updateValue, isLoading];
}
