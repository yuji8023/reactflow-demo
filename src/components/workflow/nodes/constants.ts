import type { ComponentType } from 'react';
import { BlockEnum } from '../types';
import StartNode from './start/node';
// import StartPanel from './start/panel';

export const NodeComponentMap: Record<string, ComponentType<any>> = {
  [BlockEnum.Start]: StartNode,
};

export const PanelComponentMap: Record<string, ComponentType<any>> = {
  // [BlockEnum.Start]: StartPanel,
};
