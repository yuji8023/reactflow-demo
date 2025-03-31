import { memo } from 'react';
import { MiniMap } from '@xyflow/react';
import UndoRedo from './undo-redo';
import ZoomInOut from './zoom-in-out';
import Control from './control';

export type OperatorProps = {
  handleUndo: () => void;
  handleRedo: () => void;
};

/** @name 操作控件（包含了撤销、重做、缩放、控制等操作） */
const Operator = ({ handleUndo, handleRedo }: OperatorProps) => {
  return (
    <>
      <MiniMap
        pannable
        zoomable
        style={{
          width: 102,
          height: 72,
        }}
        maskColor="var(--color-workflow-minimap-bg)"
        className="!absolute !bottom-14 !left-4 z-[9] !m-0 !h-[72px] !w-[102px] !rounded-lg !border-[0.5px]
        !border-divider-subtle !bg-background-default-subtle !shadow-md !shadow-shadow-shadow-5"
      />
      <div className="absolute bottom-4 left-4 z-[9] mt-1 flex items-center gap-2">
        <ZoomInOut />
        <UndoRedo handleUndo={handleUndo} handleRedo={handleRedo} />
        <Control />
      </div>
    </>
  );
};

export default memo(Operator);
