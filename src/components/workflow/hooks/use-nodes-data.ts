import { useMemo } from 'react';
import produce from 'immer';
import { BlockEnum } from '../types';
import { NODES_EXTRA_DATA, NODES_INITIAL_DATA } from '../constants';

export const useNodesInitialData = () => {
  return useMemo(() => produce(NODES_INITIAL_DATA, () => {}), []);
};

export const useNodesExtraData = () => {
  return useMemo(
    () =>
      produce(NODES_EXTRA_DATA, (draft: any) => {
        Object.keys(draft).forEach((key) => {
          draft[key as BlockEnum].availablePrevNodes =
            draft[key as BlockEnum].getAvailablePrevNodes(false);
          draft[key as BlockEnum].availableNextNodes =
            draft[key as BlockEnum].getAvailableNextNodes(false);
        });
      }),
    [],
  );
};

/** @name 根据当前节点返回可选节点 */
export const useAvailableBlocks = (
  nodeType?: BlockEnum,
  isInIteration?: boolean,
  isInLoop?: boolean,
) => {
  const nodesExtraData = useNodesExtraData();
  const availablePrevBlocks = useMemo(() => {
    if (!nodeType) return [];
    return nodesExtraData[nodeType].availablePrevNodes || [];
  }, [nodeType, nodesExtraData]);

  const availableNextBlocks = useMemo(() => {
    if (!nodeType) return [];
    return nodesExtraData[nodeType].availableNextNodes || [];
  }, [nodeType, nodesExtraData]);

  return useMemo(() => {
    return {
      availablePrevBlocks: availablePrevBlocks.filter((nType) => {
        // if (isInIteration && (nType === BlockEnum.Iteration || nType === BlockEnum.Loop || nType === BlockEnum.End))
        //   return false

        // if (isInLoop && (nType === BlockEnum.Iteration || nType === BlockEnum.Loop || nType === BlockEnum.End))
        //   return false

        return true;
      }),
      availableNextBlocks: availableNextBlocks.filter((nType) => {
        // if (isInIteration && (nType === BlockEnum.Iteration || nType === BlockEnum.Loop || nType === BlockEnum.End))
        //   return false

        // if (isInLoop && (nType === BlockEnum.Iteration || nType === BlockEnum.Loop || nType === BlockEnum.End))
        //   return false

        return true;
      }),
    };
  }, [isInIteration, availablePrevBlocks, availableNextBlocks, isInLoop]);
};
