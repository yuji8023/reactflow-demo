import type { FC } from 'react';
import React from 'react';
import { Tag } from 'antd';
import type { NodeProps } from '../../types';
import { AssignmentNodeType } from './types';

const Node: FC<NodeProps<AssignmentNodeType>> = (props) => {
  const { data } = props;
  const { detail, status } = data;

  return (
    <div className="px-3">
      {detail.station && (
        <div className="relative h-0 text-right text-xs">
          <Tag
            className="!-right-[2px] !-top-[20px] !-translate-y-1/2"
            color="cyan"
          >
            {detail.station}
          </Tag>
        </div>
      )}
      <div className="mb-1 text-center text-base font-medium">
        {detail.title}
      </div>
      <div className="mb-2 indent-6 text-xs text-gray-400">{detail.resume}</div>
      <div></div>
    </div>
  );
};

export default React.memo(Node);
