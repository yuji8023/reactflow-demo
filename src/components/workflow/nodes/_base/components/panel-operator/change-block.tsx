import { memo, useCallback, useMemo } from 'react';
import { intersection } from 'lodash-es';
import BlockSelector from '../../../../block-selector';
import { useAvailableBlocks, useNodesInteractions } from '../../../../hooks';
import type { Node, OnSelectBlock } from '../../../../types';

type ChangeBlockProps = {
  nodeId: string;
  nodeData: Node['data'];
  sourceHandle: string;
};
const ChangeBlock = ({ nodeId, nodeData, sourceHandle }: ChangeBlockProps) => {
  const { handleNodeChange } = useNodesInteractions();
  const { availablePrevBlocks, availableNextBlocks } = useAvailableBlocks(
    nodeData.type,
    nodeData.isInIteration,
    nodeData.isInLoop,
  );

  const availableNodes = useMemo(() => {
    if (availablePrevBlocks.length && availableNextBlocks.length)
      return intersection(availablePrevBlocks, availableNextBlocks);
    else if (availablePrevBlocks.length) return availablePrevBlocks;
    else return availableNextBlocks;
  }, [availablePrevBlocks, availableNextBlocks]);

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      handleNodeChange(nodeId, type, sourceHandle, toolDefaultValue);
    },
    [handleNodeChange, nodeId, sourceHandle],
  );

  const renderTrigger = useCallback(() => {
    return (
      <div className="flex h-8 w-[232px] cursor-pointer items-center rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-50">
        更改节点
      </div>
    );
  }, []);

  return (
    <BlockSelector
      placement="bottom-end"
      offset={{
        mainAxis: -36,
        crossAxis: 4,
      }}
      onSelect={handleSelect}
      trigger={renderTrigger}
      popupClassName="min-w-[240px]"
      availableBlocksTypes={availableNodes}
    />
  );
};

export default memo(ChangeBlock);
