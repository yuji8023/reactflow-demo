import { useCallback } from 'react';
import produce from 'immer';
import { v4 as uuid4 } from 'uuid';
import type { MiddleNodeType, InfoItem } from './types';
import { ChangeType } from '../../types';
import type { MoreInfo } from '../../types';
import useNodeCrud from '../_base/hooks/use-node-crud';
import { useNodesReadOnly } from '../../hooks';

const useConfig = (id: string, payload: MiddleNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly();
  const { inputs, setInputs } = useNodeCrud<MiddleNodeType>(id, payload);

  const handleInfoListChange = useCallback(
    (newList: InfoItem[], moreInfo?: { index: number; payload: MoreInfo }) => {
      if (moreInfo?.payload?.type === ChangeType.remove) {
        // TODO 删除变量时，如果变量已经有连接线，删除连接线
        /* if (
          isVarUsedInNodes([id, moreInfo?.payload?.payload?.beforeKey || ''])
        ) {
          showRemoveVarConfirm();
          setRemovedVar([id, moreInfo?.payload?.payload?.beforeKey || '']);
          setRemoveIndex(moreInfo?.index as number);
          return;
        } */
      }

      const newInputs = produce(inputs, (draft: any) => {
        draft.infos = newList;
      });
      setInputs(newInputs);
    },
    [id, inputs, setInputs],
  );

  const handleAddInfo = useCallback(() => {
    const newInputs = produce(inputs, (draft: MiddleNodeType) => {
      if (draft.infos) {
        const info_id = uuid4();
        draft.infos.push({
          info_id,
          content: `#${draft.infos.length + 1} 句柄`,
        });
      }
    });
    setInputs(newInputs);
  }, [inputs, setInputs]);
  return {
    readOnly,
    inputs,
    handleInfoListChange,
    handleAddInfo,
  };
};

export default useConfig;
