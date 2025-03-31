import type { FC, MouseEventHandler } from 'react';
import { memo, useCallback, useMemo, useState } from 'react';
import type { OffsetOptions, Placement } from '@floating-ui/react';
import type { BlockEnum, OnSelectBlock } from '../types';
// import Tabs from './tabs';
import { TabsEnum } from './types';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/components/base/portal-to-follow-elem';
import { Input } from 'antd';
import { PlusCircleFilled, SearchOutlined } from '@ant-design/icons';
import Blocks from './blocks';

type NodeSelectorProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect: OnSelectBlock;
  trigger?: (open: boolean) => React.ReactNode;
  placement?: Placement;
  offset?: OffsetOptions;
  triggerStyle?: React.CSSProperties;
  triggerClassName?: (open: boolean) => string;
  triggerInnerClassName?: string;
  popupClassName?: string;
  asChild?: boolean;
  availableBlocksTypes?: BlockEnum[];
  disabled?: boolean;
  noBlocks?: boolean;
};
const NodeSelector: FC<NodeSelectorProps> = ({
  open: openFromProps,
  onOpenChange,
  onSelect,
  trigger,
  placement = 'right',
  offset = 6,
  triggerClassName,
  triggerInnerClassName,
  triggerStyle,
  popupClassName,
  asChild,
  availableBlocksTypes,
  disabled,
  noBlocks = false,
}) => {
  const [searchText, setSearchText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [localOpen, setLocalOpen] = useState(false);
  const open = openFromProps === undefined ? localOpen : openFromProps;
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setLocalOpen(newOpen);

      if (!newOpen) setSearchText('');

      if (onOpenChange) onOpenChange(newOpen);
    },
    [onOpenChange],
  );
  const handleTrigger = useCallback<MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (disabled) return;
      e.stopPropagation();
      handleOpenChange(!open);
    },
    [handleOpenChange, open, disabled],
  );
  const handleSelect = useCallback<OnSelectBlock>(
    (type, toolDefaultValue) => {
      handleOpenChange(false);
      onSelect(type, toolDefaultValue);
    },
    [handleOpenChange, onSelect],
  );

  const [activeTab, setActiveTab] = useState(
    noBlocks ? TabsEnum.Tools : TabsEnum.Blocks,
  );
  const handleActiveTabChange = useCallback((newActiveTab: TabsEnum) => {
    setActiveTab(newActiveTab);
  }, []);

  return (
    <PortalToFollowElem
      placement={placement}
      offset={offset}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <PortalToFollowElemTrigger
        asChild={asChild}
        onClick={handleTrigger}
        className={triggerInnerClassName}
      >
        {trigger ? (
          trigger(open)
        ) : (
          <div
            className={`
                  z-10 flex h-4 
                  w-4 cursor-pointer items-center justify-center rounded-full bg-components-button-primary-bg text-text-primary-on-surface hover:bg-components-button-primary-bg-hover
                  ${triggerClassName?.(open)}
                `}
            style={triggerStyle}
          >
            <PlusCircleFilled className="h-2.5 w-2.5" />
          </div>
        )}
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent className="z-[1000]">
        <div
          className={`rounded-lg border-[0.5px] border-gray-200 bg-white shadow-lg ${popupClassName}`}
        >
          <div className="px-2 pt-2" onClick={(e) => e.stopPropagation()}>
            {activeTab === TabsEnum.Blocks && (
              <Input
                prefix={<SearchOutlined />}
                allowClear
                autoFocus
                value={searchText}
                placeholder="搜索节点"
                onChange={(e: any) => setSearchText(e.target.value)}
                onClear={() => setSearchText('')}
              />
            )}
          </div>
          {/* <Tabs
            activeTab={activeTab}
            onActiveTabChange={handleActiveTabChange}
            onSelect={handleSelect}
            searchText={searchText}
            tags={tags}
            availableBlocksTypes={availableBlocksTypes}
            noBlocks={noBlocks}
          /> */}
          <Blocks
            searchText={searchText}
            onSelect={onSelect}
            availableBlocksTypes={availableBlocksTypes}
          />
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

export default memo(NodeSelector);
