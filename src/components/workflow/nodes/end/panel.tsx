import type { FC } from 'react';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import useConfig from './use-config';
import type { EndNodeType } from './types';
import VarList from '../_base/components/variable/var-list';
import Field from '../_base/components/field';
// import AddButton from '@/app/components/base/button/add-button'
import type { NodePanelProps } from '../../types';

const Panel: FC<NodePanelProps<EndNodeType>> = ({ id, data }) => {
  const { readOnly, inputs, handleVarListChange, handleAddVariable } =
    useConfig(id, data);

  const outputs = inputs.outputs;
  return (
    <div className="mt-2">
      <div className="h-8 w-full text-center text-gray-500">结束流程节点</div>
      {/* <div className="space-y-4 px-4 pb-4">
        <Field
          title="输出变量"
          operations={
            !readOnly ? (
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={handleAddVariable}
              />
            ) : undefined
          }
        >
          <VarList
            nodeId={id}
            readonly={readOnly}
            list={outputs}
            onChange={handleVarListChange}
          />
        </Field>
      </div> */}
    </div>
  );
};

export default React.memo(Panel);
