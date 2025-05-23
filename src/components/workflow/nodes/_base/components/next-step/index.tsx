import { memo, useMemo } from 'react';
import {
  getConnectedEdges,
  getOutgoers,
  useEdges,
  useStoreApi,
} from 'reactflow';
import BlockIcon from '../../../../icons/block-icon';
import type { Node } from '../../../../types';
// import { BlockEnum } from '../../../../types';
import Line from './line';
import Container from './container';
import { hasErrorHandleNode } from '../../../../utils';
import { ErrorHandleTypeEnum } from '../error-handle/types';

type NextStepProps = {
  selectedNode: Node;
};
const NextStep = ({ selectedNode }: NextStepProps) => {
  const data = selectedNode.data;
  const store = useStoreApi();
  const branches = useMemo(() => {
    return data._targetBranches || [];
  }, [data]);
  const edges = useEdges();
  const outgoers = getOutgoers(
    selectedNode as Node,
    store.getState().getNodes(),
    edges,
  );
  const connectedEdges = getConnectedEdges(
    [selectedNode] as Node[],
    edges,
  ).filter((edge) => edge.source === selectedNode!.id);

  const list = useMemo(() => {
    let items = [];
    if (branches?.length) {
      items = branches.map((branch, index) => {
        const connected = connectedEdges.filter(
          (edge) => edge.sourceHandle === branch.id,
        );
        const nextNodes = connected.map(
          (edge) => outgoers.find((outgoer) => outgoer.id === edge.target)!,
        );

        return {
          branch: {
            ...branch,
            // name: data.type === BlockEnum.QuestionClassifier ? `分类 ${index + 1}` : branch.name,
            name: branch.name,
          },
          nextNodes,
        };
      });
    } else {
      const connected = connectedEdges.filter(
        (edge) => edge.sourceHandle === 'source',
      );
      const nextNodes = connected.map(
        (edge) => outgoers.find((outgoer) => outgoer.id === edge.target)!,
      );

      items = [
        {
          branch: {
            id: '',
            name: '',
          },
          nextNodes,
        },
      ];

      if (
        data.error_strategy === ErrorHandleTypeEnum.failBranch &&
        hasErrorHandleNode(data.type)
      ) {
        const connected = connectedEdges.filter(
          (edge) => edge.sourceHandle === ErrorHandleTypeEnum.failBranch,
        );
        const nextNodes = connected.map(
          (edge) => outgoers.find((outgoer) => outgoer.id === edge.target)!,
        );

        items.push({
          branch: {
            id: ErrorHandleTypeEnum.failBranch,
            name: '异常时',
          },
          nextNodes,
        });
      }
    }

    return items;
  }, [branches, connectedEdges, data.error_strategy, data.type, outgoers]);

  return (
    <div className="flex py-1">
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[0.5px] border-divider-regular bg-background-default shadow-xs">
        <BlockIcon type={selectedNode!.data.type} />
      </div>
      <Line
        list={list.length ? list.map((item) => item.nextNodes.length + 1) : [1]}
      />
      <div className="grow space-y-2">
        {list.map((item, index) => {
          return (
            <Container
              key={index}
              nodeId={selectedNode!.id}
              nodeData={selectedNode!.data}
              sourceHandle={item.branch.id}
              nextNodes={item.nextNodes}
              branchName={item.branch.name}
              isFailBranch={item.branch.id === ErrorHandleTypeEnum.failBranch}
            />
          );
        })}
      </div>
    </div>
  );
};

/** @name 下一步 */
export default memo(NextStep);
