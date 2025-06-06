import { memo, useCallback, useRef } from 'react';
import { useClickAway } from 'ahooks';
import type { NodeProps } from 'reactflow';
import NodeResizer from '../nodes/_base/components/node-resizer';
import { useNodeDataUpdate, useNodesInteractions } from '../hooks';
import { useStore } from '../store';
import {
  NoteEditor,
  NoteEditorContextProvider,
  NoteEditorToolbar,
} from './note-editor';
import { THEME_MAP } from './constants';
import { useNote } from './hooks';
import type { NoteNodeType } from './types';
import cn from '@/utils/classnames';

const Icon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 9.75V6H13.5V9.75C13.5 11.8211 11.8211 13.5 9.75 13.5H6V12H9.75C10.9926 12 12 10.9926 12 9.75Z"
        fill="black"
        fillOpacity="0.16"
      />
    </svg>
  );
};

const NoteNode = ({ id, data }: NodeProps<NoteNodeType>) => {
  const controlPromptEditorRerenderKey = useStore(
    (s) => s.controlPromptEditorRerenderKey,
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const theme = data.theme;
  const { handleThemeChange, handleEditorChange, handleShowAuthorChange } =
    useNote(id);
  const { handleNodesCopy, handleNodesDuplicate, handleNodeDelete } =
    useNodesInteractions();
  const { handleNodeDataUpdateWithSyncDraft } = useNodeDataUpdate();

  const handleDeleteNode = useCallback(() => {
    handleNodeDelete(id);
  }, [id, handleNodeDelete]);

  useClickAway(() => {
    handleNodeDataUpdateWithSyncDraft({ id, data: { selected: false } });
  }, ref);

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-md border shadow-xs hover:shadow-md',
        THEME_MAP[theme].bg,
        data.selected ? THEME_MAP[theme].border : 'border-black/5',
      )}
      style={{
        width: data.width,
        height: data.height,
      }}
      ref={ref}
    >
      <NoteEditorContextProvider
        key={controlPromptEditorRerenderKey}
        value={data.text}
      >
        <>
          <NodeResizer
            nodeId={id}
            nodeData={data}
            icon={<Icon />}
            minWidth={240}
            minHeight={88}
          />
          <div
            className={cn(
              'h-2 shrink-0 rounded-t-md opacity-50',
              THEME_MAP[theme].title,
            )}
          ></div>
          {data.selected && (
            <div className="absolute left-1/2 top-[-41px] -translate-x-1/2">
              <NoteEditorToolbar
                theme={theme}
                onThemeChange={handleThemeChange}
                onCopy={handleNodesCopy}
                onDuplicate={handleNodesDuplicate}
                onDelete={handleDeleteNode}
                showAuthor={data.showAuthor}
                onShowAuthorChange={handleShowAuthorChange}
              />
            </div>
          )}
          <div className="grow overflow-y-auto px-3 py-2.5">
            <div
              className={cn(
                data.selected && 'nodrag nopan nowheel cursor-text',
              )}
            >
              <NoteEditor
                containerElement={ref.current}
                placeholder={'输入注释...'}
                onChange={handleEditorChange}
              />
            </div>
          </div>
          {
            <div className="p-3 pt-0 text-xs text-text-tertiary">
              {data.author || '用户'}
            </div>
          }
        </>
      </NoteEditorContextProvider>
    </div>
  );
};

export default memo(NoteNode);
