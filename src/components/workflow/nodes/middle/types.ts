import type { CommonNodeType } from '../../types';

export type InfoItem = {
  info_id: string;
  content: string;
};

export type MiddleNodeType = CommonNodeType & {
  infos: InfoItem[];
  conditionContent: string;
};
