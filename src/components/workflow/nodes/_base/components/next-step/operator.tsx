import { useCallback } from 'react';
import { EllipsisOutlined } from '@ant-design/icons';
import { intersection } from 'lodash-es';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/components/base/portal-to-follow-elem';
import { Button } from 'antd';
import BlockSelector from '../../../../block-selector';
import { useAvailableBlocks, useNodesInteractions } from '../../../../hooks';
import type { CommonNodeType, OnSelectBlock } from '../../../../types';

type ChangeItemProps = {
  data: CommonNodeType;
  nodeId: string;
  sourceHandle: string;
};
const ChangeItem = ({ data, nodeId, sourceHandle }: ChangeItemProps) => {
  const { handleNodeChange } = useNodesInteractions();
  const { availablePrevBlocks, availableNextBlocks } = useAvailableBlocks(
    data.type,
    data.isInIteration,
    data.isInLoop,
  );

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      handleNodeChange(nodeId, type, sourceHandle, toolDefaultValue);
    },
    [nodeId, sourceHandle, handleNodeChange],
  );

  const renderTrigger = useCallback(() => {
    return (
      <div className="flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover">
        更改
      </div>
    );
  }, []);

  return (
    <BlockSelector
      onSelect={handleSelect}
      placement="top-end"
      offset={{
        mainAxis: 6,
        crossAxis: 8,
      }}
      trigger={renderTrigger}
      popupClassName="!w-[328px]"
      availableBlocksTypes={intersection(
        availablePrevBlocks,
        availableNextBlocks,
      ).filter((item) => item !== data.type)}
    />
  );
};

type OperatorProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: CommonNodeType;
  nodeId: string;
  sourceHandle: string;
};
const Operator = ({
  open,
  onOpenChange,
  data,
  nodeId,
  sourceHandle,
}: OperatorProps) => {
  const { handleNodeDelete, handleNodeDisconnect } = useNodesInteractions();

  return (
    <PortalToFollowElem
      placement="bottom-end"
      offset={{ mainAxis: 4, crossAxis: -4 }}
      open={open}
      onOpenChange={onOpenChange}
    >
      <PortalToFollowElemTrigger onClick={() => onOpenChange(!open)}>
        <Button className="h-6 w-6 p-0">
          <EllipsisOutlined className="h-4 w-4" />
        </Button>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-10">
        <div className="system-md-regular min-w-[120px] rounded-xl border-[0.5px] border-components-panel-border bg-components-panel-bg-blur text-text-secondary shadow-lg">
          <div className="p-1">
            <ChangeItem
              data={data}
              nodeId={nodeId}
              sourceHandle={sourceHandle}
            />
            <div
              className="flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover"
              onClick={() => handleNodeDisconnect(nodeId)}
            >
              断开连接
            </div>
          </div>
          <div className="p-1">
            <div
              className="flex h-8 cursor-pointer items-center rounded-lg px-2 hover:bg-state-base-hover"
              onClick={() => handleNodeDelete(nodeId)}
            >
              删除
            </div>
          </div>
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

export default Operator;
