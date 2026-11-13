import { createContext } from 'react';

export interface DemoDialogContextValue {
  openDemo: () => void;
}

export const DemoDialogContext = createContext<DemoDialogContextValue | null>(null);
