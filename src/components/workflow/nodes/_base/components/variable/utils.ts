import produce from 'immer';
import type { EndNodeType } from '../../../end/types';
import {
  BlockEnum,
  Node,
  ValueSelector,
  EnvironmentVariable,
  ConversationVariable,
  VarType,
  Var,
  NodeOutPutVar,
  InputVarType,
} from '../../../../types';
import { SUPPORT_OUTPUT_VARS_NODE } from '../../../../constants';
import { OUTPUT_FILE_SUB_VARIABLES } from '../../../constants';
import type { StartNodeType } from '../../../start/types';

export const isSystemVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'sys' || valueSelector[1] === 'sys';
};

export const isENV = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'env';
};

export const isConversationVar = (valueSelector: ValueSelector) => {
  return valueSelector[0] === 'conversation';
};

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

const inputVarTypeToVarType = (type: InputVarType): VarType => {
  return (
    (
      {
        [InputVarType.number]: VarType.number,
        [InputVarType.singleFile]: VarType.file,
        [InputVarType.multiFiles]: VarType.arrayFile,
      } as any
    )[type] || VarType.string
  );
};

const findExceptVarInObject = (
  obj: any,
  filterVar: (payload: Var, selector: ValueSelector) => boolean,
  value_selector: ValueSelector,
  isFile?: boolean,
): Var => {
  const { children } = obj;
  const res: Var = {
    variable: obj.variable,
    type: isFile ? VarType.file : VarType.object,
    children: children.filter((item: Var) => {
      const { children } = item;
      const currSelector = [...value_selector, item.variable];
      if (!children) return filterVar(item, currSelector);

      const obj = findExceptVarInObject(item, filterVar, currSelector, false); // File doesn't contains file children
      return obj.children && obj.children?.length > 0;
    }),
  };
  return res;
};

