import type { FC } from 'react';
import { memo } from 'react';
import { BlockEnum } from '../types';
import { Home, End } from './nodes';

type BlockIconProps = {
  type: BlockEnum;
  size?: string;
  className?: string;
  toolIcon?: string | { content: string; background: string };
};
const ICON_CONTAINER_CLASSNAME_SIZE_MAP: Record<string, string> = {
  xs: 'w-4 h-4 rounded-[5px] shadow-xs',
  sm: 'w-5 h-5 rounded-md shadow-xs',
  md: 'w-6 h-6 rounded-lg shadow-md',
};
const getIcon = (type: BlockEnum, className: string) => {
  return {
    [BlockEnum.Start]: <Home className={className} />,
    [BlockEnum.End]: <End className={className} />,
  }[type];
};
const ICON_CONTAINER_BG_COLOR_MAP: Record<string, string> = {
  [BlockEnum.Start]: 'bg-util-colors-blue-brand-blue-brand-500',
  [BlockEnum.End]: 'bg-util-colors-warning-warning-500',
};
const BlockIcon: FC<BlockIconProps> = ({
  type,
  size = 'sm',
  className,
  toolIcon,
}) => {
  return (
    <div
      className={`
      flex items-center justify-center border-[0.5px] border-white/2 text-white
      ${ICON_CONTAINER_CLASSNAME_SIZE_MAP[size]}
      ${ICON_CONTAINER_BG_COLOR_MAP[type]}
      ${toolIcon && '!shadow-none'}
      ${className}
    `}
    >
      {getIcon(type, size === 'xs' ? 'w-3 h-3' : 'w-3.5 h-3.5')}
    </div>
  );
};

export const VarBlockIcon: FC<BlockIconProps> = ({ type, className }) => {
  return <>{getIcon(type, `w-3 h-3 ${className}`)}</>;
};

export default memo(BlockIcon);
