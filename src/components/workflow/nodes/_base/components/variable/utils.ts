import produce from 'immer';
import type { EndNodeType } from '../../../end/types';
import { BlockEnum, Node, ValueSelector } from '../../../../types';
import type { StartNodeType } from '../../../start/types';

export const getNodeUsedVars = (node: Node): ValueSelector[] => {
  const { data } = node;
  const { type } = data;
  let res: ValueSelector[] = [];
  switch (
    type
    // case 'end': {
    //   res = (data as EndNodeType).outputs?.map((output: any) => {
    //     return output.value_selector;
    //   });
    //   break;
    // }
  ) {
  }
  return res || [];
};

export const findUsedVarNodes = (
  varSelector: ValueSelector,
  availableNodes: Node[],
): Node[] => {
  const res: Node[] = [];
  availableNodes.forEach((node) => {
    const vars = getNodeUsedVars(node);
    if (vars.find((v: any) => v.join('.') === varSelector.join('.')))
      res.push(node);
  });
  return res;
};

export const updateNodeVars = (
  oldNode: Node,
  oldVarSelector: ValueSelector,
  newVarSelector: ValueSelector,
): Node => {
  const newNode = produce(oldNode, (draft: any) => {
    const { data } = draft;
    const { type } = data;

    switch (type) {
      case 'end': {
        const payload = data as EndNodeType;
        if (payload.outputs) {
          payload.outputs = payload.outputs.map((output: any) => {
            if (output.value_selector.join('.') === oldVarSelector.join('.'))
              output.value_selector = newVarSelector;
            return output;
          });
        }
        break;
      }
    }
  });
  return newNode;
};
export const getNodeOutputVars = (
  node: Node,
  isChatMode: boolean,
): ValueSelector[] => {
  const { data, id } = node;
  const { type } = data;
  let res: ValueSelector[] = [];

  switch (type) {
    case BlockEnum.Start: {
      const { variables } = data as StartNodeType;
      res = variables.map((v: any) => {
        return [id, v.variable];
      });

      if (isChatMode) {
        res.push([id, 'sys', 'query']);
        res.push([id, 'sys', 'files']);
      }
      break;
    }

    // case 'llm': {
    //   // varsToValueSelectorList(LLM_OUTPUT_STRUCT, [id], res);
    //   break;
    // }
  }

  return res;
};
