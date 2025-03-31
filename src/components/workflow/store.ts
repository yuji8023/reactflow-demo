import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { WorkflowContext } from './context';

type Shape = {
  controlMode: 'pointer' | 'hand';
  setControlMode: (controlMode: Shape['controlMode']) => void;
};
export const createWorkflowStore = () => {
  return createStore<Shape>((set) => ({
    controlMode: 'pointer',
    setControlMode: (controlMode) => set(() => ({ controlMode })),
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
