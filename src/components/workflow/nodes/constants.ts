import type { ComponentType } from 'react';
import { BlockEnum } from '../types';
import StartNode from './start/node';
// import StartPanel from './start/panel';

export const CUSTOM_LOOP_START_NODE = 'custom-loop-start';

export const CUSTOM_ITERATION_START_NODE = 'custom-iteration-start';

export const NodeComponentMap: Record<string, ComponentType<any>> = {
  [BlockEnum.Start]: StartNode,
};

export const PanelComponentMap: Record<string, ComponentType<any>> = {
  // [BlockEnum.Start]: StartPanel,
};
