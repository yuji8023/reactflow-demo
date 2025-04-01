import type { FC } from 'react';
import { memo, useCallback } from 'react';
import { useWorkflowStore } from '../store';
import { Button } from 'antd';
// import { useWorkflowMode } from '../hooks';

// import EditingTitle from './editing-title';

const Header: FC = () => {
  const workflowStore = useWorkflowStore();

  const onPublish = useCallback(async () => {}, [workflowStore]);

  return (
    <div className="absolute left-0 top-0 z-10 flex h-14 w-full items-center justify-between bg-mask-top2bottom-gray-50-to-transparent px-3">
      <div>
        {/* {normal && <EditingTitle />} */}
        {/* {restoring && <RestoringTitle />} */}
      </div>
      <div className="flex items-center gap-2">
        {/* <VersionHistoryButton onClick={onStartRestoring} /> */}
        <Button
          className="text-xs"
          type="primary"
          size="small"
          onClick={onPublish}
        >
          发布
        </Button>
      </div>
    </div>
  );
};

export default memo(Header);
