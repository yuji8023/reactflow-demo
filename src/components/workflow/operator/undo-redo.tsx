import type { FC } from 'react';
import { memo, useEffect, useState } from 'react';
import { RollbackOutlined } from '@ant-design/icons';
import TipPopup from './tip-popup';
import { useWorkflowHistoryStore } from '../workflow-history-store';
// import { useNodesReadOnly } from '@/app/components/workflow/hooks';
import ViewWorkflowHistory from './view-workflow-history';
import classNames from '@/utils/classnames';
import { Divider } from 'antd';

export type UndoRedoProps = { handleUndo: () => void; handleRedo: () => void };
const UndoRedo: FC<UndoRedoProps> = ({ handleUndo, handleRedo }) => {
  const { store } = useWorkflowHistoryStore();
  const [buttonsDisabled, setButtonsDisabled] = useState({
    undo: true,
    redo: true,
  });

  useEffect(() => {
    const unsubscribe = store.temporal.subscribe((state: any) => {
      setButtonsDisabled({
        undo: state.pastStates.length === 0,
        redo: state.futureStates.length === 0,
      });
    });
    return () => unsubscribe();
  }, [store]);

  // const { nodesReadOnly } = useNodesReadOnly();

  return (
    <div className="flex items-center space-x-0.5 rounded-lg border-[0.5px] border-components-actionbar-border bg-components-actionbar-bg p-0.5 shadow-lg backdrop-blur-[5px]">
      <TipPopup title="撤销" shortcuts={['ctrl', 'z']}>
        <div
          data-tooltip-id="workflow.undo"
          className={classNames(
            'system-sm-medium flex h-8 w-8 cursor-pointer select-none items-center rounded-md px-1.5 text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
            buttonsDisabled.undo &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled',
          )}
          onClick={() => !buttonsDisabled.undo && handleUndo()}
        >
          <RollbackOutlined className="h-4 w-4" />
        </div>
      </TipPopup>
      <Divider type="vertical" className="mx-0.5 h-3.5" />
      <TipPopup title="重做" shortcuts={['ctrl', 'y']}>
        <div
          data-tooltip-id="workflow.redo"
          className={classNames(
            'system-sm-medium flex h-8 w-8 cursor-pointer select-none items-center rounded-md px-1.5 text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
            buttonsDisabled.redo &&
              'cursor-not-allowed text-text-disabled hover:bg-transparent hover:text-text-disabled',
          )}
          onClick={() => !buttonsDisabled.redo && handleRedo()}
        >
          <RollbackOutlined className="h-4 w-4 rotate-180 scale-y-[-1]" />
        </div>
      </TipPopup>
      <Divider type="vertical" className="mx-0.5 h-3.5" />
      <ViewWorkflowHistory />
    </div>
  );
};

export default memo(UndoRedo);
