import type { FC } from 'react';
import React from 'react';
import { NodeSourceHandle } from '../_base/components/node-handle';
import type { NodeProps } from '../../types';
import { MiddleNodeType } from './types';
import { Divider } from 'antd';

const Node: FC<NodeProps<MiddleNodeType>> = (props) => {
  const { data } = props;
  const { infos } = data;

  return (
    <div className="relative px-3">
      <div className="text-black-500 absolute -top-[29px] right-4 text-xs font-bold">
        是
      </div>
      <div className="mb-2 flex justify-between">
        <div className="flex-1 overflow-hidden break-words pl-2 text-center text-text-tertiary">
          {data.conditionContent}
        </div>
        <div className="w-8">
          {infos.map((info, index) => (
            <div key={info.info_id} className="my-1 h-full">
              <div className="relative flex h-full min-h-6 items-center justify-end px-1">
                <div className="text-black-500 break-words text-xs font-bold">
                  {info.content}
                </div>
                <NodeSourceHandle
                  {...props}
                  handleId={info.info_id}
                  handleClassName="!top-1/2 !-right-[21px] !-translate-y-1/2"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(Node);
