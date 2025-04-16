import { useCallback } from 'react';
import produce from 'immer';
import { v4 as uuid4 } from 'uuid';
import type { MiddleNodeType, InfoItem } from './types';
import { ChangeType } from '../../types';
import type { MoreInfo } from '../../types';
import useNodeCrud from '../_base/hooks/use-node-crud';
import { useNodesReadOnly } from '../../hooks';
import { branchNameCorrect } from './utils';

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
        if (
          moreInfo?.payload?.type === ChangeType.remove &&
          draft._targetBranches
        ) {
          draft._targetBranches = branchNameCorrect(
            draft._targetBranches.filter(
              (branch: any) =>
                branch.id !== moreInfo?.payload?.payload?.beforeKey,
            ),
          );
        }

        draft.infos = newList;
      });
      setInputs(newInputs);
    },
    [id, inputs, setInputs],
  );

  const handleConditionContentChange = useCallback(
    (value: string) => {
      const newInputs = produce(inputs, (draft: any) => {
        draft.conditionContent = value;
      });
      setInputs(newInputs);
    },
    [inputs, setInputs],
  );

  const handleAddInfo = useCallback(() => {
    const newInputs = produce(inputs, (draft: MiddleNodeType) => {
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
          // const elseCaseIndex = draft._targetBranches.findIndex(branch => branch.id === 'false')
          /* if (elseCaseIndex > -1) {
            draft._targetBranches = branchNameCorrect([
              ...draft._targetBranches.slice(0, elseCaseIndex),
              {
                id: case_id,
                name: '',
              },
              ...draft._targetBranches.slice(elseCaseIndex),
            ])
          } */
        }
      }
    });
    setInputs(newInputs);
  }, [inputs, setInputs]);
  return {
    readOnly,
    inputs,
    handleInfoListChange,
    handleConditionContentChange,
    handleAddInfo,
  };
};

export default useConfig;
