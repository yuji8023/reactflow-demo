import { BlockEnum } from './types';
import StartNodeDefault from './nodes/start/default';
import EndNodeDefault from './nodes/end/default';
/* 该文件导出一些workflow的配置 */

type NodesExtraData = {
  author: string;
  about: string;
  availablePrevNodes: BlockEnum[];
  availableNextNodes: BlockEnum[];
  getAvailablePrevNodes: (isChatMode: boolean) => BlockEnum[];
  getAvailableNextNodes: (isChatMode: boolean) => BlockEnum[];
  checkValid: any;
};

let maxParallelLimit = 10;

/** @name 开始节点初始化位置信息（宽高,x/y坐标） */
export const NODE_WIDTH = 240;
export const X_OFFSET = 60;
export const NODE_WIDTH_X_OFFSET = NODE_WIDTH + X_OFFSET;
export const Y_OFFSET = 39;
export const MAX_TREE_DEPTH = 50;
export const START_INITIAL_POSITION = { x: 80, y: 282 };

/** @name 更新事件名称 */
export const WORKFLOW_DATA_UPDATE = 'WORKFLOW_DATA_UPDATE';

/** @name 默认节点类型 */
export const CUSTOM_NODE = 'custom';
/** @name 默认边类型 */
export const CUSTOM_EDGE = 'custom';

export const NODES_INITIAL_DATA = {
  [BlockEnum.Start]: {
    type: BlockEnum.Start,
    title: '开始',
    desc: '',
    ...StartNodeDefault.defaultValue,
  },
  [BlockEnum.End]: {
    type: BlockEnum.End,
    title: '结束',
    desc: '',
    ...EndNodeDefault.defaultValue,
  },
};

/** @name 节点额外数据 */
export const NODES_EXTRA_DATA: Record<BlockEnum, NodesExtraData> = {
  [BlockEnum.Start]: {
    author: 'Dify',
    about: '定义一个 workflow 流程启动的初始参数',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: StartNodeDefault.getAvailablePrevNodes,
    getAvailableNextNodes: StartNodeDefault.getAvailableNextNodes,
    checkValid: StartNodeDefault.checkValid,
  },
  [BlockEnum.End]: {
    author: 'Dify',
    about: '',
    availablePrevNodes: [],
    availableNextNodes: [],
    getAvailablePrevNodes: EndNodeDefault.getAvailablePrevNodes,
    getAvailableNextNodes: EndNodeDefault.getAvailableNextNodes,
    checkValid: EndNodeDefault.checkValid,
  },
};

export const ITERATION_NODE_Z_INDEX = 1;
export const ITERATION_CHILDREN_Z_INDEX = 1002;
export const ITERATION_PADDING = {
  top: 65,
  right: 16,
  bottom: 20,
  left: 16,
};

export const LOOP_NODE_Z_INDEX = 1;
export const LOOP_CHILDREN_Z_INDEX = 1002;
export const LOOP_PADDING = {
  top: 65,
  right: 16,
  bottom: 20,
  left: 16,
};

/** @name 并行节点 */
export const PARALLEL_LIMIT = maxParallelLimit; // 10
export const PARALLEL_DEPTH_LIMIT = 3;
export const SUPPORT_OUTPUT_VARS_NODE = [BlockEnum.Start];
