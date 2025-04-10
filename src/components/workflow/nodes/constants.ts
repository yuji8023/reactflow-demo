import type { ComponentType } from 'react';
import { BlockEnum } from '../types';
import StartNode from './start/node';
import EndNode from './end/node';
import MiddleNode from './middle/node';
import StartPanel from './start/panel';
import EndPanel from './end/panel';
import MiddlePanel from './middle/panel';

export const CUSTOM_LOOP_START_NODE = 'custom-loop-start';

export const CUSTOM_ITERATION_START_NODE = 'custom-iteration-start';

export const NodeComponentMap: Record<string, ComponentType<any>> = {
  [BlockEnum.Start]: StartNode,
  [BlockEnum.End]: EndNode,
  [BlockEnum.Middle]: MiddleNode,
};

export const PanelComponentMap: Record<string, ComponentType<any>> = {
  [BlockEnum.Start]: StartPanel,
  [BlockEnum.End]: EndPanel,
  [BlockEnum.Middle]: MiddlePanel,
};

export const SUB_VARIABLES = [
  'type',
  'size',
  'name',
  'url',
  'extension',
  'mime_type',
  'transfer_method',
  'related_id',
];
export const OUTPUT_FILE_SUB_VARIABLES = SUB_VARIABLES.filter(
  (key) => key !== 'transfer_method',
);
