import type {
  Edge as ReactFlowEdge,
  Node as ReactFlowNode,
  // Viewport,
} from 'reactflow';
import type { Viewport } from 'reactflow';
import type { NumberVarType as VarKindType } from './nodes/types';

export enum BlockEnum {
  Start = 'start',
  End = 'end',
  Middle = 'middle',
  // Answer = 'answer',
  // LLM = 'llm',
  // KnowledgeRetrieval = 'knowledge-retrieval',
  // QuestionClassifier = 'question-classifier',
  // IfElse = 'if-else',
  // Code = 'code',
  // TemplateTransform = 'template-transform',
  // HttpRequest = 'http-request',
  // VariableAssigner = 'variable-assigner',
  // VariableAggregator = 'variable-aggregator',
  // Tool = 'tool',
  // ParameterExtractor = 'parameter-extractor',
  // Iteration = 'iteration',
  // DocExtractor = 'document-extractor',
  // ListFilter = 'list-operator',
  // IterationStart = 'iteration-start',
  // Assigner = 'assigner', // is now named as VariableAssigner
  // Agent = 'agent',
  // Loop = 'loop',
  // LoopStart = 'loop-start',
}

export enum ErrorHandleTypeEnum {
  none = 'none',
  failBranch = 'fail-branch',
  defaultValue = 'default-value',
}

export enum VarType {
  string = 'string',
  number = 'number',
  secret = 'secret',
  boolean = 'boolean',
  object = 'object',
  file = 'file',
  array = 'array',
  arrayString = 'array[string]',
  arrayNumber = 'array[number]',
  arrayObject = 'array[object]',
  arrayFile = 'array[file]',
  any = 'any',
}

export type Var = {
  variable: string;
  type: VarType;
  children?: Var[]; // if type is obj, has the children struct
  isParagraph?: boolean;
  isSelect?: boolean;
  options?: string[];
  required?: boolean;
  des?: string;
  isException?: boolean;
};

export type NodeOutPutVar = {
  nodeId: string;
  title: string;
  vars: Var[];
  isStartNode?: boolean;
};

export enum ControlMode {
  Pointer = 'pointer',
  Hand = 'hand',
}

export enum ErrorHandleMode {
  Terminated = 'terminated',
  ContinueOnError = 'continue-on-error',
  RemoveAbnormalOutput = 'remove-abnormal-output',
}

export type DefaultValueForm = {
  key: string;
  type: VarType;
  value?: any;
};

export type Branch = {
  id: string;
  name: string;
};

export type WorkflowRetryConfig = {
  max_retries: number;
  retry_interval: number;
  retry_enabled: boolean;
};

export type ToolDefaultValue = {
  provider_id: string;
  provider_type: string;
  provider_name: string;
  tool_name: string;
  tool_label: string;
  title: string;
  is_team_authorization: boolean;
  params: Record<string, any>;
  paramSchemas: Record<string, any>[];
  output_schema: Record<string, any>;
};

export type CommonNodeType<T = {}> = {
  _connectedSourceHandleIds?: string[];
  _connectedTargetHandleIds?: string[];
  _targetBranches?: Branch[];
  _isSingleRun?: boolean;
  _runningStatus?: NodeRunningStatus;
  _runningBranchId?: string;
  _singleRunningStatus?: NodeRunningStatus;
  _isCandidate?: boolean;
  _isBundled?: boolean;
  _children?: string[];
  _isEntering?: boolean;
  _showAddVariablePopup?: boolean;
  _holdAddVariablePopup?: boolean;
  _iterationLength?: number;
  _iterationIndex?: number;
  _inParallelHovering?: boolean;
  _waitingRun?: boolean;
  _retryIndex?: number;
  isInIteration?: boolean;
  iteration_id?: string;
  selected?: boolean;
  title: string;
  desc: string;
  type: BlockEnum;
  width?: number;
  height?: number;
  _loopLength?: number;
  _loopIndex?: number;
  isInLoop?: boolean;
  loop_id?: string;
  error_strategy?: ErrorHandleTypeEnum;
  retry_config?: WorkflowRetryConfig;
  default_value?: DefaultValueForm[];
} & T &
  Partial<
    Pick<
      ToolDefaultValue,
      'provider_id' | 'provider_type' | 'provider_name' | 'tool_name'
    >
  >;

