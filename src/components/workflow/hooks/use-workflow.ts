import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash-es';
// import { useTranslation } from 'react-i18next'
// import { useContext } from 'use-context-selector'
import { getIncomers, getOutgoers, useStoreApi } from 'reactflow';
import type { Connection } from 'reactflow';
import type { Edge, Node, ValueSelector } from '../types';
import {
  BlockEnum,
  // WorkflowRunningStatus,
} from '../types';
import { useWorkflowStore } from '../store';
import { getParallelInfo } from '../utils';
import {
  PARALLEL_DEPTH_LIMIT,
  PARALLEL_LIMIT,
  SUPPORT_OUTPUT_VARS_NODE,
} from '../constants';
import { CUSTOM_NOTE_NODE } from '../note-node/constants';
import {
  findUsedVarNodes,
  getNodeOutputVars,
  updateNodeVars,
} from '../nodes/_base/components/variable/utils';
import { useNodesExtraData } from './use-nodes-data';
import { useWorkflowTemplate } from './use-workflow-template';
import type { FetchWorkflowDraftResponse } from '../types';
// import {
//   fetchAllBuiltInTools,
//   fetchAllCustomTools,
//   fetchAllWorkflowTools,
// } from '@/service/tools'
// import I18n from '@/context/i18n'
// import { CollectionType } from '@/app/components/tools/types'
// import { CUSTOM_ITERATION_START_NODE } from '@/app/components/workflow/nodes/iteration-start/constants'
// import { CUSTOM_LOOP_START_NODE } from '@/app/components/workflow/nodes/loop-start/constants'
// import { useWorkflowConfig } from '@/service/use-workflow'
// import { canFindTool } from '@/utils'

