import type { FC } from 'react';
import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { MiddleNodeType } from './types';
import type { InputVar, NodePanelProps } from '../../types';
import useConfig from './use-config';
import Field from '../_base/components/field';
import InfoList from './components/info-list';

const Panel: FC<NodePanelProps<MiddleNodeType>> = ({ id, data }) => {
  const { readOnly, inputs, handleAddInfo, handleInfoListChange } = useConfig(
    id,
    data,
  );
  return (
    <div className="mt-2">
      <div className="space-y-4 px-4 pb-2">
        <Field
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
        </Field>
      </div>
    </div>
  );
};

export default React.memo(Panel);
