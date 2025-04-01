import type { CommonNodeType, InputVar } from '../../types';

export type MiddleNodeType = CommonNodeType & {
  infos: InputVar[];
};
