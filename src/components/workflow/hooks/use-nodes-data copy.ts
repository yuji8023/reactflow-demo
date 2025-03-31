import { useMemo } from 'react';
import produce from 'immer';
import { BlockEnum } from '../types';
import { NODES_EXTRA_DATA, NODES_INITIAL_DATA } from '../constants';
// import { useIsChatMode } from './use-workflow';

export const useNodesInitialData = () => {
  return useMemo(() => produce(NODES_INITIAL_DATA, (draft) => {}), []);
};

export const useNodesExtraData = () => {
  // const isChatMode = useIsChatMode();
  const isChatMode = false;

  return useMemo(
    () =>
      produce(NODES_EXTRA_DATA, (draft) => {
        Object.keys(draft).forEach((key) => {
          draft[key as BlockEnum].availablePrevNodes =
            draft[key as BlockEnum].getAvailablePrevNodes(isChatMode);
          draft[key as BlockEnum].availableNextNodes =
            draft[key as BlockEnum].getAvailableNextNodes(isChatMode);
        });
      }),
    [isChatMode],
  );
};

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
        /* if (
          isInIteration &&
          (nType === BlockEnum.Iteration ||
            nType === BlockEnum.Loop ||
            nType === BlockEnum.End)
        )
          return false;

        if (
          isInLoop &&
          (nType === BlockEnum.Iteration ||
            nType === BlockEnum.Loop ||
            nType === BlockEnum.End)
        )
          return false; */

        return true;
      }),
      availableNextBlocks: availableNextBlocks.filter((nType) => {
        /*   if (
          isInIteration &&
          (nType === BlockEnum.Iteration ||
            nType === BlockEnum.Loop ||
            nType === BlockEnum.End)
        )
          return false; */

        /*  if (
          isInLoop &&
          (nType === BlockEnum.Iteration ||
            nType === BlockEnum.Loop ||
            nType === BlockEnum.End)
        )
          return false; */

        return true;
      }),
    };
  }, [isInIteration, availablePrevBlocks, availableNextBlocks, isInLoop]);
};
