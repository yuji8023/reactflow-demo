'use client';
import type { FC } from 'react';
import React from 'react';
import { useContext } from 'use-context-selector';
import VarReferenceVars from './var-reference-vars';
import type { NodeOutPutVar, ValueSelector, Var } from '../../../../types';
import ListEmpty from '@/components/base/list-empty';

type Props = {
  vars: NodeOutPutVar[];
  popupFor?: 'assigned' | 'toAssigned';
  onChange: (value: ValueSelector, varDetail: Var) => void;
  itemWidth?: number;
  isSupportFileVar?: boolean;
};
const VarReferencePopup: FC<Props> = ({
  vars,
  popupFor,
  onChange,
  itemWidth,
  isSupportFileVar = true,
}) => {
  // max-h-[300px] overflow-y-auto todo: use portal to handle long list
  return (
    <div
      className="space-y-1 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
      style={{
        width: itemWidth || 228,
      }}
    >
      {(!vars || vars.length === 0) && popupFor ? (
        popupFor === 'toAssigned' ? (
          <ListEmpty
            title="没有可用变量"
            description={
              <div className="system-xs-regular text-text-tertiary">
                当前选择的操作没有可用的变量进行赋值。
              </div>
            }
          />
        ) : (
          <ListEmpty
            title="没有可用的赋值变量"
            description={
              <div className="system-xs-regular text-text-tertiary">
                赋值变量必须是可写入的变量，例如：
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-accent-secondary"
                  href="https://docs.dify.ai/guides/workflow/variables#conversation-variables"
                >
                  会话变量
                </a>
              </div>
            }
          />
        )
      ) : (
        <VarReferenceVars
          searchBoxClassName="mt-1"
          vars={vars}
          onChange={onChange}
          itemWidth={itemWidth}
          isSupportFileVar={isSupportFileVar}
        />
      )}
    </div>
  );
};
export default React.memo(VarReferencePopup);
