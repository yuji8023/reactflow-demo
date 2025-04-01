import type { MouseEvent } from 'react';
import { useCallback, useRef } from 'react';
import produce from 'immer';
import type {
  NodeDragHandler,
  NodeMouseHandler,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  ResizeParamsWithDirection,
} from 'reactflow';
import {
  getConnectedEdges,
  getOutgoers,
  useReactFlow,
  useStoreApi,
} from 'reactflow';
import { unionBy } from 'lodash-es';
// import type { ToolDefaultValue } from '../block-selector/types';
import type { Edge, Node, OnNodeAdd } from '../types';
import { BlockEnum } from '../types';
import { useWorkflowStore } from '../store';
import {
  CUSTOM_EDGE,
  ITERATION_CHILDREN_Z_INDEX,
  ITERATION_PADDING,
  LOOP_CHILDREN_Z_INDEX,
  LOOP_PADDING,
  NODES_INITIAL_DATA,
  NODE_WIDTH_X_OFFSET,
  X_OFFSET,
  Y_OFFSET,
} from '../constants';
import {
  // genNewNodeTitleFromOld,
  generateNewNode,
  getNodesConnectedSourceOrTargetHandleIdsMap,
  // getTopLeftNodePosition,
} from '../utils';
import { CUSTOM_NOTE_NODE } from '../note-node/constants';
import {
  CUSTOM_ITERATION_START_NODE,
  CUSTOM_LOOP_START_NODE,
} from '../nodes/constants';
// import type { IterationNodeType } from '../nodes/iteration/types';
// import type { LoopNodeType } from '../nodes/loop/types';
// import type { VariableAssignerNodeType } from '../nodes/variable-assigner/types';
// import { useNodeIterationInteractions } from '../nodes/iteration/use-interactions';
// import { useNodeLoopInteractions } from '../nodes/loop/use-interactions';
// import { useWorkflowHistoryStore } from '../workflow-history-store';
import { useNodesSyncDraft } from './use-nodes-sync-draft';
import { useHelpline } from './use-helpline';
import {
  useNodesReadOnly,
  useWorkflow,
  // useWorkflowReadOnly,
} from './use-workflow';
import {
  WorkflowHistoryEvent,
  useWorkflowHistory,
} from './use-workflow-history';

