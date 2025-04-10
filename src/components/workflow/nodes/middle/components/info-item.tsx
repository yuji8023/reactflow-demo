'use client';
import type { FC } from 'react';
import React, { useCallback, useRef } from 'react';
import { useHover } from 'ahooks';
import { DeleteOutlined } from '@ant-design/icons';
import InputVarTypeIcon from '../../_base/components/input-var-type-icon';
import type { InputVar, MoreInfo } from '../../../types';
import { InputVarType } from '../../../types';
import { type InfoItem as InfoItemType } from '../types';
import { Input } from 'antd';

type Props = {
  readonly: boolean;
  payload: InfoItemType;
  onChange?: (item: InfoItemType, moreInfo?: MoreInfo) => void;
  onRemove?: () => void;
  rightContent?: React.JSX.Element;
  showLegacyBadge?: boolean;
};

const InfoItem: FC<Props> = ({
  readonly,
  payload,
  onChange = () => {},
  onRemove = () => {},
  rightContent,
}) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);

  const handlePayloadChange = useCallback(
    (payload: InfoItemType, moreInfo?: MoreInfo) => {
      onChange(payload, moreInfo);
    },
    [onChange],
  );
  return (
    <div
      ref={ref}
      className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white pr-2.5 shadow-xs hover:shadow-md"
    >
      <div className="flex w-0 grow items-center space-x-1">
        <Input.TextArea
          onChange={(e) =>
            handlePayloadChange({ ...payload, content: e.target.value })
          }
          className="shrink-0 text-[13px] font-medium text-gray-700"
          placeholder="输入解释"
          autoSize
          bordered={false}
          value={payload.content}
        />
      </div>
      <div className="ml-2 flex shrink-0 items-center">
        {rightContent || (
          <>
            {!isHovering || readonly ? (
              <InputVarTypeIcon
                type={InputVarType.textInput}
                className="h-3.5 w-3.5 text-gray-500"
              />
            ) : (
              !readonly && (
                <>
                  <div
                    onClick={onRemove}
                    className="cursor-pointer rounded-md hover:bg-black/5"
                  >
                    <div className="h-3.5 w-3.5 text-center text-gray-500">
                      <DeleteOutlined style={{ verticalAlign: 'text-top' }} />
                    </div>
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default React.memo(InfoItem);
