import { BLOCKS } from './constants';

export const useBlocks = () => {
  return BLOCKS.map((block) => {
    return {
      ...block,
      // title: t(`workflow.blocks.${block.type}`),
    };
  });
};
