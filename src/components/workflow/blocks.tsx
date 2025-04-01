import { BlockEnum } from './types';

export const ALL_AVAILABLE_BLOCKS = Object.values(BlockEnum);

/** @name Chat可用的节点，start节点与End节点，默认只有一个不支持添加 */
export const ALL_CHAT_AVAILABLE_BLOCKS = ALL_AVAILABLE_BLOCKS.filter(
  (key) => key !== BlockEnum.End && key !== BlockEnum.Start,
) as BlockEnum[];

/** @name 工作流禁用的节点，start节点默认只有一个不支持添加 */
export const ALL_COMPLETION_AVAILABLE_BLOCKS = ALL_AVAILABLE_BLOCKS.filter(
  (key) => key !== BlockEnum.Start,
) as BlockEnum[];
