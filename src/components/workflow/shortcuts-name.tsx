import { memo } from 'react';
import { getKeyboardKeyNameBySystem } from './utils';
import cn from '@/utils/classnames';

type ShortcutsNameProps = {
  keys: string[];
  className?: string;
};

/* @name ShortcutsName 组件 描述 快捷键名称组合 */
const ShortcutsName = ({ keys, className }: ShortcutsNameProps) => {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {keys.map((key) => (
        <div
          key={key}
          className="system-kbd flex h-4 w-4 items-center justify-center rounded-[4px] bg-components-kbd-bg-gray capitalize"
        >
          {getKeyboardKeyNameBySystem(key)}
        </div>
      ))}
    </div>
  );
};

export default memo(ShortcutsName);
