'use client';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import produce from 'immer';
import InfoItem from './info-item';
import { ChangeType, type MoreInfo } from '../../../types';
import type { InfoItem as InfoItemType } from '../types';
type Props = {
  readonly: boolean;
  list: InfoItemType[];
  onChange: (
    list: InfoItemType[],
    moreInfo?: { index: number; payload: MoreInfo },
  ) => void;
};

const VarList: FC<Props> = ({ readonly, list, onChange }) => {
  const handleVarChange = useCallback(
    (index: number) => {
      return (payload: InfoItemType, moreInfo?: MoreInfo) => {
        const newList = produce(list, (draft) => {
          draft[index] = payload;
        });
        onChange(newList, moreInfo ? { index, payload: moreInfo } : undefined);
      };
    },
    [list, onChange],
  );

  const handleVarRemove = useCallback(
    (index: number) => {
      return () => {
        const newList = produce(list, (draft) => {
          draft.splice(index, 1);
        });
        onChange(newList, {
          index,
          payload: {
            type: ChangeType.remove,
            payload: {
              beforeKey: list[index].info_id,
            },
          },
        });
      };
    },
    [list, onChange],
  );

  if (list.length === 0) {
    return (
      <div className="flex h-[42px] items-center justify-center rounded-md bg-gray-50 text-xs font-normal leading-[18px] text-gray-500">
        配置额外的句柄
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {list.map((item, index) => (
        <InfoItem
          key={index}
          readonly={readonly}
          payload={item}
          onChange={handleVarChange(index)}
          onRemove={handleVarRemove(index)}
        />
      ))}
    </div>
  );
};
export default React.memo(VarList);
