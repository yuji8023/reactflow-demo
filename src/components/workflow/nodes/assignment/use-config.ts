import { useCallback } from 'react';
import produce from 'immer';
import { v4 as uuid4 } from 'uuid';
import type { AssignmentNodeType, DetailType } from './types';
import { ChangeType } from '../../types';
import type { MoreInfo } from '../../types';
import useNodeCrud from '../_base/hooks/use-node-crud';
import { useNodesReadOnly } from '../../hooks';

const useConfig = (id: string, payload: AssignmentNodeType) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly();
  const { inputs, setInputs } = useNodeCrud<AssignmentNodeType>(id, payload);

  const handleInfoListChange = useCallback(
    (
      newDetail: DetailType,
      moreInfo?: { index: number; payload: MoreInfo },
    ) => {
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
        draft.detail = newDetail;
      });
      setInputs(newInputs);
    },
    [id, inputs, setInputs],
  );

  const handleAddInfo = useCallback(() => {
    /* const newInputs = produce(inputs, (draft: AssignmentNodeType) => {
      if (draft.infos) {
        const info_id = uuid4();
        draft.infos.push({
          info_id,
          content: `#${draft.infos.length + 1} 句柄`,
        });
        if (draft._targetBranches) {
          draft._targetBranches.push({
            id: info_id,
            name: `句柄 ${draft.infos.length + 1}`,
          });
        }
      }
    });
    setInputs(newInputs); */
  }, [inputs, setInputs]);
  return {
    readOnly,
    inputs,
    handleInfoListChange,
    handleAddInfo,
  };
};

export default useConfig;
