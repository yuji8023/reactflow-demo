import type { Block } from '../types';
import { BlockEnum } from '../types';
import { BlockClassificationEnum } from './types';

export const BLOCKS: Block[] = [
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.Start,
    title: '开始',
    description: '',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.End,
    title: '结束',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.Middle,
    title: '条件判断',
    description: '',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.AssignmentOnline,
    title: '在线作业',
    description: '',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.AssignmentOffline,
    title: '线下作业',
    description: '',
  },
  /*   {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.LLM,
    title: 'LLM',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.KnowledgeRetrieval,
    title: 'Knowledge Retrieval',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.End,
    title: 'End',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.Answer,
    title: 'Direct Answer',
  },
  {
    classification: BlockClassificationEnum.QuestionUnderstand,
    type: BlockEnum.QuestionClassifier,
    title: 'Question Classifier',
  },
  {
    classification: BlockClassificationEnum.Logic,
    type: BlockEnum.IfElse,
    title: 'IF/ELSE',
  },
  {
    classification: BlockClassificationEnum.Logic,
    type: BlockEnum.Iteration,
    title: 'Iteration',
  },
  {
    classification: BlockClassificationEnum.Logic,
    type: BlockEnum.Loop,
    title: 'Loop',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.Code,
    title: 'Code',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.TemplateTransform,
    title: 'Templating Transform',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.VariableAggregator,
    title: 'Variable Aggregator',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.DocExtractor,
    title: 'Doc Extractor',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.Assigner,
    title: 'Variable Assigner',
  },
  {
    classification: BlockClassificationEnum.Transform,
    type: BlockEnum.ParameterExtractor,
    title: 'Parameter Extractor',
  },
  {
    classification: BlockClassificationEnum.Utilities,
    type: BlockEnum.HttpRequest,
    title: 'HTTP Request',
  },
  {
    classification: BlockClassificationEnum.Utilities,
    type: BlockEnum.ListFilter,
    title: 'List Filter',
  },
  {
    classification: BlockClassificationEnum.Default,
    type: BlockEnum.Agent,
    title: 'Agent',
  }, */
];

export const BLOCK_CLASSIFICATIONS: string[] = [
  BlockClassificationEnum.Default,
  // BlockClassificationEnum.QuestionUnderstand,
  // BlockClassificationEnum.Logic,
  // BlockClassificationEnum.Transform,
  // BlockClassificationEnum.Utilities,
];
