import type { FC } from 'react';
import React from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { MiddleNodeType } from './types';
import type { InputVar, NodePanelProps } from '../../types';
import useConfig from './use-config';
import Field from '../_base/components/field';
import InfoList from './components/info-list';
import InputVarTypeIcon from '../_base/components/input-var-type-icon';
import { InputVarType } from '../../types';

const Panel: FC<NodePanelProps<MiddleNodeType>> = ({ id, data }) => {
  const {
    readOnly,
    inputs,
    handleAddInfo,
    handleInfoListChange,
    handleConditionContentChange,
  } = useConfig(id, data);
  return (
    <div className="mt-2">
      <div className="space-y-4 px-4 pb-2">
        {/* <Field
          title="额外句柄"
          operations={
            !readOnly ? (
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleAddInfo}
              />
            ) : undefined
          }
        >
          <>
            <InfoList
              readonly={readOnly}
              list={inputs.infos || []}
              onChange={handleInfoListChange}
            />
          </>
        </Field> */}
        <Field title="描述">
          <div className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white pr-2.5 shadow-xs hover:shadow-md">
            <div className="flex w-0 grow items-center space-x-1">
              <Input.TextArea
                className="bg-components-input-bg-normal"
                value={inputs.conditionContent}
                onChange={(e) => handleConditionContentChange(e.target.value)}
                bordered={false}
                allowClear
                autoSize
              />
            </div>
            <div className="ml-2 flex shrink-0 items-center">
              <InputVarTypeIcon
                type={InputVarType.textInput}
                className="h-3.5 w-3.5 text-gray-500"
              />
            </div>
          </div>
        </Field>
      </div>
    </div>
  );
};

export default React.memo(Panel);
