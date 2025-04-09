'use client';
import type { FC } from 'react';
import React from 'react';
import cn from '@/utils/classnames';
import type { InputVarType } from '@/components/workflow/types';
import { InputVarType as varTypeMap } from '@/components/workflow/types';
import InputVarTypeIcon from '@/components/workflow/nodes/_base/components/input-var-type-icon';
export type ISelectTypeItemProps = {
  type: InputVarType;
  selected: boolean;
  onClick: () => void;
};

const fileTypeMap: Record<string, string> = {
  file: '单文件',
  'file-list': '文件列表',
  [varTypeMap.textInput]: '文本',
  [varTypeMap.paragraph]: '段落',
  [varTypeMap.number]: '数字',
  [varTypeMap.select]: '下拉框',
};

const SelectTypeItem: FC<ISelectTypeItemProps> = ({
  type,
  selected,
  onClick,
}) => {
  const typeName = fileTypeMap[type] || type;

  return (
    <div
      className={cn(
        'flex h-[58px] flex-col items-center justify-center space-y-1 rounded-lg border border-components-option-card-option-border bg-components-option-card-option-bg text-text-secondary',
        selected
          ? 'system-xs-medium border-[1.5px] border-components-option-card-option-selected-border bg-components-option-card-option-selected-bg shadow-xs'
          : ' system-xs-regular cursor-pointer hover:border-components-option-card-option-border-hover hover:bg-components-option-card-option-bg-hover hover:shadow-xs',
      )}
      onClick={onClick}
    >
      <div className="shrink-0">
        <InputVarTypeIcon type={type} className="h-5 w-5" />
      </div>
      <span>{typeName}</span>
    </div>
  );
};
export default React.memo(SelectTypeItem);
