import type { FC } from 'react';
import React, { useRef } from 'react';
import { Button, Input } from 'antd';
import { useHover } from 'ahooks';
import { PlusOutlined } from '@ant-design/icons';
import InputVarTypeIcon from '../_base/components/input-var-type-icon';
import { InputVarType } from '../../types';
import type { AssignmentNodeType } from './types';
import type { InputVar, NodePanelProps, MoreInfo } from '../../types';
import useConfig from './use-config';
import Field from '../_base/components/field';

const Panel: FC<NodePanelProps<AssignmentNodeType>> = ({ id, data }) => {
  const ref = useRef(null);
  const isHovering = useHover(ref);
  const { readOnly, inputs, handleAddInfo, handleInfoListChange } = useConfig(
    id,
    data,
  );
  const { detail } = inputs;
  return (
    <div className="mt-2">
      <div className="space-y-4 px-4 pb-2">
        <Field title="岗位">
          <div
            ref={ref}
            className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white pr-2.5 shadow-xs hover:shadow-md"
          >
            <div className="flex w-0 grow items-center space-x-1">
              <Input
                className="bg-components-input-bg-normal"
                value={detail.station}
                onChange={(e) =>
                  handleInfoListChange({ ...detail, station: e.target.value })
                }
                bordered={false}
                allowClear
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
        <Field title="作业标题">
          <div
            ref={ref}
            className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white pr-2.5 shadow-xs hover:shadow-md"
          >
            <div className="flex w-0 grow items-center space-x-1">
              <Input
                className="bg-components-input-bg-normal"
                value={detail.title}
                onChange={(e) =>
                  handleInfoListChange({ ...detail, title: e.target.value })
                }
                bordered={false}
                allowClear
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
        <Field title="作业简述">
          <div
            ref={ref}
            className="flex min-h-8 cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white pr-2.5 shadow-xs hover:shadow-md"
          >
            <div className="flex w-0 grow items-center space-x-1">
              <Input.TextArea
                className="bg-components-input-bg-normal"
                value={detail.resume}
                onChange={(e) =>
                  handleInfoListChange({
                    ...detail,
                    resume: e.target.value,
                  })
                }
                bordered={false}
                autoSize
                allowClear
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
