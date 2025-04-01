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
import { WorkflowContextProvider } from './context';
import { useEventEmitterContextContext } from './context/event-emitter';
import { useWorkflowInit, useNodesInteractions } from './hooks';
import { WorkflowHistoryProvider } from './workflow-history-store';
import type { Edge, Node } from './types';
import { CUSTOM_EDGE, CUSTOM_NODE, WORKFLOW_DATA_UPDATE } from './constants';
import CustomNode from './nodes';
import CustomEdge from './custom-edge';
import CandidateNode from './candidate-node';
import { useStore, useWorkflowStore } from './store';
import { initialEdges, initialNodes } from './utils';

type WorkflowProps = {
  nodes: Node[];
  edges: Edge[];
  // viewport?: Viewport
};

const nodeTypes = {
  [CUSTOM_NODE]: CustomNode,
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
      // handleNodeContextMenu,
      // handleHistoryBack,
      // handleHistoryForward,
    } = useNodesInteractions();

    const handleHistoryForward = () => {
      console.log('forward');
    };

    const handleHistoryBack = () => {
      console.log('back');
    };

    return (
      <div
        id="workflow-container"
        className={`
          relative h-full w-full min-w-[960px] 
        `}
        ref={workflowContainerRef}
      >
        <CandidateNode />
        <Operator
          handleRedo={handleHistoryForward}
          handleUndo={handleHistoryBack}
        />
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
          multiSelectionKeyCode={null}
          deleteKeyCode={null}
          selectionKeyCode={null}
          connectionLineStyle={{ zIndex: 1002 }}
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
