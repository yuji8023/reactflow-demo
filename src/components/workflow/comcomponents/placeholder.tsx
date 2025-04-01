import { memo } from 'react';
import cn from '@/utils/classnames';

const Placeholder = ({
  compact,
  value,
  className,
}: {
  compact?: boolean;
  value?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        className,
        'pointer-events-none absolute left-0 top-0 h-full w-full select-none text-sm text-components-input-text-placeholder',
        compact ? 'text-[13px] leading-5' : 'text-sm leading-6',
      )}
    >
      {value || "在这里写你的提示词，输入'{' 插入变量、输入'/' 插入提示内容块"}
    </div>
  );
};

/** @name 占位符 */
export default memo(Placeholder);
