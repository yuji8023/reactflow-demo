import { memo, useCallback, useState } from 'react';
import { PlusCircleFilled } from '@ant-design/icons';
import { useStoreApi } from 'reactflow';
import type { OffsetOptions } from '@floating-ui/react';
import { generateNewNode } from '../utils';
import {
  useAvailableBlocks,
  useNodesReadOnly,
  usePanelInteractions,
} from '../hooks';
import { NODES_INITIAL_DATA } from '../constants';
import { useWorkflowStore } from '../store';
import TipPopup from './tip-popup';
import cn from '@/utils/classnames';
import BlockSelector from '../block-selector';
import type { OnSelectBlock } from '../types';
import { BlockEnum } from '../types';

type AddBlockProps = {
  renderTrigger?: (open: boolean) => React.ReactNode;
  offset?: OffsetOptions;
};

/** @name 新增节点按钮功能 */
const AddBlock = ({ renderTrigger, offset }: AddBlockProps) => {
  const store = useStoreApi();
  const workflowStore = useWorkflowStore();
  const { nodesReadOnly } = useNodesReadOnly();
  const { handlePaneContextmenuCancel } = usePanelInteractions();
  const [open, setOpen] = useState(false);
  const { availableNextBlocks } = useAvailableBlocks(BlockEnum.Start, false);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setOpen(open);
      if (!open) handlePaneContextmenuCancel();
    },
    [handlePaneContextmenuCancel],
  );

  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();
      const nodesWithSameType = nodes.filter((node) => node.data.type === type);
      const { newNode } = generateNewNode({
        data: {
          ...NODES_INITIAL_DATA[type],
          title: `${NODES_INITIAL_DATA[type].title} ${
            nodesWithSameType.length + 1
          }`,
          ...(toolDefaultValue || {}),
          _isCandidate: true,
        },
        position: {
          x: 0,
          y: 0,
        },
      });
      workflowStore.setState({
        candidateNode: newNode,
      });
    },
    [store, workflowStore],
  );

  const renderTriggerElement = useCallback(
    (open: boolean) => {
      return (
        <TipPopup title="添加节点">
          <div
            className={cn(
              'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
              `${
                nodesReadOnly &&
                'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
              }`,
              open && 'bg-state-accent-active text-text-accent',
            )}
          >
            <PlusCircleFilled className="h-4 w-4" />
          </div>
        </TipPopup>
      );
    },
    [nodesReadOnly],
  );

  return (
    <BlockSelector
      open={open}
      onOpenChange={handleOpenChange}
      disabled={nodesReadOnly}
      onSelect={handleSelect}
      placement="top-start"
      offset={
        offset ?? {
          mainAxis: 4,
          crossAxis: -8,
        }
      }
      trigger={renderTrigger || renderTriggerElement}
      popupClassName="!min-w-[256px]"
      availableBlocksTypes={availableNextBlocks}
    />
  );
};

export default memo(AddBlock);
