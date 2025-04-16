import type { NodeDefault } from '../../types';
import { BlockEnum } from '../../types';
import {
  // ALL_CHAT_AVAILABLE_BLOCKS,
  ALL_COMPLETION_AVAILABLE_BLOCKS,
} from '../../blocks';
import type { MiddleNodeType } from './types';

const nodeDefault: NodeDefault<MiddleNodeType> = {
  defaultValue: {
    infos: [
      // { info_id: 'source', content: '是' },
      { info_id: 'no', content: '否' },
    ],
    _targetBranches: [
      { id: 'source', name: '是' },
      { id: 'no', name: '否' },
    ],
  },
  getAvailablePrevNodes() {
    return ALL_COMPLETION_AVAILABLE_BLOCKS.filter(
      (type) => type !== BlockEnum.End,
    );
  },
  getAvailableNextNodes(isChatMode: boolean = false) {
    return ALL_COMPLETION_AVAILABLE_BLOCKS;
  },
  checkValid() {
    return {
      isValid: true,
    };
  },
};

export default nodeDefault;
