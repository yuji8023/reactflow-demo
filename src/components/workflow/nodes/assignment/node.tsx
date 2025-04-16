import type { FC } from 'react';
import React from 'react';
import { Divider, Tag, Tooltip } from 'antd';
import type { NodeProps } from '../../types';
import { AssignmentNodeType } from './types';
import { TAG_TEXT_MAX_LENGTH } from '../constants';

const Node: FC<NodeProps<AssignmentNodeType>> = (props) => {
  const { data } = props;
  const { detail } = data;

  return (
    <>
      <div className="px-3">
        {/* {detail.station && (
        <div className="relative h-0 text-right text-xs">
          <Tag
            className="!-right-[2px] !-top-[20px] !-translate-y-1/2"
            color="cyan"
          >
            {detail.station}
          </Tag>
        </div>
      )} */}
        {/* <div className="mb-1 text-center text-base font-medium">
        {detail.title}
      </div> */}
        <div className="mb-2 indent-6 text-xs text-gray-400">
          {detail.resume}
        </div>
        <div></div>
      </div>
      {detail.desc && (
        <div className="system-xs-regular whitespace-pre-line break-words px-3 pb-2 pt-1 text-text-tertiary">
          {detail.desc}
        </div>
      )}
      {detail.businessTags && detail.businessTags.length > 0 && (
        <div className="border-t-[1px] border-solid border-gray-200 px-3 pt-2">
          {detail.businessTags.map((tag: string) => {
            const isLongTag = tag.length > TAG_TEXT_MAX_LENGTH;
            const tagElem = (
              <Tag className="mb-1.5" key={tag}>
                {isLongTag ? `${tag.slice(0, TAG_TEXT_MAX_LENGTH)}...` : tag}
              </Tag>
            );
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            );
          })}
        </div>
      )}
    </>
  );
};

export default React.memo(Node);
