import { useContext } from 'react';
import {
  DemoDialogContext,
  type DemoDialogContextValue,
} from '@/components/layout/demoDialogContext';

export function useDemoDialog(): DemoDialogContextValue {
  const context = useContext(DemoDialogContext);
  if (!context) throw new Error('useDemoDialog must be used inside <DemoDialogProvider>');
  return context;
}
