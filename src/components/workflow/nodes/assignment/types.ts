import type { CommonNodeType } from '../../types';

type BusinessScenarioType = {
  id: string;
  name: string;
  description?: string;
};

export type DetailType = {
  id: string;
  title?: string; // 作业标题
  station?: string; //岗位
  resume?: string; // 简述
  businessTags?: string[];
  desc?: string;
  bindBusinessScenario?: BusinessScenarioType;
};

export type AssignmentNodeType = CommonNodeType & {
  detail: DetailType;
  status: 'online' | 'offline';
};
