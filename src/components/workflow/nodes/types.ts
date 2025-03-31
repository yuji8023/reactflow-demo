import type {
  BlockEnum,
  CommonNodeType,
  ErrorHandleMode,
  ValueSelector,
  VarType,
} from '../types';

export type IterationNodeType = CommonNodeType & {
  startNodeType?: BlockEnum;
  start_node_id: string; // start node id in the iteration
  iteration_id?: string;
  iterator_selector: ValueSelector;
  output_selector: ValueSelector;
  output_type: VarType; // output type.
  is_parallel: boolean; // open the parallel mode or not
  parallel_nums: number; // the numbers of parallel
  error_handle_mode: ErrorHandleMode; // how to handle error in the iteration
  _isShowTips: boolean; // when answer node in parallel mode iteration show tips
};

export enum LogicalOperator {
  and = 'and',
  or = 'or',
}

export enum ComparisonOperator {
  contains = 'contains',
  notContains = 'not contains',
  startWith = 'start with',
  endWith = 'end with',
  is = 'is',
  isNot = 'is not',
  empty = 'empty',
  notEmpty = 'not empty',
  equal = '=',
  notEqual = '≠',
  largerThan = '>',
  lessThan = '<',
  largerThanOrEqual = '≥',
  lessThanOrEqual = '≤',
  isNull = 'is null',
  isNotNull = 'is not null',
  in = 'in',
  notIn = 'not in',
  allOf = 'all of',
  exists = 'exists',
  notExists = 'not exists',
}

export enum NumberVarType {
  variable = 'variable',
  constant = 'constant',
  mixed = 'mixed',
}

export type Condition = {
  id: string;
  varType: VarType;
  variable_selector?: ValueSelector;
  key?: string; // sub variable key
  comparison_operator?: ComparisonOperator;
  value: string | string[];
  numberVarType?: NumberVarType;
  sub_variable_condition?: CaseItem;
};

export type CaseItem = {
  logical_operator: LogicalOperator;
  conditions: Condition[];
};

export type LoopNodeType = CommonNodeType & {
  startNodeType?: BlockEnum;
  start_node_id: string;
  loop_id?: string;
  logical_operator?: LogicalOperator;
  break_conditions?: Condition[];
  loop_count: number;
  error_handle_mode: ErrorHandleMode; // how to handle error in the iteration
};
