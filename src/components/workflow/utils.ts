import {
  Position,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from 'reactflow';
import dagre from '@dagrejs/dagre';
import type {
  Edge,
  // InputVar,
  Node,
  // ToolWithProvider,
  // ValueSelector,
} from './types';

import {
  BlockEnum,
  // ErrorHandleMode,
  NodeRunningStatus,
} from './types';
import type { IterationNodeType, LoopNodeType } from './nodes/types';

import { cloneDeep, groupBy, isEqual, uniqBy } from 'lodash-es';

import {
  CUSTOM_NODE,
  // DEFAULT_RETRY_INTERVAL,
  // DEFAULT_RETRY_MAX,
  // ITERATION_CHILDREN_Z_INDEX,
  // ITERATION_NODE_Z_INDEX,
  // LOOP_CHILDREN_Z_INDEX,
  // LOOP_NODE_Z_INDEX,
  NODE_WIDTH_X_OFFSET,
  START_INITIAL_POSITION,
} from './constants';

const WHITE = 'WHITE';
const GRAY = 'GRAY';
const BLACK = 'BLACK';

type ParallelInfoItem = {
  parallelNodeId: string;
  depth: number;
  isBranch?: boolean;
};
type NodeParallelInfo = {
  parallelNodeId: string;
  edgeHandleId: string;
  depth: number;
};
type NodeHandle = {
  node: Node;
  handle: string;
};
type NodeStreamInfo = {
  upstreamNodes: Set<string>;
  downstreamEdges: Set<string>;
};

/** @name 判断是否mac系统 */
export const isMac = () => {
  return navigator.userAgent.toUpperCase().includes('MAC');
};

/** @name 键盘按键名称映射表 */
const specialKeysNameMap: Record<string, string | undefined> = {
  ctrl: '⌘',
  alt: '⌥',
  shift: '⇧',
};

/** * @name 获取键盘按键名称 */
export const getKeyboardKeyNameBySystem = (key: string) => {
  if (isMac()) return specialKeysNameMap[key] || key;

  return key;
};

export const preprocessNodesAndEdges = (nodes: Node[], edges: Edge[]) => {
  return {
    nodes,
    edges,
  };
};

const isCyclicUtil = (
  nodeId: string,
  color: Record<string, string>,
  adjList: Record<string, string[]>,
  stack: string[],
) => {
  color[nodeId] = GRAY;
  stack.push(nodeId);

  for (let i = 0; i < adjList[nodeId].length; ++i) {
    const childId = adjList[nodeId][i];

    if (color[childId] === GRAY) {
      stack.push(childId);
      return true;
    }
    if (
      color[childId] === WHITE &&
      isCyclicUtil(childId, color, adjList, stack)
    )
      return true;
  }
  color[nodeId] = BLACK;
  if (stack.length > 0 && stack[stack.length - 1] === nodeId) stack.pop();
  return false;
};

const getCycleEdges = (nodes: Node[], edges: Edge[]) => {
  const adjList: Record<string, string[]> = {};
  const color: Record<string, string> = {};
  const stack: string[] = [];

  for (const node of nodes) {
    color[node.id] = WHITE;
    adjList[node.id] = [];
  }

  for (const edge of edges) adjList[edge.source]?.push(edge.target);

  for (let i = 0; i < nodes.length; i++) {
    if (color[nodes[i].id] === WHITE)
      isCyclicUtil(nodes[i].id, color, adjList, stack);
  }

  const cycleEdges = [];
  if (stack.length > 0) {
    const cycleNodes = new Set(stack);
    for (const edge of edges) {
      if (cycleNodes.has(edge.source) && cycleNodes.has(edge.target))
        cycleEdges.push(edge);
    }
  }

  return cycleEdges;
};

/** @name 初始化节点数据信息 */
export function generateNewNode({
  data,
  position,
  id,
  zIndex,
  type,
  ...rest
}: Omit<Node, 'id'> & { id?: string }): {
  newNode: Node;
  newIterationStartNode?: Node;
  newLoopStartNode?: Node;
} {
  const newNode = {
    id: id || `${Date.now()}`,
    type: type || CUSTOM_NODE,
    data,
    position,
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    // zIndex:
    //   data.type === BlockEnum.Iteration
    //     ? ITERATION_NODE_Z_INDEX
    //     : data.type === BlockEnum.Loop
    //       ? LOOP_NODE_Z_INDEX
    //       : zIndex,
    zIndex,
    ...rest,
  } as Node;

  return {
    newNode,
  };
}

/** @name 初始化节点 */
export const initialNodes = (originNodes: Node[], originEdges: Edge[]) => {
  const { nodes, edges } = preprocessNodesAndEdges(
    cloneDeep(originNodes),
    cloneDeep(originEdges),
  );

  const firstNode = nodes[0];

  if (!firstNode?.position) {
    nodes.forEach((node, index) => {
      node.position = {
        x: START_INITIAL_POSITION.x + index * NODE_WIDTH_X_OFFSET,
        y: START_INITIAL_POSITION.y,
      };
    });
  }

  return nodes.map((node) => {
    if (!node.type) node.type = CUSTOM_NODE;

    const connectedEdges = getConnectedEdges([node], edges);
    node.data._connectedSourceHandleIds = connectedEdges
      .filter((edge) => edge.source === node.id)
      .map((edge) => edge.sourceHandle || 'source');
    node.data._connectedTargetHandleIds = connectedEdges
      .filter((edge) => edge.target === node.id)
      .map((edge) => edge.targetHandle || 'target');

    return node;
  });
};

/** @name 初始化获取到的边信息 */
export const initialEdges = (originEdges: Edge[], originNodes: Node[]) => {
  const { nodes, edges } = preprocessNodesAndEdges(
    cloneDeep(originNodes),
    cloneDeep(originEdges),
  );
  let selectedNode: Node | null = null;
  const nodesMap = nodes.reduce(
    (acc, node) => {
      acc[node.id] = node;

      if (node.data?.selected) selectedNode = node;

      return acc;
    },
    {} as Record<string, Node>,
  );

  const cycleEdges = getCycleEdges(nodes, edges);
  return edges
    .filter((edge) => {
      return !cycleEdges.find(
        (cycEdge: any) =>
          cycEdge.source === edge.source && cycEdge.target === edge.target,
      );
    })
    .map((edge) => {
      edge.type = 'custom';

      if (!edge.sourceHandle) edge.sourceHandle = 'source';

      if (!edge.targetHandle) edge.targetHandle = 'target';

      if (!edge.data?.sourceType && edge.source && nodesMap[edge.source]) {
        edge.data = {
          ...edge.data,
          sourceType: nodesMap[edge.source].data.type!,
        } as any;
      }

      if (!edge.data?.targetType && edge.target && nodesMap[edge.target]) {
        edge.data = {
          ...edge.data,
          targetType: nodesMap[edge.target].data.type!,
        } as any;
      }

      if (selectedNode) {
        edge.data = {
          ...edge.data,
          _connectedNodeIsSelected:
            edge.source === selectedNode.id || edge.target === selectedNode.id,
        } as any;
      }

      return edge;
    });
};

/** @name 根据节点当前状态获取边颜色 */
export const getEdgeColor = (
  nodeRunningStatus?: NodeRunningStatus,
  isFailBranch?: boolean,
) => {
  if (nodeRunningStatus === NodeRunningStatus.Succeeded)
    return 'var(--color-workflow-link-line-success-handle)';

  if (nodeRunningStatus === NodeRunningStatus.Failed)
    return 'var(--color-workflow-link-line-error-handle)';

  if (nodeRunningStatus === NodeRunningStatus.Exception)
    return 'var(--color-workflow-link-line-failure-handle)';

  if (nodeRunningStatus === NodeRunningStatus.Running) {
    if (isFailBranch) return 'var(--color-workflow-link-line-failure-handle)';

    return 'var(--color-workflow-link-line-handle)';
  }

  return 'var(--color-workflow-link-line-normal)';
};

type ConnectedSourceOrTargetNodesChange = {
  type: string;
  edge: Edge;
}[];
export const getNodesConnectedSourceOrTargetHandleIdsMap = (
  changes: ConnectedSourceOrTargetNodesChange,
  nodes: Node[],
) => {
  const nodesConnectedSourceOrTargetHandleIdsMap = {} as Record<string, any>;

  changes.forEach((change) => {
    const { edge, type } = change;
    const sourceNode = nodes.find((node) => node.id === edge.source)!;
    if (sourceNode) {
      nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] =
        nodesConnectedSourceOrTargetHandleIdsMap[sourceNode.id] || {
          _connectedSourceHandleIds: [
            ...(sourceNode?.data._connectedSourceHandleIds || []),
          ],
          _connectedTargetHandleIds: [
            ...(sourceNode?.data._connectedTargetHandleIds || []),
          ],
        };
    }

    const targetNode = nodes.find((node) => node.id === edge.target)!;
    if (targetNode) {
      nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] =
        nodesConnectedSourceOrTargetHandleIdsMap[targetNode.id] || {
          _connectedSourceHandleIds: [
            ...(targetNode?.data._connectedSourceHandleIds || []),
          ],
          _connectedTargetHandleIds: [
            ...(targetNode?.data._connectedTargetHandleIds || []),
          ],
        };
    }

    if (sourceNode) {
      if (type === 'remove') {
        const index = nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.findIndex(
          (handleId: string) => handleId === edge.sourceHandle,
        );
        nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.splice(index, 1);
      }

      if (type === 'add')
        nodesConnectedSourceOrTargetHandleIdsMap[
          sourceNode.id
        ]._connectedSourceHandleIds.push(edge.sourceHandle || 'source');
    }

    if (targetNode) {
      if (type === 'remove') {
        const index = nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.findIndex(
          (handleId: string) => handleId === edge.targetHandle,
        );
        nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.splice(index, 1);
      }

      if (type === 'add')
        nodesConnectedSourceOrTargetHandleIdsMap[
          targetNode.id
        ]._connectedTargetHandleIds.push(edge.targetHandle || 'target');
    }
  });

  return nodesConnectedSourceOrTargetHandleIdsMap;
};