export const useWorkflow = () => {
  const store = useStoreApi();
  const workflowStore = useWorkflowStore();
  // const appId = useStore((s) => s.appId);
  const nodesExtraData = useNodesExtraData();
  // const { data: workflowConfig } = useWorkflowConfig();
  // const setPanelWidth = useCallback(
  //   (width: number) => {
  //     localStorage.setItem('workflow-node-panel-width', `${width}`);
  //     workflowStore.setState({ panelWidth: width });
  //   },
  //   [workflowStore],
  // );

  /* const getTreeLeafNodes = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      let startNode = nodes.find((node) => node.data.type === BlockEnum.Start);
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (currentNode?.parentId)
        startNode = nodes.find(
          (node) =>
            node.parentId === currentNode.parentId &&
            (node.type === CUSTOM_ITERATION_START_NODE ||
              node.type === CUSTOM_LOOP_START_NODE),
        );

      if (!startNode) return [];

      const list: Node[] = [];
      const preOrder = (root: Node, callback: (node: Node) => void) => {
        if (root.id === nodeId) return;
        const outgoers = getOutgoers(root, nodes, edges);

        if (outgoers.length) {
          outgoers.forEach((outgoer) => {
            preOrder(outgoer, callback);
          });
        } else {
          if (root.id !== nodeId) callback(root);
        }
      };
      preOrder(startNode, (node) => {
        list.push(node);
      });

      const incomers = getIncomers({ id: nodeId } as Node, nodes, edges);

      list.push(...incomers);

      return uniqBy(list, 'id').filter((item) => {
        return SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
      });
    },
    [store],
  ); */

  const getBeforeNodesInSameBranch = useCallback(
    (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
      const { getNodes, edges } = store.getState();
      const nodes = newNodes || getNodes();
      const currentNode = nodes.find((node) => node.id === nodeId);

      const list: Node[] = [];

      if (!currentNode) return list;

      if (currentNode.parentId) {
        const parentNode = nodes.find(
          (node) => node.id === currentNode.parentId,
        );
        if (parentNode) {
          const parentList = getBeforeNodesInSameBranch(parentNode.id);

          list.push(...parentList);
        }
      }

      const traverse = (root: Node, callback: (node: Node) => void) => {
        if (root) {
          const incomers = getIncomers(root, nodes, newEdges || edges);

          if (incomers.length) {
            incomers.forEach((node) => {
              if (!list.find((n) => node.id === n.id)) {
                callback(node);
                traverse(node, callback);
              }
            });
          }
        }
      };
      traverse(currentNode, (node) => {
        list.push(node);
      });

      const length = list.length;
      if (length) {
        return uniqBy(list, 'id')
          .reverse()
          .filter((item) => {
            return SUPPORT_OUTPUT_VARS_NODE.includes(item.data.type);
          });
      }

      return [];
    },
    [store],
  );

  /* const getBeforeNodesInSameBranchIncludeParent = useCallback(
    (nodeId: string, newNodes?: Node[], newEdges?: Edge[]) => {
      const nodes = getBeforeNodesInSameBranch(nodeId, newNodes, newEdges);
      const { getNodes } = store.getState();
      const allNodes = getNodes();
      const node = allNodes.find((n) => n.id === nodeId);
      const parentNodeId = node?.parentId;
      const parentNode = allNodes.find((n) => n.id === parentNodeId);
      if (parentNode) nodes.push(parentNode);

      return nodes;
    },
    [getBeforeNodesInSameBranch, store],
  ); */

  const getAfterNodesInSameBranch = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      const currentNode = nodes.find((node) => node.id === nodeId)!;

      if (!currentNode) return [];
      const list: Node[] = [currentNode];

      const traverse = (root: Node, callback: (node: Node) => void) => {
        if (root) {
          const outgoers = getOutgoers(root, nodes, edges);

          if (outgoers.length) {
            outgoers.forEach((node) => {
              callback(node);
              traverse(node, callback);
            });
          }
        }
      };
      traverse(currentNode, (node) => {
        list.push(node);
      });

      return uniqBy(list, 'id');
    },
    [store],
  );

  const getBeforeNodeById = useCallback(
    (nodeId: string) => {
      const { getNodes, edges } = store.getState();
      const nodes = getNodes();
      const node = nodes.find((node) => node.id === nodeId)!;

      return getIncomers(node, nodes, edges);
    },
    [store],
  );

  /* const getIterationNodeChildren = useCallback(
    (nodeId: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      return nodes.filter((node) => node.parentId === nodeId);
    },
    [store],
  ); */

  /* const getLoopNodeChildren = useCallback(
    (nodeId: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      return nodes.filter((node) => node.parentId === nodeId);
    },
    [store],
  ); */

  /* const isFromStartNode = useCallback(
    (nodeId: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();
      const currentNode = nodes.find((node) => node.id === nodeId);

      if (!currentNode) return false;

      if (currentNode.data.type === BlockEnum.Start) return true;

      const checkPreviousNodes = (node: Node) => {
        const previousNodes = getBeforeNodeById(node.id);

        for (const prevNode of previousNodes) {
          if (prevNode.data.type === BlockEnum.Start) return true;
          if (checkPreviousNodes(prevNode)) return true;
        }

        return false;
      };

      return checkPreviousNodes(currentNode);
    },
    [store, getBeforeNodeById],
  ); */

  /* const handleOutVarRenameChange = useCallback(
    (
      nodeId: string,
      oldValeSelector: ValueSelector,
      newVarSelector: ValueSelector,
    ) => {
      const { getNodes, setNodes } = store.getState();
      const afterNodes = getAfterNodesInSameBranch(nodeId);
      const effectNodes = findUsedVarNodes(oldValeSelector, afterNodes);
      if (effectNodes.length > 0) {
        const newNodes = getNodes().map((node) => {
          if (effectNodes.find((n) => n.id === node.id))
            return updateNodeVars(node, oldValeSelector, newVarSelector);

          return node;
        });
        setNodes(newNodes);
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [store],
  ); */

  const isVarUsedInNodes = useCallback(
    (varSelector: ValueSelector) => {
      const nodeId = varSelector[0];
      const afterNodes = getAfterNodesInSameBranch(nodeId);
      const effectNodes = findUsedVarNodes(varSelector, afterNodes);
      return effectNodes.length > 0;
    },
    [getAfterNodesInSameBranch],
  );

  const removeUsedVarInNodes = useCallback(
    (varSelector: ValueSelector) => {
      const nodeId = varSelector[0];
      const { getNodes, setNodes } = store.getState();
      const afterNodes = getAfterNodesInSameBranch(nodeId);
      const effectNodes = findUsedVarNodes(varSelector, afterNodes);
      if (effectNodes.length > 0) {
        const newNodes = getNodes().map((node) => {
          if (effectNodes.find((n) => n.id === node.id))
            return updateNodeVars(node, varSelector, []);

          return node;
        });
        setNodes(newNodes);
      }
    },
    [getAfterNodesInSameBranch, store],
  );

  const isNodeVarsUsedInNodes = useCallback(
    (node: Node, isChatMode: boolean) => {
      const outputVars = getNodeOutputVars(node, isChatMode);
      const isUsed = outputVars.some((varSelector) => {
        return isVarUsedInNodes(varSelector);
      });
      return isUsed;
    },
    [isVarUsedInNodes],
  );

  const checkParallelLimit = useCallback(
    (nodeId: string, nodeHandle = 'source') => {
      const { edges } = store.getState();
      const connectedEdges = edges.filter(
        (edge) => edge.source === nodeId && edge.sourceHandle === nodeHandle,
      );
      if (connectedEdges.length > PARALLEL_LIMIT - 1) {
        const { setShowTips } = workflowStore.getState();
        setShowTips(`并行分支限制为 ${PARALLEL_LIMIT} 个`);
        return false;
      }

      return true;
    },
    [store, workflowStore],
  );

  const checkNestedParallelLimit = useCallback(
    (nodes: Node[], edges: Edge[], parentNodeId?: string) => {
      const { parallelList, hasAbnormalEdges } = getParallelInfo(
        nodes,
        edges,
        parentNodeId,
      );

      if (hasAbnormalEdges) return false;

      for (let i = 0; i < parallelList.length; i++) {
        const parallel = parallelList[i];

        if (parallel.depth > PARALLEL_DEPTH_LIMIT) {
          const { setShowTips } = workflowStore.getState();
          setShowTips(`并行嵌套层数限制 ${PARALLEL_DEPTH_LIMIT} 层`);
          return false;
        }
      }

      return true;
    },
    [workflowStore],
  );

  const isValidConnection = useCallback(
    ({ source, sourceHandle, target }: Connection) => {
      const { edges, getNodes } = store.getState();
      const nodes = getNodes();
      const sourceNode: Node = nodes.find((node) => node.id === source)!;
      const targetNode: Node = nodes.find((node) => node.id === target)!;

      if (!checkParallelLimit(source!, sourceHandle || 'source')) return false;

      if (
        sourceNode.type === CUSTOM_NOTE_NODE ||
        targetNode.type === CUSTOM_NOTE_NODE
      )
        return false;

      if (sourceNode.parentId !== targetNode.parentId) return false;

      if (sourceNode && targetNode) {
        const sourceNodeAvailableNextNodes =
          nodesExtraData[sourceNode.data.type].availableNextNodes;
        const targetNodeAvailablePrevNodes = [
          ...nodesExtraData[targetNode.data.type].availablePrevNodes,
          BlockEnum.Start,
        ];

        if (!sourceNodeAvailableNextNodes.includes(targetNode.data.type))
          return false;

        if (!targetNodeAvailablePrevNodes.includes(sourceNode.data.type))
          return false;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      return !hasCycle(targetNode);
    },
    [store, nodesExtraData, checkParallelLimit],
  );

  const formatTimeFromNow = useCallback((time: number) => {
    //@ts-ignore
    return dayjs(time).locale('zh-cn').fromNow();
  }, []);

  const getNode = useCallback(
    (nodeId?: string) => {
      const { getNodes } = store.getState();
      const nodes = getNodes();

      return (
        nodes.find((node) => node.id === nodeId) ||
        nodes.find((node) => node.data.type === BlockEnum.Start)
      );
    },
    [store],
  );

  return {
    // setPanelWidth,
    // getTreeLeafNodes,
    getBeforeNodesInSameBranch,
    // getBeforeNodesInSameBranchIncludeParent,
    getAfterNodesInSameBranch,
    // handleOutVarRenameChange,
    isVarUsedInNodes,
    removeUsedVarInNodes,
    isNodeVarsUsedInNodes,
    checkParallelLimit,
    checkNestedParallelLimit,
    isValidConnection,
    // isFromStartNode,
    formatTimeFromNow,
    getNode,
    getBeforeNodeById,
    // getIterationNodeChildren,
    // getLoopNodeChildren,
  };
};
export const useWorkflowInit = () => {
  const workflowStore = useWorkflowStore();
  const { nodes: nodesTemplate, edges: edgesTemplate } = useWorkflowTemplate();
  // const appDetail = useAppStore((state) => state.appDetail)!;
  const [data, setData] = useState<FetchWorkflowDraftResponse>();
  const [isLoading, setIsLoading] = useState(true);

  /** @name 获取工作流Id */
  /*   useEffect(() => {
    workflowStore.setState({ appId: appDetail.id });
  }, [appDetail.id, workflowStore]); */

  const handleGetInitialWorkflowData = useCallback(async () => {
    try {
      setTimeout(() => {
        setData({
          graph: {
            nodes: [
              {
                id: '1742951629752',
                type: 'custom',
                data: {
                  type: 'start',
                  title: '开始',
                  desc: '',
                  variables: [],
                  selected: true,
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
            ],
            edges: [],
          },
        });
        setIsLoading(false);
      }, 3000);
      /** @name 获取工作流保存的信息 */
      /* const res = await fetchWorkflowDraft(
        `/apps/${appDetail.id}/workflows/draft`,
      );
      setData(res); */

      /** @name 存储自动保存的hash */
      // setSyncWorkflowDraftHash(res.hash);
      setIsLoading(false);
    } catch (error: any) {}
  }, [
    // appDetail,
    nodesTemplate,
    edgesTemplate,
    workflowStore,
  ]);

  useEffect(() => {
    handleGetInitialWorkflowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** @name 获取节点默认配置及发布信息  */
  /* const handleFetchPreloadData = useCallback(async () => {
    try {
      const nodesDefaultConfigsData = await fetchNodesDefaultConfigs(
        `/apps/${appDetail?.id}/workflows/default-workflow-block-configs`,
      );
      const publishedWorkflow = await fetchPublishedWorkflow(
        `/apps/${appDetail?.id}/workflows/publish`,
      );
      workflowStore.setState({
        nodesDefaultConfigs: nodesDefaultConfigsData.reduce(
          (acc, block) => {
            if (!acc[block.type]) acc[block.type] = { ...block.config };
            return acc;
          },
          {} as Record<string, any>,
        ),
      });
      workflowStore.getState().setPublishedAt(publishedWorkflow?.created_at);
    } catch (e) {
      console.error(e);
    }
  }, [workflowStore]); */

  /*   useEffect(() => {
    handleFetchPreloadData();
  }, [handleFetchPreloadData]); */

  useEffect(() => {
    if (data) {
      // workflowStore.getState().setDraftUpdatedAt(data.updated_at);
      // workflowStore.getState().setToolPublished(data.tool_published);
    }
  }, [data, workflowStore]);

  return {
    data,
    isLoading,
  };
};

export const useNodesReadOnly = () => {
  const getNodesReadOnly = useCallback(() => {
    return false;
  }, []);

  return {
    nodesReadOnly: false,
    getNodesReadOnly,
  };
};