export enum NodeRunningStatus {
  NotStart = 'not-start',
  Waiting = 'waiting',
  Running = 'running',
  Succeeded = 'succeeded',
  Failed = 'failed',
  Exception = 'exception',
  Retry = 'retry',
}

export type CommonEdgeType = {
  _hovering?: boolean;
  _connectedNodeIsHovering?: boolean;
  _connectedNodeIsSelected?: boolean;
  _isBundled?: boolean;
  _sourceRunningStatus?: NodeRunningStatus;
  _targetRunningStatus?: NodeRunningStatus;
  _waitingRun?: boolean;
  isInIteration?: boolean;
  iteration_id?: string;
  isInLoop?: boolean;
  loop_id?: string;
  sourceType: BlockEnum;
  targetType: BlockEnum;
};

export type Edge = ReactFlowEdge<CommonEdgeType>;

export type Node<T = {}> = ReactFlowNode<CommonNodeType<T>>;

export type NodeProps<T = unknown> = { id: string; data: CommonNodeType<T> };

export type NodeDefault<T> = {
  defaultValue: Partial<T>;
  getAvailablePrevNodes: (isChatMode: boolean) => BlockEnum[];
  getAvailableNextNodes: (isChatMode: boolean) => BlockEnum[];
  checkValid: (
    payload: T,
    t: any,
    moreDataForCheckValid?: any,
  ) => { isValid: boolean; errorMessage?: string };
};

export enum InputVarType {
  textInput = 'text-input',
  paragraph = 'paragraph',
  select = 'select',
  number = 'number',
  url = 'url',
  files = 'files',
  json = 'json', // obj, array
  contexts = 'contexts', // knowledge retrieval
  iterator = 'iterator', // iteration input
  singleFile = 'file',
  multiFiles = 'file-list',
  loop = 'loop', // loop input
}

export type ValueSelector = string[]; // [nodeId, key | obj key path]

export type InputVar = {
  type: InputVarType;
  label:
    | string
    | {
        nodeType: BlockEnum;
        nodeName: string;
        variable: string;
        isChatVar?: boolean;
      };
  variable: string;
  max_length?: number;
  default?: string;
  required: boolean;
  hint?: string;
  options?: string[];
  value_selector?: ValueSelector;
};

export type FetchWorkflowDraftResponse = {
  graph: {
    nodes: Node[];
    edges: Edge[];
    // viewport?: Viewport;
  };
};

/** @name 添加节点 */
export type OnNodeAdd = (
  newNodePayload: {
    nodeType: BlockEnum;
    sourceHandle?: string;
    targetHandle?: string;
    toolDefaultValue?: ToolDefaultValue;
  },
  oldNodesPayload: {
    prevNodeId?: string;
    prevNodeSourceHandle?: string;
    nextNodeId?: string;
    nextNodeTargetHandle?: string;
  },
) => void;

export type Variable = {
  variable: string;
  label?:
    | string
    | {
        nodeType: BlockEnum;
        nodeName: string;
        variable: string;
      };
  value_selector: ValueSelector;
  variable_type?: VarKindType;
  value?: string;
  options?: string[];
  required?: boolean;
  isParagraph?: boolean;
};

// 选中添加节点dialog
export type OnSelectBlock = (
  type: BlockEnum,
  toolDefaultValue?: ToolDefaultValue,
) => void;

export type Block = {
  classification?: string;
  type: BlockEnum;
  title: string;
  description?: string;
};

export type EnvironmentVariable = {
  id: string;
  name: string;
  value: any;
  value_type: 'string' | 'number' | 'secret';
};

export enum ChatVarType {
  Number = 'number',
  String = 'string',
  Object = 'object',
  ArrayString = 'array[string]',
  ArrayNumber = 'array[number]',
  ArrayObject = 'array[object]',
}

export type ConversationVariable = {
  id: string;
  name: string;
  value_type: ChatVarType;
  value: any;
  description: string;
};
