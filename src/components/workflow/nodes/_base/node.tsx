import type { FC, ReactElement, ReactNode } from 'react';
import { cloneElement, memo, useEffect, useMemo, useRef } from 'react';
import {
  WarningFilled,
  CheckCircleFilled,
  ExclamationCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import type { NodeProps } from '../../types';
import { NodeRunningStatus } from '../../types';
import { useNodesReadOnly } from '../../hooks';
// import { hasErrorHandleNode, hasRetryNode } from '../../utils';
// import { useNodeIterationInteractions } from '../iteration/use-interactions';
import { NodeSourceHandle, NodeTargetHandle } from './components/node-handle';
// import NodeControl from './components/node-control';
// import ErrorHandleOnNode from './components/error-handle/error-handle-on-node';
// import RetryOnNode from './components/retry/retry-on-node';
// import AddVariablePopupWithPosition from './components/add-variable-popup-with-position';
import cn from '@/utils/classnames';
import BlockIcon from '../../icons/block-icon';

type BaseNodeProps = {
  children: ReactNode;
} & NodeProps;

const BaseNode: FC<BaseNodeProps> = ({ id, data, children }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const { nodesReadOnly } = useNodesReadOnly();
  // const { handleNodeIterationChildSizeChange } = useNodeIterationInteractions();
  // const toolIcon = useToolIcon(data);

  /*   useEffect(() => {
    if (nodeRef.current && data.selected && data.isInIteration) {
      const resizeObserver = new ResizeObserver(() => {
        handleNodeIterationChildSizeChange(id);
      });

      resizeObserver.observe(nodeRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [
    data.isInIteration,
    data.selected,
    id,
    handleNodeIterationChildSizeChange,
  ]); */
  const showSelectedBorder =
    data.selected || data._isBundled || data._isEntering;
  const {
    showRunningBorder,
    showSuccessBorder,
    showFailedBorder,
    showExceptionBorder,
  } = useMemo(() => {
    return {
      showRunningBorder:
        data._runningStatus === NodeRunningStatus.Running &&
        !showSelectedBorder,
      showSuccessBorder:
        data._runningStatus === NodeRunningStatus.Succeeded &&
        !showSelectedBorder,
      showFailedBorder:
        data._runningStatus === NodeRunningStatus.Failed && !showSelectedBorder,
      showExceptionBorder:
        data._runningStatus === NodeRunningStatus.Exception &&
        !showSelectedBorder,
    };
  }, [data._runningStatus, showSelectedBorder]);

  return (
    <div
      className={cn(
        'flex rounded-2xl border-[2px]',
        showSelectedBorder
          ? 'border-components-option-card-option-selected-border'
          : 'border-transparent',
        !showSelectedBorder &&
          data._inParallelHovering &&
          'border-workflow-block-border-highlight',
        data._waitingRun && 'opacity-70',
      )}
      ref={nodeRef}
      style={{
        width: 'auto',
        height: 'auto',
      }}
    >
      <div
        className={cn(
          'group relative pb-1 shadow-xs',
          'rounded-[15px] border border-transparent',
          'w-[240px] bg-workflow-block-bg',
          !data._runningStatus && 'hover:shadow-lg',
          showRunningBorder && '!border-state-accent-solid',
          showSuccessBorder && '!border-state-success-solid',
          showFailedBorder && '!border-state-destructive-solid',
          showExceptionBorder && '!border-state-warning-solid',
          data._isBundled && '!shadow-lg',
        )}
      >
        {data._inParallelHovering && (
          <div className="top system-2xs-medium-uppercase absolute -top-2.5 left-2 z-10 text-text-tertiary">
            {'并行运行'}
          </div>
        )}
        {/* {data._showAddVariablePopup && (
          <AddVariablePopupWithPosition nodeId={id} nodeData={data} />
        )} */}
        {!data._isCandidate && (
          <NodeTargetHandle
            id={id}
            data={data}
            handleClassName="!top-4 !-left-[9px] !translate-y-0"
            handleId="target"
          />
        )}
        {!data._isCandidate && (
          <NodeSourceHandle
            id={id}
            data={data}
            handleClassName="!top-4 !-right-[9px] !translate-y-0"
            handleId="source"
          />
        )}
        {/* {!data._runningStatus && !nodesReadOnly && !data._isCandidate && (
          <NodeControl id={id} data={data} />
        )} */}
        <div className={cn('flex items-center rounded-t-2xl px-3 pb-2 pt-3')}>
          <BlockIcon className="mr-2 shrink-0" type={data.type} size="md" />
          <div
            title={data.title}
            className="system-sm-semibold-uppercase mr-1 flex grow items-center truncate text-text-primary"
          >
            <div>{data.title}</div>
          </div>
          {data._iterationLength &&
            data._iterationIndex &&
            data._runningStatus === NodeRunningStatus.Running && (
              <div className="mr-1.5 text-xs font-medium text-text-accent">
                {data._iterationIndex > data._iterationLength
                  ? data._iterationLength
                  : data._iterationIndex}
                /{data._iterationLength}
              </div>
            )}
          {data._loopLength &&
            data._loopIndex &&
            data._runningStatus === NodeRunningStatus.Running && (
              <div className="mr-1.5 text-xs font-medium text-primary-600">
                {data._loopIndex > data._loopLength
                  ? data._loopLength
                  : data._loopIndex}
                /{data._loopLength}
              </div>
            )}
          {(data._runningStatus === NodeRunningStatus.Running ||
            data._singleRunningStatus === NodeRunningStatus.Running) && (
            <LoadingOutlined className="h-3.5 w-3.5 animate-spin text-text-accent" />
          )}
          {data._runningStatus === NodeRunningStatus.Succeeded && (
            <CheckCircleFilled className="h-3.5 w-3.5 text-text-success" />
          )}
          {data._runningStatus === NodeRunningStatus.Failed && (
            <ExclamationCircleFilled className="h-3.5 w-3.5 text-text-destructive" />
          )}
          {data._runningStatus === NodeRunningStatus.Exception && (
            <WarningFilled className="h-3.5 w-3.5 text-text-warning-secondary" />
          )}
        </div>
        {cloneElement(children as ReactElement, { id, data })}
        {/* {hasRetryNode(data.type) && <RetryOnNode id={id} data={data} />} */}
        {/* {hasErrorHandleNode(data.type) && (
          <ErrorHandleOnNode id={id} data={data} />
        )} */}
        {data.desc && (
          <div className="system-xs-regular whitespace-pre-line break-words px-3 pb-2 pt-1 text-text-tertiary">
            {data.desc}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(BaseNode);
