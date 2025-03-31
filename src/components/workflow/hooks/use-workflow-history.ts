import { useCallback, useRef, useState } from 'react';
import { debounce } from 'lodash-es';
import { useStoreApi } from 'reactflow';
import { useWorkflowHistoryStore } from '../workflow-history-store';

/**
 * All supported Events that create a new history state.
 * Current limitations:
 * - InputChange events in Node Panels do not trigger state changes.
 * - Resizing UI elements does not trigger state changes.
 */
export enum WorkflowHistoryEvent {
  NodeTitleChange = 'NodeTitleChange',
  NodeDescriptionChange = 'NodeDescriptionChange',
  NodeDragStop = 'NodeDragStop',
  NodeChange = 'NodeChange',
  NodeConnect = 'NodeConnect',
  NodePaste = 'NodePaste',
  NodeDelete = 'NodeDelete',
  EdgeDelete = 'EdgeDelete',
  EdgeDeleteByDeleteBranch = 'EdgeDeleteByDeleteBranch',
  NodeAdd = 'NodeAdd',
  NodeResize = 'NodeResize',
  NoteAdd = 'NoteAdd',
  NoteChange = 'NoteChange',
  NoteDelete = 'NoteDelete',
  LayoutOrganize = 'LayoutOrganize',
}

export const useWorkflowHistory = () => {
  const store = useStoreApi();
  const { store: workflowHistoryStore } = useWorkflowHistoryStore();

  const [undoCallbacks, setUndoCallbacks] = useState<any[]>([]);
  const [redoCallbacks, setRedoCallbacks] = useState<any[]>([]);

  const onUndo = useCallback((callback: unknown) => {
    setUndoCallbacks((prev: any) => [...prev, callback]);
    return () =>
      setUndoCallbacks((prev) => prev.filter((cb) => cb !== callback));
  }, []);

  const onRedo = useCallback((callback: unknown) => {
    setRedoCallbacks((prev: any) => [...prev, callback]);
    return () =>
      setRedoCallbacks((prev) => prev.filter((cb) => cb !== callback));
  }, []);

  const undo = useCallback(() => {
    workflowHistoryStore.temporal.getState().undo();
    undoCallbacks.forEach((callback) => callback());
  }, [undoCallbacks, workflowHistoryStore.temporal]);

  const redo = useCallback(() => {
    workflowHistoryStore.temporal.getState().redo();
    redoCallbacks.forEach((callback) => callback());
  }, [redoCallbacks, workflowHistoryStore.temporal]);

  // Some events may be triggered multiple times in a short period of time.
  // We debounce the history state update to avoid creating multiple history states
  // with minimal changes.
  const saveStateToHistoryRef = useRef(
    debounce((event: WorkflowHistoryEvent) => {
      workflowHistoryStore.setState({
        workflowHistoryEvent: event,
        nodes: store.getState().nodes,
        edges: store.getState().edges,
      });
    }, 500),
  );

  const saveStateToHistory = useCallback((event: WorkflowHistoryEvent) => {
    switch (event) {
      case WorkflowHistoryEvent.NoteChange:
        // Hint: Note change does not trigger when note text changes,
        // because the note editors have their own history states.
        saveStateToHistoryRef.current(event);
        break;
      case WorkflowHistoryEvent.NodeTitleChange:
      case WorkflowHistoryEvent.NodeDescriptionChange:
      case WorkflowHistoryEvent.NodeDragStop:
      case WorkflowHistoryEvent.NodeChange:
      case WorkflowHistoryEvent.NodeConnect:
      case WorkflowHistoryEvent.NodePaste:
      case WorkflowHistoryEvent.NodeDelete:
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
      case WorkflowHistoryEvent.NodeAdd:
      case WorkflowHistoryEvent.NodeResize:
      case WorkflowHistoryEvent.NoteAdd:
      case WorkflowHistoryEvent.LayoutOrganize:
      case WorkflowHistoryEvent.NoteDelete:
        saveStateToHistoryRef.current(event);
        break;
      default:
        // We do not create a history state for every event.
        // Some events of reactflow may change things the user would not want to undo/redo.
        // For example: UI state changes like selecting a node.
        break;
    }
  }, []);

  const getHistoryLabel = useCallback((event: WorkflowHistoryEvent) => {
    switch (event) {
      case WorkflowHistoryEvent.NodeTitleChange:
        return '块标题已更改';
      case WorkflowHistoryEvent.NodeDescriptionChange:
        return '块描述已更改';
      case WorkflowHistoryEvent.LayoutOrganize:
      case WorkflowHistoryEvent.NodeDragStop:
        return '块已移动';
      case WorkflowHistoryEvent.NodeChange:
        return '块已更改';
      case WorkflowHistoryEvent.NodeConnect:
        return '块已连接';
      case WorkflowHistoryEvent.NodePaste:
        return '块已粘贴';
      case WorkflowHistoryEvent.NodeDelete:
        return '块已删除';
      case WorkflowHistoryEvent.NodeAdd:
        return '块已添加';
      case WorkflowHistoryEvent.EdgeDelete:
      case WorkflowHistoryEvent.EdgeDeleteByDeleteBranch:
        return '块已断开连接';
      case WorkflowHistoryEvent.NodeResize:
        return '块已调整大小';
      case WorkflowHistoryEvent.NoteAdd:
        return '注释已添加';
      case WorkflowHistoryEvent.NoteChange:
        return '注释已更改';
      case WorkflowHistoryEvent.NoteDelete:
        return '注释已删除';
      default:
        return '未知事件';
    }
  }, []);

  return {
    store: workflowHistoryStore,
    saveStateToHistory,
    getHistoryLabel,
    undo,
    redo,
    onUndo,
    onRedo,
  };
};
