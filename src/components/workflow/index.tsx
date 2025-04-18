import type { FC } from 'react';
import React, {
  memo,
  useCallback,
  useMemo,
  useEffect,
  useState,
  useRef,
} from 'react';
import { setAutoFreeze } from 'immer';
import { useEventListener } from 'ahooks';
import {
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Loading from '@/components/base/loading';
import './style.css';
import Operator from './operator';
import Header from './header';
import Panel from './panel';
import { WorkflowContextProvider } from './context';
import { useEventEmitterContextContext } from './context/event-emitter';
import {
  useWorkflowInit,
  useNodesInteractions,
  useEdgesInteractions,
  useSelectionInteractions,
  usePanelInteractions,
  useWorkflowReadOnly,
  useNodesReadOnly,
  useWorkflow,
  useShortcuts,
} from './hooks';
import { WorkflowHistoryProvider } from './workflow-history-store';
import type { Edge, Node } from './types';
import { ControlMode } from './types';
import {
  CUSTOM_EDGE,
  CUSTOM_NODE,
  WORKFLOW_DATA_UPDATE,
  ITERATION_CHILDREN_Z_INDEX,
} from './constants';
import { CUSTOM_NOTE_NODE } from './note-node/constants';
import CustomNode from './nodes';
import CustomNoteNode from './note-node';
import CustomEdge from './custom-edge';
import CustomConnectionLine from './custom-connection-line';
import HelpLine from './help-line';
import CandidateNode from './candidate-node';
import PanelContextmenu from './panel-contextmenu';
import NodeContextmenu from './node-contextmenu';
import { useStore, useWorkflowStore } from './store';
import { initialEdges, initialNodes } from './utils';

type WorkflowProps = {
  nodes: Node[];
  edges: Edge[];
  // viewport?: Viewport
};

const nodeTypes = {
  [CUSTOM_NODE]: CustomNode,
  [CUSTOM_NOTE_NODE]: CustomNoteNode,
};

const edgeTypes = {
  [CUSTOM_EDGE]: CustomEdge,
};

const Workflow: FC<WorkflowProps> = memo(
  ({ nodes: originalNodes, edges: originalEdges }) => {
    const workflowContainerRef = useRef<HTMLDivElement>(null);
    const workflowStore = useWorkflowStore();
    const reactflow = useReactFlow();
    const [nodes, setNodes] = useNodesState(originalNodes);
    const [edges, setEdges] = useEdgesState(originalEdges);
    // 模式
    const controlMode = useStore((s) => s.controlMode);
    const { workflowReadOnly } = useWorkflowReadOnly();
    const { nodesReadOnly } = useNodesReadOnly();

    useEffect(() => {
      setAutoFreeze(false);

      return () => {
        setAutoFreeze(true);
      };
    }, []);

    const { eventEmitter } = useEventEmitterContextContext();

    eventEmitter?.useSubscription((v: any) => {
      if (v.type === WORKFLOW_DATA_UPDATE) {
        setNodes(v.payload.nodes);
        setEdges(v.payload.edges);

        if (v.payload.viewport) reactflow.setViewport(v.payload.viewport);

        // if (v.payload.features && featuresStore) {
        //   const { setFeatures } = featuresStore.getState();

        //   setFeatures(v.payload.features);
        // }

        // if (v.payload.hash) setSyncWorkflowDraftHash(v.payload.hash);

        // setTimeout(() => setControlPromptEditorRerenderKey(Date.now()));
      }
    });

    useEventListener('keydown', (e) => {
      if ((e.key === 'd' || e.key === 'D') && (e.ctrlKey || e.metaKey))
        e.preventDefault();
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey))
        e.preventDefault();
      if ((e.key === 'y' || e.key === 'Y') && (e.ctrlKey || e.metaKey))
        e.preventDefault();
      if ((e.key === 's' || e.key === 'S') && (e.ctrlKey || e.metaKey))
        e.preventDefault();
    });
    useEventListener('mousemove', (e) => {
      const containerClientRect =
        workflowContainerRef.current?.getBoundingClientRect();

      if (containerClientRect) {
        workflowStore.setState({
          mousePosition: {
            pageX: e.clientX,
            pageY: e.clientY,
            elementX: e.clientX - containerClientRect.left,
            elementY: e.clientY - containerClientRect.top,
          },
        });
      }
    });

    const {
      handleNodeDragStart,
      handleNodeDrag,
      handleNodeDragStop,
      handleNodeEnter,
      handleNodeLeave,
      handleNodeClick,
      handleNodeConnect,
      handleNodeConnectStart,
      handleNodeConnectEnd,
      handleNodeContextMenu,
      handleHistoryBack,
      handleHistoryForward,
    } = useNodesInteractions();
    const {
      handlePaneContextMenu,
      // handlePaneContextmenuCancel,
    } = usePanelInteractions();

    const { isValidConnection } = useWorkflow();

    const { handleEdgeEnter, handleEdgeLeave, handleEdgesChange } =
      useEdgesInteractions();

    const { handleSelectionStart, handleSelectionChange, handleSelectionDrag } =
      useSelectionInteractions();

    useShortcuts();

    return (
      <div
        id="workflow-container"
        className={`
          relative h-full w-full min-w-[960px] 
        `}
        ref={workflowContainerRef}
      >
        <CandidateNode />
        <Header />
        <Panel />
        <Operator
          handleRedo={handleHistoryForward}
          handleUndo={handleHistoryBack}
        />
        <PanelContextmenu />
        <NodeContextmenu />
        <HelpLine />
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodeDragStart={handleNodeDragStart}
          onNodeDrag={handleNodeDrag}
          onNodeDragStop={handleNodeDragStop}
          onNodeMouseEnter={handleNodeEnter}
          onNodeMouseLeave={handleNodeLeave}
          onNodeClick={handleNodeClick}
          onNodeContextMenu={handleNodeContextMenu}
          onConnect={handleNodeConnect}
          onConnectStart={handleNodeConnectStart}
          onConnectEnd={handleNodeConnectEnd}
          onEdgeMouseEnter={handleEdgeEnter}
          onEdgeMouseLeave={handleEdgeLeave}
          onEdgesChange={handleEdgesChange}
          onSelectionStart={handleSelectionStart}
          onSelectionChange={handleSelectionChange}
          onSelectionDrag={handleSelectionDrag}
          onPaneContextMenu={handlePaneContextMenu}
          // TODO: add edge context menu
          connectionLineComponent={CustomConnectionLine}
          connectionLineContainerStyle={{ zIndex: ITERATION_CHILDREN_Z_INDEX }}
          // defaultViewport={viewport}
          defaultViewport={{ x: 100, y: 0, zoom: 1 }}
          multiSelectionKeyCode={null}
          deleteKeyCode={null}
          nodesDraggable={!nodesReadOnly}
          nodesConnectable={!nodesReadOnly}
          nodesFocusable={!nodesReadOnly}
          edgesFocusable={!nodesReadOnly}
          // panOnDrag={
          //   controlMode === ControlMode.Hand && !workflowReadOnly ? [2] : false
          // }
          panOnDrag={[2]}
          zoomOnPinch={!workflowReadOnly}
          zoomOnScroll={!workflowReadOnly}
          zoomOnDoubleClick={!workflowReadOnly}
          isValidConnection={isValidConnection}
          selectionKeyCode={null}
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={
            controlMode === ControlMode.Pointer && !workflowReadOnly
          }
          minZoom={0.25}
        >
          <Background
            gap={[14, 14]}
            size={2}
            color="#8585ad26"
            style={{ backgroundColor: '#f2f4f7' }}
          />
        </ReactFlow>
      </div>
    );
  },
);

Workflow.displayName = 'Workflow';

const WorkflowWrap = memo(() => {
  const { data, isLoading = false } = useWorkflowInit();

  const nodesData = useMemo(() => {
    if (data) return initialNodes(data.graph.nodes, data.graph.edges);
    return [];
  }, [data]);

  const edgesData = useMemo(() => {
    if (data) return initialEdges(data.graph.edges, data.graph.nodes);

    return [];
  }, [data]);

  if (!data || isLoading) {
    return (
      <div className="relative flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <WorkflowHistoryProvider nodes={nodesData} edges={edgesData}>
        <Workflow nodes={nodesData} edges={edgesData} />
      </WorkflowHistoryProvider>
    </ReactFlowProvider>
  );
});

WorkflowWrap.displayName = 'WorkflowWrap';

const WorkflowContainer = () => {
  return (
    <WorkflowContextProvider>
      <WorkflowWrap />
    </WorkflowContextProvider>
  );
};

export default memo(WorkflowContainer);