const formatItem = (
  item: any,
  isChatMode: boolean,
  filterVar: (payload: Var, selector: ValueSelector) => boolean,
): NodeOutPutVar => {
  const { id, data } = item;

  const res: NodeOutPutVar = {
    nodeId: id,
    title: data.title,
    vars: [],
  };
  switch (data.type) {
    case BlockEnum.Start: {
      const { variables } = data as StartNodeType;
      res.vars = variables.map((v) => {
        return {
          variable: v.variable,
          type: inputVarTypeToVarType(v.type),
          isParagraph: v.type === InputVarType.paragraph,
          isSelect: v.type === InputVarType.select,
          options: v.options,
          required: v.required,
        };
      });

      res.vars.push({
        variable: 'sys.user_id',
        type: VarType.string,
      });
      res.vars.push({
        variable: 'sys.files',
        type: VarType.arrayFile,
      });
      res.vars.push({
        variable: 'sys.app_id',
        type: VarType.string,
      });
      res.vars.push({
        variable: 'sys.workflow_id',
        type: VarType.string,
      });
      res.vars.push({
        variable: 'sys.workflow_run_id',
        type: VarType.string,
      });

      break;
    }

    case 'env': {
      res.vars = data.envList.map((env: EnvironmentVariable) => {
        return {
          variable: `env.${env.name}`,
          type: env.value_type,
        };
      }) as Var[];
      break;
    }

    case 'conversation': {
      res.vars = data.chatVarList.map((chatVar: ConversationVariable) => {
        return {
          variable: `conversation.${chatVar.name}`,
          type: chatVar.value_type,
          des: chatVar.description,
        };
      }) as Var[];
      break;
    }
  }

  const { error_strategy } = data;

  if (error_strategy) {
    res.vars = [
      ...res.vars,
      {
        variable: 'error_message',
        type: VarType.string,
        isException: true,
      },
      {
        variable: 'error_type',
        type: VarType.string,
        isException: true,
      },
    ];
  }

  const selector = [id];
  res.vars = res.vars
    .filter((v) => {
      const isCurrentMatched = filterVar(
        v,
        (() => {
          const variableArr = v.variable.split('.');
          const [first, ..._other] = variableArr;
          if (first === 'sys' || first === 'env' || first === 'conversation')
            return variableArr;

          return [...selector, ...variableArr];
        })(),
      );
      if (isCurrentMatched) return true;

      const isFile = v.type === VarType.file;
      const children = (() => {
        if (isFile) {
          return OUTPUT_FILE_SUB_VARIABLES.map((key) => {
            return {
              variable: key,
              type: key === 'size' ? VarType.number : VarType.string,
            };
          });
        }
        return v.children;
      })();
      if (!children) return false;

      const obj = findExceptVarInObject(
        isFile ? { ...v, children } : v,
        filterVar,
        selector,
        isFile,
      );
      return obj?.children && obj?.children.length > 0;
    })
    .map((v) => {
      const isFile = v.type === VarType.file;

      const { children } = (() => {
        if (isFile) {
          return {
            children: OUTPUT_FILE_SUB_VARIABLES.map((key) => {
              return {
                variable: key,
                type: key === 'size' ? VarType.number : VarType.string,
              };
            }),
          };
        }
        return v;
      })();

      if (!children) return v;

      return findExceptVarInObject(
        isFile ? { ...v, children } : v,
        filterVar,
        selector,
        isFile,
      );
    });

  return res;
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

export const toNodeOutputVars = (
  nodes: any[],
  isChatMode: boolean,
  filterVar = (_payload: Var, _selector: ValueSelector) => true,
  environmentVariables: EnvironmentVariable[] = [],
  conversationVariables: ConversationVariable[] = [],
): NodeOutPutVar[] => {
  // ENV_NODE data format
  const ENV_NODE = {
    id: 'env',
    data: {
      title: 'ENVIRONMENT',
      type: 'env',
      envList: environmentVariables,
    },
  };
  // CHAT_VAR_NODE data format
  const CHAT_VAR_NODE = {
    id: 'conversation',
    data: {
      title: 'CONVERSATION',
      type: 'conversation',
      chatVarList: conversationVariables,
    },
  };
  const res = [
    ...nodes.filter((node) =>
      SUPPORT_OUTPUT_VARS_NODE.includes(node.data.type),
    ),
    ...(environmentVariables.length > 0 ? [ENV_NODE] : []),
    ...(isChatMode && conversationVariables.length > 0 ? [CHAT_VAR_NODE] : []),
  ]
    .map((node) => {
      return {
        ...formatItem(node, isChatMode, filterVar),
        isStartNode: node.data.type === BlockEnum.Start,
      };
    })
    .filter((item) => item.vars.length > 0);
  return res;
};
export const getVarType = ({
  parentNode,
  valueSelector,
  isIterationItem,
  isLoopItem,
  availableNodes,
  isChatMode,
  isConstant,
  environmentVariables = [],
  conversationVariables = [],
}: {
  valueSelector: ValueSelector;
  parentNode?: Node | null;
  isIterationItem?: boolean;
  isLoopItem?: boolean;
  availableNodes: any[];
  isChatMode: boolean;
  isConstant?: boolean;
  environmentVariables?: EnvironmentVariable[];
  conversationVariables?: ConversationVariable[];
}): VarType => {
  if (isConstant) return VarType.string;

  const beforeNodesOutputVars = toNodeOutputVars(
    availableNodes,
    isChatMode,
    undefined,
    environmentVariables,
    conversationVariables,
  );

  // const isIterationInnerVar = parentNode?.data.type === BlockEnum.Iteration;
  // if (isIterationItem) {
  //   return getIterationItemType({
  //     valueSelector,
  //     beforeNodesOutputVars,
  //   });
  // }
  // if (isIterationInnerVar) {
  //   if (valueSelector[1] === 'item') {
  //     const itemType = getIterationItemType({
  //       valueSelector: (parentNode?.data as any).iterator_selector || [],
  //       beforeNodesOutputVars,
  //     });
  //     return itemType;
  //   }
  //   if (valueSelector[1] === 'index') return VarType.number;
  // }

  // const isLoopInnerVar = parentNode?.data.type === BlockEnum.Loop;
  // if (isLoopItem) {
  //   return getLoopItemType({
  //     valueSelector,
  //     beforeNodesOutputVars,
  //   });
  // }
  // if (isLoopInnerVar) {
  //   if (valueSelector[1] === 'item') {
  //     const itemType = getLoopItemType({
  //       valueSelector: (parentNode?.data as any).iterator_selector || [],
  //       beforeNodesOutputVars,
  //     });
  //     return itemType;
  //   }
  //   if (valueSelector[1] === 'index') return VarType.number;
  // }

  const isSystem = isSystemVar(valueSelector);
  const isEnv = isENV(valueSelector);
  const isChatVar = isConversationVar(valueSelector);
  const startNode = availableNodes.find((node: any) => {
    return node.data.type === BlockEnum.Start;
  });

  const targetVarNodeId = isSystem ? startNode?.id : valueSelector[0];
  const targetVar = beforeNodesOutputVars.find(
    (v) => v.nodeId === targetVarNodeId,
  );

  if (!targetVar) return VarType.string;

  let type: VarType = VarType.string;
  let curr: any = targetVar.vars;
  if (isSystem || isEnv || isChatVar) {
    return curr.find(
      (v: any) => v.variable === (valueSelector as ValueSelector).join('.'),
    )?.type;
  } else {
    (valueSelector as ValueSelector).slice(1).forEach((key, i) => {
      const isLast = i === valueSelector.length - 2;
      if (Array.isArray(curr))
        curr = curr?.find((v: any) => v.variable === key);

      if (isLast) {
        type = curr?.type;
      } else {
        if (curr?.type === VarType.object || curr?.type === VarType.file)
          curr = curr.children;
      }
    });
    return type;
  }
};

// node output vars + parent inner vars(if in iteration or other wrap node)
export const toNodeAvailableVars = ({
  parentNode,
  beforeNodes,
  isChatMode,
  environmentVariables,
  conversationVariables,
  filterVar,
}: {
  parentNode?: Node | null;
  t?: any;
  // to get those nodes output vars
  beforeNodes: Node[];
  isChatMode: boolean;
  // env
  environmentVariables?: EnvironmentVariable[];
  // chat var
  conversationVariables?: ConversationVariable[];
  filterVar: (payload: Var, selector: ValueSelector) => boolean;
}): NodeOutPutVar[] => {
  const beforeNodesOutputVars = toNodeOutputVars(
    beforeNodes,
    isChatMode,
    filterVar,
    environmentVariables,
    conversationVariables,
  );
  /*   const isInIteration = parentNode?.data.type === BlockEnum.Iteration;
  if (isInIteration) {
    const iterationNode: any = parentNode;
    const itemType = getVarType({
      parentNode: iterationNode,
      isIterationItem: true,
      valueSelector: iterationNode?.data.iterator_selector || [],
      availableNodes: beforeNodes,
      isChatMode,
      environmentVariables,
      conversationVariables,
    });
    const itemChildren =
      itemType === VarType.file
        ? {
            children: OUTPUT_FILE_SUB_VARIABLES.map((key) => {
              return {
                variable: key,
                type: key === 'size' ? VarType.number : VarType.string,
              };
            }),
          }
        : {};
    const iterationVar = {
      nodeId: iterationNode?.id,
      title: t('workflow.nodes.iteration.currentIteration'),
      vars: [
        {
          variable: 'item',
          type: itemType,
          ...itemChildren,
        },
        {
          variable: 'index',
          type: VarType.number,
        },
      ],
    };
    beforeNodesOutputVars.unshift(iterationVar);
  } */
  return beforeNodesOutputVars;
};
