import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getSyncError,
  getSyncStatus,
  readState,
  subscribe,
  subscribeStatus,
  writeState,
  type StateKey,
  type SyncStatus,
} from '@/lib/profileStore';

/**
 * Igual a um useState, mas o valor pertence ao perfil ativo e é
 * sincronizado com a nuvem (ver lib/profileStore).
 */
export function useProfileState<T>(
  key: StateKey,
  fallback: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(() => readState(key, fallbackRef.current));

  useEffect(() => {
    setValue(readState(key, fallbackRef.current));
    return subscribe((changed) => {
      if (changed === '*' || changed === key) {
        setValue(readState(key, fallbackRef.current));
      }
    });
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = readState(key, fallbackRef.current);
      const resolved = next instanceof Function ? next(prev) : next;
      writeState(key, resolved);
    },
    [key],
  );

  return [value, update];
}

export function useSyncStatus(): { status: SyncStatus; error: string } {
  const [state, setState] = useState(() => ({ status: getSyncStatus(), error: getSyncError() }));

  useEffect(() => {
    const refresh = () => setState({ status: getSyncStatus(), error: getSyncError() });
    refresh();
    return subscribeStatus(refresh);
  }, []);

  return state;
}
