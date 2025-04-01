import { useContext } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { debounce } from 'lodash-es';
import { WorkflowContext } from './context';
import type {
  HelpLineHorizontalPosition,
  HelpLineVerticalPosition,
} from './help-line/types';
import type {
  ConversationVariable,
  // Edge,
  EnvironmentVariable,
  // HistoryWorkflowData,
  Node,
  // RunFile,
  // ToolWithProvider,
  // WorkflowRunningData,
} from './types';

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
  candidateNode?: Node;
  setCandidateNode: (candidateNode?: Node) => void;
  panelMenu?: {
    top: number;
    left: number;
  };
  setPanelMenu: (panelMenu: Shape['panelMenu']) => void;
  nodeMenu?: {
    top: number;
    left: number;
    nodeId: string;
  };
  setNodeMenu: (nodeMenu: Shape['nodeMenu']) => void;
  environmentVariables: EnvironmentVariable[];
  setEnvironmentVariables: (
    environmentVariables: EnvironmentVariable[],
  ) => void;
  conversationVariables: ConversationVariable[];
  setConversationVariables: (
    conversationVariables: ConversationVariable[],
  ) => void;
  mousePosition: {
    pageX: number;
    pageY: number;
    elementX: number;
    elementY: number;
  };
  setMousePosition: (mousePosition: Shape['mousePosition']) => void;
  notInitialWorkflow: boolean;
  setNotInitialWorkflow: (notInitialWorkflow: boolean) => void;
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
    candidateNode: undefined, // 粘贴时节点数据（跟随鼠标的虚影效果）
    setCandidateNode: (candidateNode) => set(() => ({ candidateNode })),
    panelMenu: undefined,
    setPanelMenu: (panelMenu) => set(() => ({ panelMenu })),
    nodeMenu: undefined,
    setNodeMenu: (nodeMenu) => set(() => ({ nodeMenu })),
    environmentVariables: [],
    setEnvironmentVariables: (environmentVariables) =>
      set(() => ({ environmentVariables })),
    conversationVariables: [],
    setConversationVariables: (conversationVariables) =>
      set(() => ({ conversationVariables })),
    mousePosition: { pageX: 0, pageY: 0, elementX: 0, elementY: 0 }, // 鼠标在当前react视口坐标
    setMousePosition: (mousePosition) => set(() => ({ mousePosition })),
    notInitialWorkflow: false,
    setNotInitialWorkflow: (notInitialWorkflow) =>
      set(() => ({ notInitialWorkflow })),
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
