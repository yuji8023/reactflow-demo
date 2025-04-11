import { v4 as uuid4 } from 'uuid';
import type { NodeDefault } from '../../types';
import { BlockEnum } from '../../types';
import {
  // ALL_CHAT_AVAILABLE_BLOCKS,
  ALL_COMPLETION_AVAILABLE_BLOCKS,
} from '../../blocks';
import type { AssignmentNodeType } from './types';

const nodeDefault: NodeDefault<AssignmentNodeType> = {
  defaultValue: {
    detail: {
      id: uuid4(),
      title: '作业标题',
      station: '岗位角色',
      resume: '作业简述',
      bindBusinessScenario: {
        id: '',
        name: '',
        description: '',
      },
    },
    status: 'online',
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
