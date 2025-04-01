import { useCallback } from 'react';
import { useStore } from '../store';
import {
  getVarType,
  toNodeAvailableVars,
} from '../nodes/_base/components/variable/utils';
import type { Node, NodeOutPutVar, ValueSelector, Var } from '../types';

export const useWorkflowVariables = () => {
  const environmentVariables = useStore((s) => s.environmentVariables);
  const conversationVariables = useStore((s) => s.conversationVariables);

  const getNodeAvailableVars = useCallback(
    ({
      parentNode,
      beforeNodes,
      isChatMode,
      filterVar,
      hideEnv,
      hideChatVar,
    }: {
      parentNode?: Node | null;
      beforeNodes: Node[];
      isChatMode: boolean;
      filterVar: (payload: Var, selector: ValueSelector) => boolean;
      hideEnv?: boolean;
      hideChatVar?: boolean;
    }): NodeOutPutVar[] => {
      return toNodeAvailableVars({
        parentNode,
        beforeNodes,
        isChatMode,
        environmentVariables: hideEnv ? [] : environmentVariables,
        conversationVariables:
          isChatMode && !hideChatVar ? conversationVariables : [],
        filterVar,
      });
    },
    [conversationVariables, environmentVariables],
  );

  const getCurrentVariableType = useCallback(
    ({
      parentNode,
      valueSelector,
      isIterationItem,
      isLoopItem,
      availableNodes,
      isChatMode,
      isConstant,
    }: {
      valueSelector: ValueSelector;
      parentNode?: Node | null;
      isIterationItem?: boolean;
      isLoopItem?: boolean;
      availableNodes: any[];
      isChatMode: boolean;
      isConstant?: boolean;
    }) => {
      return getVarType({
        parentNode,
        valueSelector,
        isIterationItem,
        isLoopItem,
        availableNodes,
        isChatMode,
        isConstant,
        environmentVariables,
        conversationVariables,
      });
    },
    [conversationVariables, environmentVariables],
  );

  return {
    getNodeAvailableVars,
    getCurrentVariableType,
  };
};
