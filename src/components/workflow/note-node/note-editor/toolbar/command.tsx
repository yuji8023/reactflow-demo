import { memo, useMemo } from 'react';
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  UnorderedListOutlined,
  StrikethroughOutlined,
} from '@ant-design/icons';
import { useStore } from '../store';
import { useCommand } from './hooks';
import cn from '@/utils/classnames';
// import Tooltip from '@/app/components/base/tooltip'
import { Tooltip } from 'antd';

type CommandProps = {
  type: 'bold' | 'italic' | 'strikethrough' | 'link' | 'bullet';
};
const Command = ({ type }: CommandProps) => {
  const selectedIsBold = useStore((s) => s.selectedIsBold);
  const selectedIsItalic = useStore((s) => s.selectedIsItalic);
  const selectedIsStrikeThrough = useStore((s) => s.selectedIsStrikeThrough);
  const selectedIsLink = useStore((s) => s.selectedIsLink);
  const selectedIsBullet = useStore((s) => s.selectedIsBullet);
  const { handleCommand } = useCommand();

  const icon = useMemo(() => {
    switch (type) {
      case 'bold':
        return (
          <BoldOutlined
            className={cn('h-4 w-4', selectedIsBold && 'text-primary-600')}
          />
        );
      case 'italic':
        return (
          <ItalicOutlined
            className={cn('h-4 w-4', selectedIsItalic && 'text-primary-600')}
          />
        );
      case 'strikethrough':
        return (
          <StrikethroughOutlined
            className={cn(
              'h-4 w-4',
              selectedIsStrikeThrough && 'text-primary-600',
            )}
          />
        );
      case 'link':
        return (
          <LinkOutlined
            className={cn('h-4 w-4', selectedIsLink && 'text-primary-600')}
          />
        );
      case 'bullet':
        return (
          <UnorderedListOutlined
            className={cn('h-4 w-4', selectedIsBullet && 'text-primary-600')}
          />
        );
    }
  }, [
    type,
    selectedIsBold,
    selectedIsItalic,
    selectedIsStrikeThrough,
    selectedIsLink,
    selectedIsBullet,
  ]);

  const tip = useMemo(() => {
    switch (type) {
      case 'bold':
        return '加粗';
      case 'italic':
        return '斜体';
      case 'strikethrough':
        return '删除线';
      case 'link':
        return '链接';
      case 'bullet':
        return '列表';
    }
  }, [type]);

  return (
    <Tooltip title={tip}>
      <div
        className={cn(
          'flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-text-tertiary hover:bg-state-accent-active hover:text-text-accent',
          type === 'bold' && selectedIsBold && 'bg-state-accent-active',
          type === 'italic' && selectedIsItalic && 'bg-state-accent-active',
          type === 'strikethrough' &&
            selectedIsStrikeThrough &&
            'bg-state-accent-active',
          type === 'link' && selectedIsLink && 'bg-state-accent-active',
          type === 'bullet' && selectedIsBullet && 'bg-state-accent-active',
        )}
        onClick={() => handleCommand(type)}
      >
        {icon}
      </div>
    </Tooltip>
  );
};

export default memo(Command);
