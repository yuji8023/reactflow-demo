import type { MouseEvent } from 'react';
import { memo } from 'react';
import { AppstoreOutlined } from '@ant-design/icons';
import {
  useNodesReadOnly,
  useWorkflowMoveMode,
  useWorkflowOrganize,
} from '../hooks';
import { ControlMode } from '../types';
import { useStore } from '../store';
import { Divider } from 'antd';
import AddBlock from './add-block';
import TipPopup from './tip-popup';
import { useOperator } from './hooks';
import cn from '@/utils/classnames';
import { AddNoteIcon, CursorIcon, HandIcon } from '../icons';

const Control = () => {
  const controlMode = useStore((s) => s.controlMode);

  const { handleModePointer, handleModeHand } = useWorkflowMoveMode();

  const { handleLayout } = useWorkflowOrganize();

  //TODO 待实现添加注释
  const { handleAddNote } = useOperator();

  const { nodesReadOnly, getNodesReadOnly } = useNodesReadOnly();

  const addNote = (e: MouseEvent<HTMLDivElement>) => {
    if (getNodesReadOnly()) return;

    e.stopPropagation();
    handleAddNote();
  };

  return (
    <div className="flex items-center rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 text-text-tertiary shadow-lg">
      <AddBlock />
      <TipPopup title="添加注释">
        <div
          className={cn(
            'ml-[1px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover hover:text-text-secondary',
            `${
              nodesReadOnly &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
            }`,
          )}
          onClick={addNote}
        >
          <AddNoteIcon className="h-4 w-4" />
        </div>
      </TipPopup>
      <Divider type="vertical" className="mx-0.5 h-3.5" />
      <TipPopup title="指针模式" shortcuts={['v']}>
        <div
          className={cn(
            'mr-[1px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg',
            controlMode === ControlMode.Pointer
              ? 'bg-state-accent-active text-text-accent'
              : 'hover:bg-state-base-hover hover:text-text-secondary',
            `${
              nodesReadOnly &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
            }`,
          )}
          onClick={handleModePointer}
        >
          <CursorIcon className="h-4 w-4" />
        </div>
      </TipPopup>
      <TipPopup title="手模式" shortcuts={['h']}>
        <div
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg',
            controlMode === ControlMode.Hand
              ? 'bg-state-accent-active text-text-accent'
              : 'hover:bg-state-base-hover hover:text-text-secondary',
            `${
              nodesReadOnly &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
            }`,
          )}
          onClick={handleModeHand}
        >
          <HandIcon className="h-4 w-4" />
        </div>
      </TipPopup>
      <Divider type="vertical" className="mx-0.5 h-3.5" />
      <TipPopup title="整理节点" shortcuts={['ctrl', 'o']}>
        <div
          className={cn(
            'flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg hover:bg-state-base-hover hover:text-text-secondary',
            `${
              nodesReadOnly &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled'
            }`,
          )}
          onClick={handleLayout}
        >
          <AppstoreOutlined className="h-4 w-4" />
        </div>
      </TipPopup>
    </div>
  );
};

export default memo(Control);
