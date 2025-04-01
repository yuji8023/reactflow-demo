import { memo, useMemo } from 'react';
// import { useEdges } from 'reactflow';
// import { useNodeHelpLink } from '../../hooks/use-node-help-link'
// import ChangeBlock from './change-block';
// import { canRunBySingle } from '../../../../utils';
// import { useStore } from '../../../../store';
import {
  // useNodeDataUpdate,
  useNodesExtraData,
  useNodesInteractions,
  useNodesReadOnly,
  // useNodesSyncDraft,
} from '../../../../hooks';
import ShortcutsName from '../../../../shortcuts-name';
import type { Node } from '../../../../types';
import { BlockEnum } from '../../../../types';

type PanelOperatorPopupProps = {
  id: string;
  data: Node['data'];
  onClosePopup: () => void;
  showHelpLink?: boolean;
};
const PanelOperatorPopup = ({
  id,
  data,
  onClosePopup,
  showHelpLink,
}: PanelOperatorPopupProps) => {
  // const edges = useEdges();
  const {
    handleNodeDelete,
    handleNodesDuplicate,
    // handleNodeSelect,
    handleNodesCopy,
  } = useNodesInteractions();
  // const { handleNodeDataUpdate } = useNodeDataUpdate();
  // const { handleSyncWorkflowDraft } = useNodesSyncDraft();
  const { nodesReadOnly } = useNodesReadOnly();
  const nodesExtraData = useNodesExtraData();
  // const edge = edges.find((edge) => edge.target === id);
  const author = 'yuji';

  const about = useMemo(() => {
    return nodesExtraData[data.type].about;
  }, [data, nodesExtraData]);

  // const showChangeBlock = data.type !== BlockEnum.Start && !nodesReadOnly;
  // &&
  // data.type !== BlockEnum.Iteration &&
  // data.type !== BlockEnum.Loop;

  // const link = useNodeHelpLink(data.type)
  const link = '';

  return (
    <div className="w-[240px] rounded-lg border-[0.5px] border-gray-200 bg-white shadow-xl">
      {/*  {(showChangeBlock || canRunBySingle(data.type)) && (
        <>
          <div className="p-1">
            {canRunBySingle(data.type) && (
              <div
                className={`
                      flex h-8 cursor-pointer items-center rounded-lg px-3 text-sm text-gray-700
                      hover:bg-gray-50
                    `}
                onClick={() => {
                  handleNodeSelect(id);
                  handleNodeDataUpdate({ id, data: { _isSingleRun: true } });
                  handleSyncWorkflowDraft(true);
                  onClosePopup();
                }}
              >
                运行此步骤
              </div>
            )}
            {showChangeBlock && (
              <ChangeBlock
                nodeId={id}
                nodeData={data}
                sourceHandle={edge?.sourceHandle || 'source'}
              />
            )}
          </div>
          <div className="h-[1px] bg-gray-100"></div>
        </>
      )} */}
      {data.type !== BlockEnum.Start && !nodesReadOnly && (
        <>
          <div className="p-1">
            <div
              className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                onClosePopup();
                handleNodesCopy(id);
              }}
            >
              拷贝
              <ShortcutsName keys={['ctrl', 'c']} />
            </div>
            <div
              className="flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                onClosePopup();
                handleNodesDuplicate(id);
              }}
            >
              复制
              <ShortcutsName keys={['ctrl', 'd']} />
            </div>
          </div>
          <div className="h-[1px] bg-gray-100"></div>
          <div className="p-1">
            <div
              className={`
                flex h-8 cursor-pointer items-center justify-between rounded-lg px-3 text-sm text-gray-700
                hover:bg-rose-50 hover:text-red-500
                `}
              onClick={() => handleNodeDelete(id)}
            >
              删除
              <ShortcutsName keys={['del']} />
            </div>
          </div>
          <div className="h-[1px] bg-gray-100"></div>
        </>
      )}
      {showHelpLink && (
        <>
          <div className="p-1">
            <a
              href={link}
              target="_blank"
              className="flex h-8 cursor-pointer items-center rounded-lg px-3 text-sm text-gray-700 hover:bg-gray-50"
            >
              帮助链接
            </a>
          </div>
          <div className="h-[1px] bg-gray-100"></div>
        </>
      )}
      <div className="p-1">
        <div className="px-3 py-2 text-xs text-gray-500">
          <div className="mb-1 flex h-[22px] items-center font-medium">
            关于
          </div>
          <div className="mb-1 leading-[18px] text-gray-700">{about}</div>
          <div className="leading-[18px]">作者 {author}</div>
        </div>
      </div>
    </div>
  );
};

/** @name 节点右键面板 */
export default memo(PanelOperatorPopup);
