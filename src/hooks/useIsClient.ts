import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => undefined;

/** False on the server and during hydration, true afterwards. Safe gate for portals. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
