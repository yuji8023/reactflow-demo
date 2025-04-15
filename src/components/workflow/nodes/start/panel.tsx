import type { FC } from 'react';
import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
// import RemoveEffectVarConfirm from '../_base/components/remove-effect-var-confirm';
import VarList from './components/var-list';
import VarItem from './components/var-item';
import useConfig from './use-config';
import type { StartNodeType } from './types';
import Split from '../../comcomponents/split';
import Field from '../_base/components/field';
import ConfigVarModal from '../../comcomponents/config-var/config-modal';
import type { InputVar, NodePanelProps } from '../../types';

const Panel: FC<NodePanelProps<StartNodeType>> = ({ id, data }) => {
  const {
    readOnly,
    isChatMode,
    inputs,
    isShowAddVarModal,
    showAddVarModal,
    handleAddVariable,
    hideAddVarModal,
    handleVarListChange,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm,
  } = useConfig(id, data);

  const handleAddVarConfirm = (payload: InputVar) => {
    handleAddVariable(payload);
    hideAddVarModal();
  };

  return (
    <div className="mt-2">
      <div className="h-8 w-full text-center text-gray-500">开始流程节点</div>
      {/* <div className="space-y-4 px-4 pb-2">
        <Field
          title="输入字段"
          operations={
            !readOnly ? (
              <Button
                type="text"
                icon={<PlusOutlined />}
                onClick={showAddVarModal}
              />
            ) : undefined
          }
        >
          <>
            <VarList
              readonly={readOnly}
              list={inputs.variables || []}
              onChange={handleVarListChange}
            />

            <div className="mt-1 space-y-1">
              <Split className="my-2" />
            </div>
          </>
        </Field>
      </div>

      {isShowAddVarModal && (
        <ConfigVarModal
          isCreate
          supportFile={false}
          isShow={isShowAddVarModal}
          onClose={hideAddVarModal}
          onConfirm={handleAddVarConfirm}
          varKeys={inputs.variables.map((v) => v.variable)}
        />
      )} */}
    </div>
  );
};

export default React.memo(Panel);
