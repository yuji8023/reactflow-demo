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
    <div className="px-3">
      {infos.map((info, index) => (
        <>
          <div key={info.info_id} className="my-1">
            <div className="relative flex min-h-6 items-center justify-end px-1">
              <div className=" text-black-500 text-xs">{info.content}</div>
              <NodeSourceHandle
                {...props}
                handleId={info.info_id}
                handleClassName="!top-1/2 !-right-[21px] !-translate-y-1/2"
              />
            </div>
          </div>
          {index !== infos.length - 1 && <Divider className="my-1" />}
        </>
      ))}
    </div>
  );
};

export default React.memo(Node);
