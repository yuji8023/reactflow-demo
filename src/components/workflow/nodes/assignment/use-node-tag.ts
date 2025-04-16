import { BlockEnum } from './../../types';
import { useStoreApi } from 'reactflow';

const useNodeExistTag = () => {
  const store = useStoreApi();
  const { getNodes } = store.getState();
  const allNodes = getNodes();
  const node = allNodes.filter(
    (n) =>
      n.data.type === BlockEnum.AssignmentOnline ||
      n.data.type === BlockEnum.AssignmentOffline,
  );
  // 使用reduce获取node数组内所有的tag的集合
  const tags = node.reduce((acc, cur) => {
    if (cur.data.detail.businessTags) {
      acc.push(...cur.data.detail.businessTags);
    }
    return acc;
  }, [] as string[]);
  // tags去重
  const uniqueTags = [...new Set(tags)];

  return {
    tags: uniqueTags,
  };
};

export default useNodeExistTag;