/** @name 获取节点的并行信息 */
export const getParallelInfo = (
  nodes: Node[],
  edges: Edge[],
  parentNodeId?: string,
) => {
  let startNode;

  if (parentNodeId) {
    const parentNode = nodes.find((node) => node.id === parentNodeId);
    if (!parentNode) throw new Error('Parent node not found');

    startNode = nodes.find(
      (node) =>
        node.id ===
        (parentNode.data as IterationNodeType | LoopNodeType).start_node_id,
    );
  } else {
    startNode = nodes.find((node) => node.data.type === BlockEnum.Start);
  }
  if (!startNode) throw new Error('Start node not found');

  const parallelList = [] as ParallelInfoItem[];
  const nextNodeHandles = [{ node: startNode, handle: 'source' }];
  let hasAbnormalEdges = false;

  const traverse = (firstNodeHandle: NodeHandle) => {
    const nodeEdgesSet = {} as Record<string, Set<string>>;
    const totalEdgesSet = new Set<string>();
    const nextHandles = [firstNodeHandle];
    const streamInfo = {} as Record<string, NodeStreamInfo>;
    const parallelListItem = {
      parallelNodeId: '',
      depth: 0,
    } as ParallelInfoItem;
    const nodeParallelInfoMap = {} as Record<string, NodeParallelInfo>;
    nodeParallelInfoMap[firstNodeHandle.node.id] = {
      parallelNodeId: '',
      edgeHandleId: '',
      depth: 0,
    };

    while (nextHandles.length) {
      const currentNodeHandle = nextHandles.shift()!;
      const { node: currentNode, handle: currentHandle = 'source' } =
        currentNodeHandle;
      const currentNodeHandleKey = currentNode.id;
      const connectedEdges = edges.filter(
        (edge) =>
          edge.source === currentNode.id && edge.sourceHandle === currentHandle,
      );
      const connectedEdgesLength = connectedEdges.length;
      const outgoers = nodes.filter((node) =>
        connectedEdges.some((edge) => edge.target === node.id),
      );
      const incomers = getIncomers(currentNode, nodes, edges);

      if (!streamInfo[currentNodeHandleKey]) {
        streamInfo[currentNodeHandleKey] = {
          upstreamNodes: new Set<string>(),
          downstreamEdges: new Set<string>(),
        };
      }

      if (nodeEdgesSet[currentNodeHandleKey]?.size > 0 && incomers.length > 1) {
        const newSet = new Set<string>();
        for (const item of totalEdgesSet) {
          if (!streamInfo[currentNodeHandleKey].downstreamEdges.has(item))
            newSet.add(item);
        }
        if (isEqual(nodeEdgesSet[currentNodeHandleKey], newSet)) {
          parallelListItem.depth = nodeParallelInfoMap[currentNode.id].depth;
          nextNodeHandles.push({ node: currentNode, handle: currentHandle });
          break;
        }
      }

      if (nodeParallelInfoMap[currentNode.id].depth > parallelListItem.depth)
        parallelListItem.depth = nodeParallelInfoMap[currentNode.id].depth;

      outgoers.forEach((outgoer) => {
        const outgoerConnectedEdges = getConnectedEdges(
          [outgoer],
          edges,
        ).filter((edge) => edge.source === outgoer.id);
        const sourceEdgesGroup = groupBy(outgoerConnectedEdges, 'sourceHandle');
        const incomers = getIncomers(outgoer, nodes, edges);

        if (outgoers.length > 1 && incomers.length > 1) hasAbnormalEdges = true;

        Object.keys(sourceEdgesGroup).forEach((sourceHandle) => {
          nextHandles.push({ node: outgoer, handle: sourceHandle });
        });
        if (!outgoerConnectedEdges.length)
          nextHandles.push({ node: outgoer, handle: 'source' });

        const outgoerKey = outgoer.id;
        if (!nodeEdgesSet[outgoerKey])
          nodeEdgesSet[outgoerKey] = new Set<string>();

        if (nodeEdgesSet[currentNodeHandleKey]) {
          for (const item of nodeEdgesSet[currentNodeHandleKey])
            nodeEdgesSet[outgoerKey].add(item);
        }

        if (!streamInfo[outgoerKey]) {
          streamInfo[outgoerKey] = {
            upstreamNodes: new Set<string>(),
            downstreamEdges: new Set<string>(),
          };
        }

        if (!nodeParallelInfoMap[outgoer.id]) {
          nodeParallelInfoMap[outgoer.id] = {
            ...nodeParallelInfoMap[currentNode.id],
          };
        }

        if (connectedEdgesLength > 1) {
          const edge = connectedEdges.find(
            (edge) => edge.target === outgoer.id,
          )!;
          nodeEdgesSet[outgoerKey].add(edge.id);
          totalEdgesSet.add(edge.id);

          streamInfo[currentNodeHandleKey].downstreamEdges.add(edge.id);
          streamInfo[outgoerKey].upstreamNodes.add(currentNodeHandleKey);

          for (const item of streamInfo[currentNodeHandleKey].upstreamNodes)
            streamInfo[item].downstreamEdges.add(edge.id);

          if (!parallelListItem.parallelNodeId)
            parallelListItem.parallelNodeId = currentNode.id;

          const prevDepth = nodeParallelInfoMap[currentNode.id].depth + 1;
          const currentDepth = nodeParallelInfoMap[outgoer.id].depth;

          nodeParallelInfoMap[outgoer.id].depth = Math.max(
            prevDepth,
            currentDepth,
          );
        } else {
          for (const item of streamInfo[currentNodeHandleKey].upstreamNodes)
            streamInfo[outgoerKey].upstreamNodes.add(item);

          nodeParallelInfoMap[outgoer.id].depth =
            nodeParallelInfoMap[currentNode.id].depth;
        }
      });
    }

    parallelList.push(parallelListItem);
  };

  while (nextNodeHandles.length) {
    const nodeHandle = nextNodeHandles.shift()!;
    traverse(nodeHandle);
  }

  return {
    parallelList,
    hasAbnormalEdges,
  };
};

