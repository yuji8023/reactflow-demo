import { memo, useCallback, useMemo, useState } from 'react';
// import { RiAddLine } from '@remixicon/react';
import { PlusOutlined } from '@ant-design/icons';
import {
  useAvailableBlocks,
  useNodesInteractions,
  useNodesReadOnly,
  useWorkflow,
} from '../../../../hooks';
import BlockSelector from '../../../../block-selector';
import type { CommonNodeType, OnSelectBlock } from '../../../../types';

type AddProps = {
  nodeId: string;
  nodeData: CommonNodeType;
  sourceHandle: string;
  isParallel?: boolean;
  isFailBranch?: boolean;
};
const Add = ({
  nodeId,
  nodeData,
  sourceHandle,
  isParallel,
  isFailBranch,
}: AddProps) => {
  const [open, setOpen] = useState(false);
  const { handleNodeAdd } = useNodesInteractions();
  const { nodesReadOnly } = useNodesReadOnly();
  const { availableNextBlocks } = useAvailableBlocks(
    nodeData.type,
    nodeData.isInIteration,
    nodeData.isInLoop,
  );
  const { checkParallelLimit } = useWorkflow();

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      handleNodeAdd(
        {
          nodeType: type,
          toolDefaultValue,
        },
        {
          prevNodeId: nodeId,
          prevNodeSourceHandle: sourceHandle,
        },
      );
    },
    [nodeId, sourceHandle, handleNodeAdd],
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (newOpen && !checkParallelLimit(nodeId, sourceHandle)) return;

      setOpen(newOpen);
    },
    [checkParallelLimit, nodeId, sourceHandle],
  );

  const tip = useMemo(() => {
    if (isFailBranch) return '添加异常分支';

    if (isParallel) return '添加并行节点';

    return '选择下一个节点';
  }, [isFailBranch, isParallel]);
  const renderTrigger = useCallback(
    (open: boolean) => {
      return (
        <div
          className={`
          bg-dropzone-bg hover:bg-dropzone-bg-hover relative flex h-9 cursor-pointer items-center rounded-lg border border-dashed
          border-divider-regular px-2 text-xs text-text-placeholder
          ${open && '!bg-components-dropzone-bg-alt'}
          ${nodesReadOnly && '!cursor-not-allowed'}
        `}
        >
          <div className="bg-background-default-dimm mr-1.5 flex h-5 w-5 items-center justify-center rounded-[5px]">
            <PlusOutlined className="h-3 w-3" />
          </div>
          <div className="flex items-center uppercase">{tip}</div>
        </div>
      );
    },
    [nodesReadOnly, tip],
  );

  return (
    <BlockSelector
      open={open}
      onOpenChange={handleOpenChange}
      disabled={nodesReadOnly}
      onSelect={handleSelect}
      placement="top"
      offset={0}
      trigger={renderTrigger}
      popupClassName="!w-[328px]"
      availableBlocksTypes={availableNextBlocks}
    />
  );
};

export default memo(Add);
