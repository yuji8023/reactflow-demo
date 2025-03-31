import { generateNewNode } from '../utils';
import { START_INITIAL_POSITION } from '../constants';
import { useNodesInitialData } from './use-nodes-data';

/** @name 初始化节点数据 */
export const useWorkflowTemplate = () => {
  const nodesInitialData = useNodesInitialData();

  const { newNode: startNode } = generateNewNode({
    data: nodesInitialData.start,
    position: START_INITIAL_POSITION,
  });

  return {
    nodes: [startNode],
    edges: [],
  };
};
