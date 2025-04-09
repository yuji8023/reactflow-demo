'use client';
import type { FC } from 'react';
import React, { useCallback, useRef } from 'react';
import { useBoolean, useHover } from 'ahooks';
// import {
//   RiDeleteBinLine,
// } from '@remixicon/react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import InputVarTypeIcon from '../../_base/components/input-var-type-icon';
import type { InputVar, MoreInfo } from '../../../types';
import { VariableX } from '../../../icons';
// import { Edit03 } from '@/app/components/base/icons/src/vender/solid/general';
// import Badge from '@/app/components/base/badge';
// import ConfigVarModal from '@/app/components/app/configuration/config-var/config-modal';
import ConfigVarModal from '../../../comcomponents/config-var/config-modal';

type Props = {
  readonly: boolean;
  payload: InputVar;
  onChange?: (item: InputVar, moreInfo?: MoreInfo) => void;
  onRemove?: () => void;
  rightContent?: React.JSX.Element;
  varKeys?: string[];
  showLegacyBadge?: boolean;
};

const VarItem: FC<Props> = ({
  readonly,
  payload,
  onChange = () => {},
  onRemove = () => {},
  rightContent,
  varKeys = [],
  showLegacyBadge = false,
}) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const [
    isShowEditVarModal,
    { setTrue: showEditVarModal, setFalse: hideEditVarModal },
  ] = useBoolean(false);

  const handlePayloadChange = useCallback(
    (payload: InputVar, moreInfo?: MoreInfo) => {
      onChange(payload, moreInfo);
      hideEditVarModal();
    },
    [onChange, hideEditVarModal],
  );
  return (
    <div
      ref={ref}
      className="flex h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white px-2.5 shadow-xs hover:shadow-md"
    >
      <div className="flex w-0 grow items-center space-x-1">
        <VariableX className="mt-0.5 h-3.5 w-3.5 text-primary-500" />
        <div
          title={payload.variable}
          className="max-w-[130px] shrink-0 truncate text-[13px] font-medium text-gray-700"
        >
          {payload.variable}
        </div>
        {payload.label && (
          <>
            <div className="shrink-0 text-xs font-medium text-gray-400">·</div>
            <div
              title={payload.label as string}
              className="max-w-[130px] truncate text-[13px] font-medium text-gray-500"
            >
              {payload.label as string}
            </div>
          </>
        )}
        {showLegacyBadge && (
          <Tag
            color="magenta"
            className="shrink-0 border-text-accent-secondary text-text-accent-secondary"
          >
            复数
          </Tag>
        )}
      </div>
      <div className="ml-2 flex shrink-0 items-center">
        {rightContent || (
          <>
            {!isHovering || readonly ? (
              <>
                {payload.required && (
                  <div className="mr-2 text-xs font-normal text-gray-500">
                    必填
                  </div>
                )}
                <InputVarTypeIcon
                  type={payload.type}
                  className="h-3.5 w-3.5 text-gray-500"
                />
              </>
            ) : (
              !readonly && (
                <>
                  <div
                    onClick={showEditVarModal}
                    className="mr-1 cursor-pointer rounded-md p-1 hover:bg-black/5"
                  >
                    <div className="h-4 w-4 text-center text-gray-500">
                      <EditOutlined style={{ verticalAlign: 'text-top' }} />
                    </div>
                  </div>
                  <div
                    onClick={onRemove}
                    className="cursor-pointer rounded-md p-1 hover:bg-black/5"
                  >
                    <div className="h-4 w-4 text-center text-gray-500">
                      <DeleteOutlined style={{ verticalAlign: 'text-top' }} />
                    </div>
                  </div>
                </>
              )
            )}
          </>
        )}
      </div>
      {isShowEditVarModal && (
        <ConfigVarModal
          isShow
          supportFile
          payload={payload}
          onClose={hideEditVarModal}
          onConfirm={handlePayloadChange}
          varKeys={varKeys}
        />
      )}
    </div>
  );
};
export default React.memo(VarItem);
