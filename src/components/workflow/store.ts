import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { debounce } from 'lodash-es';
import { WorkflowContext } from './context';
import type {
  HelpLineHorizontalPosition,
  HelpLineVerticalPosition,
} from './help-line/types';

type Shape = {
  controlMode: 'pointer' | 'hand';
  setControlMode: (controlMode: Shape['controlMode']) => void;
  nodeAnimation: boolean;
  setNodeAnimation: (nodeAnimation: boolean) => void;
  helpLineHorizontal?: HelpLineHorizontalPosition;
  setHelpLineHorizontal: (
    helpLineHorizontal?: HelpLineHorizontalPosition,
  ) => void;
  helpLineVertical?: HelpLineVerticalPosition;
  setHelpLineVertical: (helpLineVertical?: HelpLineVerticalPosition) => void;
  showTips: string;
  setShowTips: (showTips: string) => void;
  debouncedSyncWorkflowDraft: (fn: () => void) => void;
};
export const createWorkflowStore = () => {
  return createStore<Shape>((set) => ({
    controlMode: 'pointer',
    setControlMode: (controlMode) => set(() => ({ controlMode })),
    nodeAnimation: false,
    setNodeAnimation: (nodeAnimation) => set(() => ({ nodeAnimation })),
    helpLineHorizontal: undefined,
    setHelpLineHorizontal: (helpLineHorizontal) =>
      set(() => ({ helpLineHorizontal })),
    helpLineVertical: undefined,
    setHelpLineVertical: (helpLineVertical) =>
      set(() => ({ helpLineVertical })),
    showTips: '',
    setShowTips: (showTips) => set(() => ({ showTips })),
    debouncedSyncWorkflowDraft: debounce((syncWorkflowDraft) => {
      syncWorkflowDraft();
    }, 5000),
  }));
};

export function useStore<T>(selector: (state: Shape) => T): T {
  const store = useContext(WorkflowContext);
  if (!store) throw new Error('Missing WorkflowContext.Provider in the tree');

  return useZustandStore(store, selector);
}

export const useWorkflowStore = () => {
  return useContext(WorkflowContext)!;
};
