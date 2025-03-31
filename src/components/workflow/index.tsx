import type { FC } from 'react';
import React, { memo, useCallback, useMemo, useEffect, useState } from 'react';
import { setAutoFreeze } from 'immer';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './style.css';
import Operator from './operator';
import { WorkflowContextProvider } from './context';
import { useWorkflowInit } from './hooks';
import { WorkflowHistoryProvider } from './workflow-history-store';
import type { Edge, Node } from './types';
import { CUSTOM_EDGE, CUSTOM_NODE } from './constants';
import CustomNode from './nodes';
import CustomEdge from './custom-edge';
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
    const [nodes, setNodes] = useNodesState([
      {
        id: '1742951629752',
        type: 'custom',
        data: {
          type: 'start',
          title: '开始',
          desc: '',
          variables: [],
          selected: true,
          _connectedSourceHandleIds: [],
          _connectedTargetHandleIds: [],
        },
        position: {
          x: 30,
          y: 251,
        },
        targetPosition: 'left',
        sourcePosition: 'right',
        positionAbsolute: {
          x: 30,
          y: 251,
        },
        width: 244,
        height: 54,
        selected: true,
      },
    ]);
    const [edges, setEdges] = useEdgesState(originalEdges);

    useEffect(() => {
      setAutoFreeze(false);

      return () => {
        setAutoFreeze(true);
      };
    }, []);

    console.log(originalNodes);
    console.log(nodes);

    const onConnect = useCallback(
      (params: any) => setEdges((eds) => addEdge(params, eds)),
      [setEdges],
    );

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
      >
        <Operator
          handleRedo={handleHistoryForward}
          handleUndo={handleHistoryBack}
        />
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
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
  const { data } = useWorkflowInit();

  const nodesData = useMemo(() => {
    if (data) return initialNodes(data.graph.nodes, data.graph.edges);
    return [];
  }, [data]);

  const edgesData = useMemo(() => {
    if (data) return initialEdges(data.graph.edges, data.graph.nodes);

    return [];
  }, [data]);

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
