import { useCallback, useEffect, useMemo, useState } from 'react';
// import dayjs from 'dayjs'
// import { uniqBy } from 'lodash-es'
// import { useTranslation } from 'react-i18next'
// import { useContext } from 'use-context-selector'
// import {
//   getIncomers,
//   getOutgoers,
//   useStoreApi,
// } from 'reactflow'
// import type {
//   Connection,
// } from 'reactflow'
import type { Edge, Node, ValueSelector } from '../types';
// import {
//   BlockEnum,
//   WorkflowRunningStatus,
// } from '../types'
import { useStore, useWorkflowStore } from '../store';
// import {
//   getParallelInfo,
// } from '../utils'
// import {
//   PARALLEL_DEPTH_LIMIT,
//   PARALLEL_LIMIT,
//   SUPPORT_OUTPUT_VARS_NODE,
// } from '../constants'
// import { CUSTOM_NOTE_NODE } from '../note-node/constants'
// import { findUsedVarNodes, getNodeOutputVars, updateNodeVars } from '../nodes/_base/components/variable/utils'
// import { useNodesExtraData } from './use-nodes-data'
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
    try {
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