export const canRunBySingle = (nodeType: BlockEnum) => {
  return false;
};

/** @description 取节点数组中左上角节点的位置 */
export const getTopLeftNodePosition = (nodes: Node[]) => {
  let minX = Infinity;
  let minY = Infinity;

  nodes.forEach((node) => {
    if (node.position.x < minX) minX = node.position.x;

    if (node.position.y < minY) minY = node.position.y;
  });

  return {
    x: minX,
    y: minY,
  };
};

/** @name 根据旧的节点标题生成新的节点标题 */
export const genNewNodeTitleFromOld = (oldTitle: string) => {
  const regex = /^(.+?)\s*\((\d+)\)\s*$/;
  const match = oldTitle.match(regex);

  if (match) {
    const title = match[1];
    const num = Number.parseInt(match[2], 10);
    return `${title} (${num + 1})`;
  } else {
    return `${oldTitle} (1)`;
  }
};

export const getLayoutByDagre = (originNodes: Node[], originEdges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  const nodes = cloneDeep(originNodes).filter(
    (node) => !node.parentId && node.type === CUSTOM_NODE,
  );
  const edges = cloneDeep(originEdges).filter(
    (edge) => !edge.data?.isInIteration && !edge.data?.isInLoop,
  );
  dagreGraph.setGraph({
    rankdir: 'LR',
    align: 'UL',
    nodesep: 40,
    ranksep: 60,
    ranker: 'tight-tree',
    marginx: 30,
    marginy: 200,
  });
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: node.width!,
      height: node.height!,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return dagreGraph;
};
