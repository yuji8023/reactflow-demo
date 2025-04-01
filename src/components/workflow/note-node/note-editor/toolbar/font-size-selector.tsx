import { memo } from 'react';
import { useFontSize } from './hooks';
import cn from '@/utils/classnames';
import {
  PortalToFollowElem,
  PortalToFollowElemContent,
  PortalToFollowElemTrigger,
} from '@/components/base/portal-to-follow-elem';
import { CheckOutlined, FontSizeOutlined } from '@ant-design/icons';

const FontSizeSelector = () => {
  const FONT_SIZE_LIST = [
    {
      key: '12px',
      value: '小',
    },
    {
      key: '14px',
      value: '中',
    },
    {
      key: '16px',
      value: '大',
    },
  ];
  const {
    fontSizeSelectorShow,
    handleOpenFontSizeSelector,
    fontSize,
    handleFontSize,
  } = useFontSize();

  return (
    <PortalToFollowElem
      open={fontSizeSelectorShow}
      onOpenChange={handleOpenFontSizeSelector}
      placement="bottom-start"
      offset={2}
    >
      <PortalToFollowElemTrigger
        onClick={() => handleOpenFontSizeSelector(!fontSizeSelectorShow)}
      >
        <div
          className={cn(
            'flex h-8 cursor-pointer items-center rounded-md pl-2 pr-1.5 text-[13px] font-medium text-text-tertiary hover:bg-state-base-hover hover:text-text-secondary',
            fontSizeSelectorShow && 'bg-state-base-hover text-text-secondary',
          )}
        >
          <FontSizeOutlined className="mr-1 h-4 w-4" />
          {FONT_SIZE_LIST.find((font) => font.key === fontSize)?.value || '小'}
        </div>
      </PortalToFollowElemTrigger>
      <PortalToFollowElemContent>
        <div className="w-[120px] rounded-md border-[0.5px] border-components-panel-border bg-components-panel-bg-blur p-1 text-text-secondary shadow-xl">
          {FONT_SIZE_LIST.map((font) => (
            <div
              key={font.key}
              className="flex h-8 cursor-pointer items-center justify-between rounded-md pl-3 pr-2 hover:bg-state-base-hover"
              onClick={(e) => {
                e.stopPropagation();
                handleFontSize(font.key);
                handleOpenFontSizeSelector(false);
              }}
            >
              <div style={{ fontSize: font.key }}>{font.value}</div>
              {fontSize === font.key && (
                <CheckOutlined className="h-4 w-4 text-text-accent" />
              )}
            </div>
          ))}
        </div>
      </PortalToFollowElemContent>
    </PortalToFollowElem>
  );
};

export default memo(FontSizeSelector);