export const useNodesInteractions = () => {
  const store = useStoreApi();
  const workflowStore = useWorkflowStore();
  // const reactflow = useReactFlow();
  // const { store: workflowHistoryStore } = useWorkflowHistoryStore();
  const { handleSyncWorkflowDraft } = useNodesSyncDraft();
  const { checkNestedParallelLimit, getAfterNodesInSameBranch } = useWorkflow();
  const { getNodesReadOnly } = useNodesReadOnly();
  // const { getWorkflowReadOnly } = useWorkflowReadOnly();
  const { handleSetHelpline } = useHelpline();
  // const { handleNodeIterationChildDrag, handleNodeIterationChildrenCopy } = useNodeIterationInteractions();
  // const { handleNodeLoopChildDrag, handleNodeLoopChildrenCopy } = useNodeLoopInteractions();
  const dragNodeStartPosition = useRef({ x: 0, y: 0 } as {
    x: number;
    y: number;
  });

  const { saveStateToHistory, undo, redo } = useWorkflowHistory();

  const handleNodeDragStart = useCallback<NodeDragHandler>(
    (_, node) => {
      workflowStore.setState({ nodeAnimation: false });

      if (getNodesReadOnly()) return;

      if (
        node.type === CUSTOM_ITERATION_START_NODE ||
        node.type === CUSTOM_NOTE_NODE
      )
        return;

      if (
        node.type === CUSTOM_LOOP_START_NODE ||
        node.type === CUSTOM_NOTE_NODE
      )
        return;

      dragNodeStartPosition.current = {
        x: node.position.x,
        y: node.position.y,
      };
    },
    [workflowStore, getNodesReadOnly],
  );

  const handleNodeDrag = useCallback<NodeDragHandler>(
    (e, node: Node) => {
      if (getNodesReadOnly()) return;

      if (node.type === CUSTOM_ITERATION_START_NODE) return;

      if (node.type === CUSTOM_LOOP_START_NODE) return;

      const { getNodes, setNodes } = store.getState();
      e.stopPropagation();

      const nodes = getNodes();

      // const { restrictPosition } = handleNodeIterationChildDrag(node);
      // const { restrictPosition: restrictLoopPosition } =  handleNodeLoopChildDrag(node);

      const { showHorizontalHelpLineNodes, showVerticalHelpLineNodes } =
        handleSetHelpline(node);
      const showHorizontalHelpLineNodesLength =
        showHorizontalHelpLineNodes.length;
      const showVerticalHelpLineNodesLength = showVerticalHelpLineNodes.length;

      const newNodes = produce(nodes, (draft) => {
        const currentNode = draft.find((n) => n.id === node.id)!;

        if (showVerticalHelpLineNodesLength > 0)
          currentNode.position.x = showVerticalHelpLineNodes[0].position.x;
        // else if (restrictPosition.x !== undefined)
        //   currentNode.position.x = restrictPosition.x;
        // else if (restrictLoopPosition.x !== undefined)
        //   currentNode.position.x = restrictLoopPosition.x;
        else currentNode.position.x = node.position.x;

        if (showHorizontalHelpLineNodesLength > 0)
          currentNode.position.y = showHorizontalHelpLineNodes[0].position.y;
        // else if (restrictPosition.y !== undefined)
        //   currentNode.position.y = restrictPosition.y;
        // else if (restrictLoopPosition.y !== undefined)
        //   currentNode.position.y = restrictLoopPosition.y;
        else currentNode.position.y = node.position.y;
      });
      setNodes(newNodes);
    },
    [
      getNodesReadOnly,
      store,
      // handleNodeIterationChildDrag,
      // handleNodeLoopChildDrag,
      handleSetHelpline,
    ],
  );

  const handleNodeDragStop = useCallback<NodeDragHandler>(
    (_, node) => {
      const { setHelpLineHorizontal, setHelpLineVertical } =
        workflowStore.getState();

      if (getNodesReadOnly()) return;

      const { x, y } = dragNodeStartPosition.current;
      if (!(x === node.position.x && y === node.position.y)) {
        setHelpLineHorizontal();
        setHelpLineVertical();
        handleSyncWorkflowDraft();

        if (x !== 0 && y !== 0) {
          // selecting a note will trigger a drag stop event with x and y as 0
          saveStateToHistory(WorkflowHistoryEvent.NodeDragStop);
        }
      }
    },
    [
      workflowStore,
      getNodesReadOnly,
      saveStateToHistory,
      handleSyncWorkflowDraft,
    ],
  );

  const handleNodeEnter = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (getNodesReadOnly()) return;

      if (
        node.type === CUSTOM_NOTE_NODE ||
        node.type === CUSTOM_ITERATION_START_NODE
      )
        return;

      if (
        node.type === CUSTOM_LOOP_START_NODE ||
        node.type === CUSTOM_NOTE_NODE
      )
        return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      // const { connectingNodePayload, setEnteringNodePayload } =
      //   workflowStore.getState();

      // if (connectingNodePayload) {
      //   if (connectingNodePayload.nodeId === node.id) return;
      //   const connectingNode: Node = nodes.find(
      //     (n) => n.id === connectingNodePayload.nodeId,
      //   )!;
      //   const sameLevel = connectingNode.parentId === node.parentId;

      //   if (sameLevel) {
      //     setEnteringNodePayload({
      //       nodeId: node.id,
      //       nodeData: node.data as VariableAssignerNodeType,
      //     });
      //     const fromType = connectingNodePayload.handleType;

      //     const newNodes = produce(nodes, (draft) => {
      //       draft.forEach((n) => {
      //         if (
      //           n.id === node.id &&
      //           fromType === 'source' &&
      //           (node.data.type === BlockEnum.VariableAssigner ||
      //             node.data.type === BlockEnum.VariableAggregator)
      //         ) {
      //           if (!node.data.advanced_settings?.group_enabled)
      //             n.data._isEntering = true;
      //         }
      //         if (
      //           n.id === node.id &&
      //           fromType === 'target' &&
      //           (connectingNode.data.type === BlockEnum.VariableAssigner ||
      //             connectingNode.data.type === BlockEnum.VariableAggregator) &&
      //           node.data.type !== BlockEnum.IfElse &&
      //           node.data.type !== BlockEnum.QuestionClassifier
      //         )
      //           n.data._isEntering = true;
      //       });
      //     });
      //     setNodes(newNodes);
      //   }
      // }
      const newEdges = produce(edges, (draft) => {
        const connectedEdges = getConnectedEdges([node], edges);

        connectedEdges.forEach((edge) => {
          const currentEdge = draft.find((e) => e.id === edge.id);
          if (currentEdge) currentEdge.data._connectedNodeIsHovering = true;
        });
      });
      setEdges(newEdges);
      const connectedEdges = getConnectedEdges([node], edges).filter(
        (edge) => edge.target === node.id,
      );

      const targetNodes: Node[] = [];
      for (let i = 0; i < connectedEdges.length; i++) {
        const sourceConnectedEdges = getConnectedEdges(
          [{ id: connectedEdges[i].source } as Node],
          edges,
        ).filter(
          (edge) =>
            edge.source === connectedEdges[i].source &&
            edge.sourceHandle === connectedEdges[i].sourceHandle,
        );
        targetNodes.push(
          ...sourceConnectedEdges.map(
            (edge) => nodes.find((n) => n.id === edge.target)!,
          ),
        );
      }
      const uniqTargetNodes = unionBy(targetNodes, 'id');
      if (uniqTargetNodes.length > 1) {
        const newNodes = produce(nodes, (draft) => {
          draft.forEach((n) => {
            if (uniqTargetNodes.some((targetNode) => n.id === targetNode.id))
              n.data._inParallelHovering = true;
          });
        });
        setNodes(newNodes);
      }
    },
    [store, workflowStore, getNodesReadOnly],
  );

  const handleNodeLeave = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (getNodesReadOnly()) return;

      if (
        node.type === CUSTOM_NOTE_NODE ||
        node.type === CUSTOM_ITERATION_START_NODE
      )
        return;

      if (
        node.type === CUSTOM_NOTE_NODE ||
        node.type === CUSTOM_LOOP_START_NODE
      )
        return;

      // const { setEnteringNodePayload } = workflowStore.getState();
      // setEnteringNodePayload(undefined);
      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const newNodes = produce(getNodes(), (draft) => {
        draft.forEach((node) => {
          node.data._isEntering = false;
          node.data._inParallelHovering = false;
        });
      });
      setNodes(newNodes);
      const newEdges = produce(edges, (draft) => {
        draft.forEach((edge) => {
          edge.data._connectedNodeIsHovering = false;
        });
      });
      setEdges(newEdges);
    },
    [store, workflowStore, getNodesReadOnly],
  );

  const handleNodeSelect = useCallback(
    (nodeId: string, cancelSelection?: boolean) => {
      const { getNodes, setNodes, edges, setEdges } = store.getState();

      const nodes = getNodes();
      const selectedNode = nodes.find((node) => node.data.selected);

      if (!cancelSelection && selectedNode?.id === nodeId) return;

      const newNodes = produce(nodes, (draft) => {
        draft.forEach((node) => {
          if (node.id === nodeId) node.data.selected = !cancelSelection;
          else node.data.selected = false;
        });
      });
      setNodes(newNodes);

      const connectedEdges = getConnectedEdges(
        [{ id: nodeId } as Node],
        edges,
      ).map((edge) => edge.id);
      const newEdges = produce(edges, (draft) => {
        draft.forEach((edge) => {
          if (connectedEdges.includes(edge.id)) {
            edge.data = {
              ...edge.data,
              _connectedNodeIsSelected: !cancelSelection,
            };
          } else {
            edge.data = {
              ...edge.data,
              _connectedNodeIsSelected: false,
            };
          }
        });
      });
      setEdges(newEdges);

      handleSyncWorkflowDraft();
    },
    [store, handleSyncWorkflowDraft],
  );

  const handleNodeClick = useCallback<NodeMouseHandler>(
    (_, node) => {
      if (node.type === CUSTOM_ITERATION_START_NODE) return;
      if (node.type === CUSTOM_LOOP_START_NODE) return;
      handleNodeSelect(node.id);
    },
    [handleNodeSelect],
  );

  /* const handleNodeConnect = useCallback<OnConnect>(
    ({ source, sourceHandle, target, targetHandle }) => {
      if (source === target) return;
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const targetNode = nodes.find((node) => node.id === target!);
      const sourceNode = nodes.find((node) => node.id === source!);

      if (targetNode?.parentId !== sourceNode?.parentId) return;

      if (
        sourceNode?.type === CUSTOM_NOTE_NODE ||
        targetNode?.type === CUSTOM_NOTE_NODE
      )
        return;

      if (
        edges.find(
          (edge) =>
            edge.source === source &&
            edge.sourceHandle === sourceHandle &&
            edge.target === target &&
            edge.targetHandle === targetHandle,
        )
      )
        return;

      const parendNode = nodes.find((node) => node.id === targetNode?.parentId);
      const isInIteration =
        parendNode && parendNode.data.type === BlockEnum.Iteration;
      const isInLoop = !!parendNode && parendNode.data.type === BlockEnum.Loop;

      const newEdge = {
        id: `${source}-${sourceHandle}-${target}-${targetHandle}`,
        type: CUSTOM_EDGE,
        source: source!,
        target: target!,
        sourceHandle,
        targetHandle,
        data: {
          sourceType: nodes.find((node) => node.id === source)!.data.type,
          targetType: nodes.find((node) => node.id === target)!.data.type,
          isInIteration,
          iteration_id: isInIteration ? targetNode?.parentId : undefined,
          isInLoop,
          loop_id: isInLoop ? targetNode?.parentId : undefined,
        },
        zIndex: targetNode?.parentId
          ? isInIteration
            ? ITERATION_CHILDREN_Z_INDEX
            : LOOP_CHILDREN_Z_INDEX
          : 0,
      };
      const nodesConnectedSourceOrTargetHandleIdsMap =
        getNodesConnectedSourceOrTargetHandleIdsMap(
          [{ type: 'add', edge: newEdge }],
          nodes,
        );
      const newNodes = produce(nodes, (draft: Node[]) => {
        draft.forEach((node) => {
          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            };
          }
        });
      });
      const newEdges = produce(edges, (draft) => {
        draft.push(newEdge);
      });

      if (checkNestedParallelLimit(newNodes, newEdges, targetNode?.parentId)) {
        setNodes(newNodes);
        setEdges(newEdges);

        handleSyncWorkflowDraft();
        saveStateToHistory(WorkflowHistoryEvent.NodeConnect);
      } else {
        const { setConnectingNodePayload, setEnteringNodePayload } =
          workflowStore.getState();
        setConnectingNodePayload(undefined);
        setEnteringNodePayload(undefined);
      }
    },
    [
      getNodesReadOnly,
      store,
      workflowStore,
      handleSyncWorkflowDraft,
      saveStateToHistory,
      checkNestedParallelLimit,
    ],
  ); */

  /* const handleNodeConnectStart = useCallback<OnConnectStart>(
    (_, { nodeId, handleType, handleId }) => {
      if (getNodesReadOnly()) return;

      if (nodeId && handleType) {
        const { setConnectingNodePayload } = workflowStore.getState();
        const { getNodes } = store.getState();
        const node = getNodes().find((n) => n.id === nodeId)!;

        if (node.type === CUSTOM_NOTE_NODE) return;

        if (
          node.data.type === BlockEnum.VariableAggregator ||
          node.data.type === BlockEnum.VariableAssigner
        ) {
          if (handleType === 'target') return;
        }

        setConnectingNodePayload({
          nodeId,
          nodeType: node.data.type,
          handleType,
          handleId,
        });
      }
    },
    [store, workflowStore, getNodesReadOnly],
  ); */

  /* const handleNodeConnectEnd = useCallback<OnConnectEnd>(
    (e: any) => {
      if (getNodesReadOnly()) return;

      const {
        connectingNodePayload,
        setConnectingNodePayload,
        enteringNodePayload,
        setEnteringNodePayload,
      } = workflowStore.getState();
      if (connectingNodePayload && enteringNodePayload) {
        const { setShowAssignVariablePopup, hoveringAssignVariableGroupId } =
          workflowStore.getState();
        const { screenToFlowPosition } = reactflow;
        const { getNodes, setNodes } = store.getState();
        const nodes = getNodes();
        const fromHandleType = connectingNodePayload.handleType;
        const fromHandleId = connectingNodePayload.handleId;
        const fromNode = nodes.find(
          (n) => n.id === connectingNodePayload.nodeId,
        )!;
        const toNode = nodes.find((n) => n.id === enteringNodePayload.nodeId)!;
        const toParentNode = nodes.find((n) => n.id === toNode.parentId);

        if (fromNode.parentId !== toNode.parentId) return;

        const { x, y } = screenToFlowPosition({ x: e.x, y: e.y });

        if (
          fromHandleType === 'source' &&
          (toNode.data.type === BlockEnum.VariableAssigner ||
            toNode.data.type === BlockEnum.VariableAggregator)
        ) {
          const groupEnabled = toNode.data.advanced_settings?.group_enabled;
          const firstGroupId = toNode.data.advanced_settings?.groups[0].groupId;
          let handleId = 'target';

          if (groupEnabled) {
            if (hoveringAssignVariableGroupId)
              handleId = hoveringAssignVariableGroupId;
            else handleId = firstGroupId;
          }
          const newNodes = produce(nodes, (draft) => {
            draft.forEach((node) => {
              if (node.id === toNode.id) {
                node.data._showAddVariablePopup = true;
                node.data._holdAddVariablePopup = true;
              }
            });
          });
          setNodes(newNodes);
          setShowAssignVariablePopup({
            nodeId: fromNode.id,
            nodeData: fromNode.data,
            variableAssignerNodeId: toNode.id,
            variableAssignerNodeData: toNode.data,
            variableAssignerNodeHandleId: handleId,
            parentNode: toParentNode,
            x: x - toNode.positionAbsolute!.x,
            y: y - toNode.positionAbsolute!.y,
          });
          handleNodeConnect({
            source: fromNode.id,
            sourceHandle: fromHandleId,
            target: toNode.id,
            targetHandle: 'target',
          });
        }
      }
      setConnectingNodePayload(undefined);
      setEnteringNodePayload(undefined);
    },
    [store, handleNodeConnect, getNodesReadOnly, workflowStore, reactflow],
  ); */

  /* const handleNodeDelete = useCallback(
    (nodeId: string) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();

      const nodes = getNodes();
      const currentNodeIndex = nodes.findIndex((node) => node.id === nodeId);
      const currentNode = nodes[currentNodeIndex];

      if (!currentNode) return;

      if (currentNode.data.type === BlockEnum.Start) return;

      if (currentNode.data.type === BlockEnum.Iteration) {
        const iterationChildren = nodes.filter(
          (node) => node.parentId === currentNode.id,
        );

        if (iterationChildren.length) {
          if (currentNode.data._isBundled) {
            iterationChildren.forEach((child) => {
              handleNodeDelete(child.id);
            });
            return handleNodeDelete(nodeId);
          } else {
            if (iterationChildren.length === 1) {
              handleNodeDelete(iterationChildren[0].id);
              handleNodeDelete(nodeId);

              return;
            }
            const { setShowConfirm, showConfirm } = workflowStore.getState();

            if (!showConfirm) {
              setShowConfirm({
                title: t('workflow.nodes.iteration.deleteTitle'),
                desc: t('workflow.nodes.iteration.deleteDesc') || '',
                onConfirm: () => {
                  iterationChildren.forEach((child) => {
                    handleNodeDelete(child.id);
                  });
                  handleNodeDelete(nodeId);
                  handleSyncWorkflowDraft();
                  setShowConfirm(undefined);
                },
              });
              return;
            }
          }
        }
      }

      if (currentNode.data.type === BlockEnum.Loop) {
        const loopChildren = nodes.filter(
          (node) => node.parentId === currentNode.id,
        );

        if (loopChildren.length) {
          if (currentNode.data._isBundled) {
            loopChildren.forEach((child) => {
              handleNodeDelete(child.id);
            });
            return handleNodeDelete(nodeId);
          } else {
            if (loopChildren.length === 1) {
              handleNodeDelete(loopChildren[0].id);
              handleNodeDelete(nodeId);

              return;
            }
            const { setShowConfirm, showConfirm } = workflowStore.getState();

            if (!showConfirm) {
              setShowConfirm({
                title: t('workflow.nodes.loop.deleteTitle'),
                desc: t('workflow.nodes.loop.deleteDesc') || '',
                onConfirm: () => {
                  loopChildren.forEach((child) => {
                    handleNodeDelete(child.id);
                  });
                  handleNodeDelete(nodeId);
                  handleSyncWorkflowDraft();
                  setShowConfirm(undefined);
                },
              });
              return;
            }
          }
        }
      }

      const connectedEdges = getConnectedEdges([{ id: nodeId } as Node], edges);
      const nodesConnectedSourceOrTargetHandleIdsMap =
        getNodesConnectedSourceOrTargetHandleIdsMap(
          connectedEdges.map((edge) => ({ type: 'remove', edge })),
          nodes,
        );
      const newNodes = produce(nodes, (draft: Node[]) => {
        draft.forEach((node) => {
          if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
            node.data = {
              ...node.data,
              ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
            };
          }

          if (node.id === currentNode.parentId)
            node.data._children = node.data._children?.filter(
              (child) => child !== nodeId,
            );
        });
        draft.splice(currentNodeIndex, 1);
      });
      setNodes(newNodes);
      const newEdges = produce(edges, (draft) => {
        return draft.filter(
          (edge) =>
            !connectedEdges.find(
              (connectedEdge) => connectedEdge.id === edge.id,
            ),
        );
      });
      setEdges(newEdges);
      handleSyncWorkflowDraft();

      if (currentNode.type === CUSTOM_NOTE_NODE)
        saveStateToHistory(WorkflowHistoryEvent.NoteDelete);
      else saveStateToHistory(WorkflowHistoryEvent.NodeDelete);
    },
    [
      getNodesReadOnly,
      store,
      handleSyncWorkflowDraft,
      saveStateToHistory,
      workflowStore,
    ],
  ); */

  const handleNodeAdd = useCallback<OnNodeAdd>(
    (
      {
        nodeType,
        sourceHandle = 'source',
        targetHandle = 'target',
        toolDefaultValue,
      },
      { prevNodeId, prevNodeSourceHandle, nextNodeId, nextNodeTargetHandle },
    ) => {
      if (getNodesReadOnly()) return;

      const { getNodes, setNodes, edges, setEdges } = store.getState();
      const nodes = getNodes();
      const nodesWithSameType = nodes.filter(
        (node) => node.data.type === nodeType,
      );
      const { newNode, newIterationStartNode, newLoopStartNode } =
        generateNewNode({
          data: {
            ...NODES_INITIAL_DATA[nodeType],
            ...(toolDefaultValue || {}),
            selected: true,
            _showAddVariablePopup: false,
            _holdAddVariablePopup: false,
          },
          position: {
            x: 0,
            y: 0,
          },
        });
      if (prevNodeId && !nextNodeId) {
        const prevNodeIndex = nodes.findIndex((node) => node.id === prevNodeId);
        const prevNode = nodes[prevNodeIndex];
        const outgoers = getOutgoers(prevNode, nodes, edges).sort(
          (a, b) => a.position.y - b.position.y,
        );
        const lastOutgoer = outgoers[outgoers.length - 1];

        newNode.data._connectedTargetHandleIds = [targetHandle];
        newNode.data._connectedSourceHandleIds = [];
        newNode.position = {
          x: lastOutgoer
            ? lastOutgoer.position.x
            : prevNode.position.x + prevNode.width! + X_OFFSET,
          y: lastOutgoer
            ? lastOutgoer.position.y + lastOutgoer.height! + Y_OFFSET
            : prevNode.position.y,
        };
        newNode.parentId = prevNode.parentId;
        newNode.extent = prevNode.extent;

        const parentNode =
          nodes.find((node) => node.id === prevNode.parentId) || null;
        const isInIteration = false;

        // (!!parentNode && parentNode.data.type === BlockEnum.Iteration;)

        const isInLoop = false;
        //  ( !!parentNode && parentNode.data.type === BlockEnum.Loop;)

        /* if (prevNode.parentId) {
          newNode.data.isInIteration = isInIteration;
          newNode.data.isInLoop = isInLoop;
          if (isInIteration) {
            newNode.data.iteration_id = parentNode.id;
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
          }
          if (isInLoop) {
            newNode.data.loop_id = parentNode.id;
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX;
          }
          if (
            isInIteration &&
            (newNode.data.type === BlockEnum.Answer ||
              newNode.data.type === BlockEnum.Tool ||
              newNode.data.type === BlockEnum.Assigner)
          ) {
            const iterNodeData: IterationNodeType = parentNode.data;
            iterNodeData._isShowTips = true;
          }
          if (
            isInLoop &&
            (newNode.data.type === BlockEnum.Answer ||
              newNode.data.type === BlockEnum.Tool ||
              newNode.data.type === BlockEnum.Assigner)
          ) {
            const iterNodeData: IterationNodeType = parentNode.data;
            iterNodeData._isShowTips = true;
          }
        } */

        const newEdge: Edge = {
          id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
          type: CUSTOM_EDGE,
          source: prevNodeId,
          sourceHandle: prevNodeSourceHandle,
          target: newNode.id,
          targetHandle,
          data: {
            sourceType: prevNode.data.type,
            targetType: newNode.data.type,
            isInIteration,
            isInLoop,
            iteration_id: isInIteration ? prevNode.parentId : undefined,
            loop_id: isInLoop ? prevNode.parentId : undefined,
            _connectedNodeIsSelected: true,
          },
          zIndex: prevNode.parentId
            ? isInIteration
              ? ITERATION_CHILDREN_Z_INDEX
              : LOOP_CHILDREN_Z_INDEX
            : 0,
        };
        const nodesConnectedSourceOrTargetHandleIdsMap =
          getNodesConnectedSourceOrTargetHandleIdsMap(
            [{ type: 'add', edge: newEdge }],
            nodes,
          );
        const newNodes = produce(nodes, (draft: Node[]) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }

            /*   if (
              node.data.type === BlockEnum.Iteration &&
              prevNode.parentId === node.id
            )
              node.data._children?.push(newNode.id);

            if (
              node.data.type === BlockEnum.Loop &&
              prevNode.parentId === node.id
            )
              node.data._children?.push(newNode.id); */
          });
          draft.push(newNode);

          if (newIterationStartNode) draft.push(newIterationStartNode);

          if (newLoopStartNode) draft.push(newLoopStartNode);
        });

        /* if (
          newNode.data.type === BlockEnum.VariableAssigner ||
          newNode.data.type === BlockEnum.VariableAggregator
        ) {
          const { setShowAssignVariablePopup } = workflowStore.getState();

          setShowAssignVariablePopup({
            nodeId: prevNode.id,
            nodeData: prevNode.data,
            variableAssignerNodeId: newNode.id,
            variableAssignerNodeData: newNode.data as VariableAssignerNodeType,
            variableAssignerNodeHandleId: targetHandle,
            parentNode: nodes.find((node) => node.id === newNode.parentId),
            x: -25,
            y: 44,
          });
        } */
        const newEdges = produce(edges, (draft) => {
          draft.forEach((item) => {
            item.data = {
              ...item.data,
              _connectedNodeIsSelected: false,
            };
          });
          draft.push(newEdge);
        });

        if (checkNestedParallelLimit(newNodes, newEdges, prevNode.parentId)) {
          setNodes(newNodes);
          setEdges(newEdges);
        } else {
          return false;
        }
      }
      if (!prevNodeId && nextNodeId) {
        const nextNodeIndex = nodes.findIndex((node) => node.id === nextNodeId);
        const nextNode = nodes[nextNodeIndex]!;
        /* if (
          nodeType !== BlockEnum.IfElse &&
          nodeType !== BlockEnum.QuestionClassifier
        ) {
          newNode.data._connectedSourceHandleIds = [sourceHandle];
        } */

        newNode.data._connectedSourceHandleIds = [sourceHandle];
        newNode.data._connectedTargetHandleIds = [];
        newNode.position = {
          x: nextNode.position.x,
          y: nextNode.position.y,
        };
        newNode.parentId = nextNode.parentId;
        newNode.extent = nextNode.extent;

        const parentNode =
          nodes.find((node) => node.id === nextNode.parentId) || null;
        const isInIteration = false;
        // (!!parentNode && parentNode.data.type === BlockEnum.Iteration;)
        const isInLoop = false;
        // (!!parentNode && parentNode.data.type === BlockEnum.Loop;)

        if (parentNode && nextNode.parentId) {
          newNode.data.isInIteration = isInIteration;
          newNode.data.isInLoop = isInLoop;
          if (isInIteration) {
            newNode.data.iteration_id = parentNode.id;
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
          }
          if (isInLoop) {
            newNode.data.loop_id = parentNode.id;
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX;
          }
        }

        let newEdge;

        /* if (
          nodeType !== BlockEnum.IfElse &&
          nodeType !== BlockEnum.QuestionClassifier
        ) */
        if (true) {
          newEdge = {
            id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
            type: CUSTOM_EDGE,
            source: newNode.id,
            sourceHandle,
            target: nextNodeId,
            targetHandle: nextNodeTargetHandle,
            data: {
              sourceType: newNode.data.type,
              targetType: nextNode.data.type,
              isInIteration,
              isInLoop,
              iteration_id: isInIteration ? nextNode.parentId : undefined,
              loop_id: isInLoop ? nextNode.parentId : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: nextNode.parentId
              ? isInIteration
                ? ITERATION_CHILDREN_Z_INDEX
                : LOOP_CHILDREN_Z_INDEX
              : 0,
          };
        }

        let nodesConnectedSourceOrTargetHandleIdsMap: Record<string, any>;
        if (newEdge) {
          nodesConnectedSourceOrTargetHandleIdsMap =
            getNodesConnectedSourceOrTargetHandleIdsMap(
              [{ type: 'add', edge: newEdge }],
              nodes,
            );
        }

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!);
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          (node: any) => node.id,
        );
        const newNodes = produce(nodes, (draft) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (afterNodesInSameBranchIds.includes(node.id))
              node.position.x += NODE_WIDTH_X_OFFSET;

            if (nodesConnectedSourceOrTargetHandleIdsMap?.[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }

            /* if (
              node.data.type === BlockEnum.Iteration &&
              nextNode.parentId === node.id
            )
              node.data._children?.push(newNode.id);

            if (
              node.data.type === BlockEnum.Iteration &&
              node.data.start_node_id === nextNodeId
            ) {
              node.data.start_node_id = newNode.id;
              node.data.startNodeType = newNode.data.type;
            } */

            /* if (
              node.data.type === BlockEnum.Loop &&
              nextNode.parentId === node.id
            )
              node.data._children?.push(newNode.id);

            if (
              node.data.type === BlockEnum.Loop &&
              node.data.start_node_id === nextNodeId
            ) {
              node.data.start_node_id = newNode.id;
              node.data.startNodeType = newNode.data.type;
            } */
          });
          draft.push(newNode);
          if (newIterationStartNode) draft.push(newIterationStartNode);
          if (newLoopStartNode) draft.push(newLoopStartNode);
        });
        if (newEdge) {
          const newEdges = produce(edges, (draft) => {
            draft.forEach((item) => {
              item.data = {
                ...item.data,
                _connectedNodeIsSelected: false,
              };
            });
            draft.push(newEdge);
          });

          if (checkNestedParallelLimit(newNodes, newEdges, nextNode.parentId)) {
            setNodes(newNodes);
            setEdges(newEdges);
          } else {
            return false;
          }
        } else {
          if (checkNestedParallelLimit(newNodes, edges)) setNodes(newNodes);
          else return false;
        }
      }
      if (prevNodeId && nextNodeId) {
        const prevNode = nodes.find((node) => node.id === prevNodeId)!;
        const nextNode = nodes.find((node) => node.id === nextNodeId)!;

        newNode.data._connectedTargetHandleIds = [targetHandle];
        newNode.data._connectedSourceHandleIds = [sourceHandle];
        newNode.position = {
          x: nextNode.position.x,
          y: nextNode.position.y,
        };
        newNode.parentId = prevNode.parentId;
        newNode.extent = prevNode.extent;

        const parentNode =
          nodes.find((node) => node.id === prevNode.parentId) || null;
        const isInIteration = false;
        // (!!parentNode && parentNode.data.type === BlockEnum.Iteration;)
        const isInLoop = false;
        // (!!parentNode && parentNode.data.type === BlockEnum.Loop;)

        if (parentNode && prevNode.parentId) {
          newNode.data.isInIteration = isInIteration;
          newNode.data.isInLoop = isInLoop;
          if (isInIteration) {
            newNode.data.iteration_id = parentNode.id;
            newNode.zIndex = ITERATION_CHILDREN_Z_INDEX;
          }
          if (isInLoop) {
            newNode.data.loop_id = parentNode.id;
            newNode.zIndex = LOOP_CHILDREN_Z_INDEX;
          }
        }

        const currentEdgeIndex = edges.findIndex(
          (edge) => edge.source === prevNodeId && edge.target === nextNodeId,
        );
        const newPrevEdge = {
          id: `${prevNodeId}-${prevNodeSourceHandle}-${newNode.id}-${targetHandle}`,
          type: CUSTOM_EDGE,
          source: prevNodeId,
          sourceHandle: prevNodeSourceHandle,
          target: newNode.id,
          targetHandle,
          data: {
            sourceType: prevNode.data.type,
            targetType: newNode.data.type,
            isInIteration,
            isInLoop,
            iteration_id: isInIteration ? prevNode.parentId : undefined,
            loop_id: isInLoop ? prevNode.parentId : undefined,
            _connectedNodeIsSelected: true,
          },
          zIndex: prevNode.parentId
            ? isInIteration
              ? ITERATION_CHILDREN_Z_INDEX
              : LOOP_CHILDREN_Z_INDEX
            : 0,
        };
        let newNextEdge: Edge | null = null;

        const nextNodeParentNode =
          nodes.find((node) => node.id === nextNode.parentId) || null;
        const isNextNodeInIteration = false;
        // (!!nextNodeParentNode &&
        // nextNodeParentNode.data.type === BlockEnum.Iteration;)
        const isNextNodeInLoop = false;
        //  ( !!nextNodeParentNode &&
        //   nextNodeParentNode.data.type === BlockEnum.Loop;)

        /*  if (
          nodeType !== BlockEnum.IfElse &&
          nodeType !== BlockEnum.QuestionClassifier
        )  */
        if (true) {
          newNextEdge = {
            id: `${newNode.id}-${sourceHandle}-${nextNodeId}-${nextNodeTargetHandle}`,
            type: CUSTOM_EDGE,
            source: newNode.id,
            sourceHandle,
            target: nextNodeId,
            targetHandle: nextNodeTargetHandle,
            data: {
              sourceType: newNode.data.type,
              targetType: nextNode.data.type,
              isInIteration: isNextNodeInIteration,
              isInLoop: isNextNodeInLoop,
              iteration_id: isNextNodeInIteration
                ? nextNode.parentId
                : undefined,
              loop_id: isNextNodeInLoop ? nextNode.parentId : undefined,
              _connectedNodeIsSelected: true,
            },
            zIndex: nextNode.parentId
              ? isNextNodeInIteration
                ? ITERATION_CHILDREN_Z_INDEX
                : LOOP_CHILDREN_Z_INDEX
              : 0,
          };
        }
        const nodesConnectedSourceOrTargetHandleIdsMap =
          getNodesConnectedSourceOrTargetHandleIdsMap(
            [
              { type: 'remove', edge: edges[currentEdgeIndex] },
              { type: 'add', edge: newPrevEdge },
              ...(newNextEdge ? [{ type: 'add', edge: newNextEdge }] : []),
            ],
            [...nodes, newNode],
          );

        const afterNodesInSameBranch = getAfterNodesInSameBranch(nextNodeId!);
        const afterNodesInSameBranchIds = afterNodesInSameBranch.map(
          (node: any) => node.id,
        );
        const newNodes = produce(nodes, (draft) => {
          draft.forEach((node) => {
            node.data.selected = false;

            if (nodesConnectedSourceOrTargetHandleIdsMap[node.id]) {
              node.data = {
                ...node.data,
                ...nodesConnectedSourceOrTargetHandleIdsMap[node.id],
              };
            }
            if (afterNodesInSameBranchIds.includes(node.id))
              node.position.x += NODE_WIDTH_X_OFFSET;

            /* if (
              node.data.type === BlockEnum.Iteration &&
              prevNode.parentId === node.id
            )
              node.data._children?.push(newNode.id);
            if (
              node.data.type === BlockEnum.Loop &&
              prevNode.parentId === node.id
            ) */
            node.data._children?.push(newNode.id);
          });
          draft.push(newNode);
          if (newIterationStartNode) draft.push(newIterationStartNode);
          if (newLoopStartNode) draft.push(newLoopStartNode);
        });
        setNodes(newNodes);
        /* if (
          newNode.data.type === BlockEnum.VariableAssigner ||
          newNode.data.type === BlockEnum.VariableAggregator
        ) {
          const { setShowAssignVariablePopup } = workflowStore.getState();

          setShowAssignVariablePopup({
            nodeId: prevNode.id,
            nodeData: prevNode.data,
            variableAssignerNodeId: newNode.id,
            variableAssignerNodeData: newNode.data as VariableAssignerNodeType,
            variableAssignerNodeHandleId: targetHandle,
            parentNode: nodes.find((node) => node.id === newNode.parentId),
            x: -25,
            y: 44,
          });
        } */
        const newEdges = produce(edges, (draft) => {
          draft.splice(currentEdgeIndex, 1);
          draft.forEach((item) => {
            item.data = {
              ...item.data,
              _connectedNodeIsSelected: false,
            };
          });
          draft.push(newPrevEdge);

          if (newNextEdge) draft.push(newNextEdge);
        });
        setEdges(newEdges);
      }
      handleSyncWorkflowDraft();
      saveStateToHistory(WorkflowHistoryEvent.NodeAdd);
    },
    [
      getNodesReadOnly,
      store,
      handleSyncWorkflowDraft,
      saveStateToHistory,
      workflowStore,
      getAfterNodesInSameBranch,
      checkNestedParallelLimit,
    ],
  );

  return {
    handleNodeDragStart,
    handleNodeDrag,
    handleNodeDragStop,
    handleNodeEnter,
    handleNodeLeave,
    handleNodeSelect,
    handleNodeClick,
    // handleNodeConnect,
    // handleNodeConnectStart,
    // handleNodeConnectEnd,
    // handleNodeDelete,
    // handleNodeChange,
    handleNodeAdd,
    // handleNodeCancelRunningStatus,
    // handleNodesCancelSelected,
    // handleNodeContextMenu,
    // handleNodesCopy,
    // handleNodesPaste,
    // handleNodesDuplicate,
    // handleNodesDelete,
    // handleNodeResize,
    // handleNodeDisconnect,
    // handleHistoryBack,
    // handleHistoryForward,
  };
};
