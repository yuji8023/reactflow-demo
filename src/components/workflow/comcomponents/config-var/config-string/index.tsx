'use client';
import type { FC } from 'react';
import React, { useEffect } from 'react';
import { InputNumber } from 'antd';

export type IConfigStringProps = {
  value: number | undefined;
  maxLength: number;
  modelId?: string;
  onChange: (value: number | undefined) => void;
};

const ConfigString: FC<IConfigStringProps> = ({
  value,
  onChange,
  maxLength,
}) => {
  useEffect(() => {
    if (value && value > maxLength) onChange(maxLength);
  }, [value, maxLength, onChange]);

  return (
    <div>
      <InputNumber
        max={maxLength}
        min={1}
        value={value || null}
        onChange={(value: number | null) => {
          if (value && value > maxLength) value = maxLength;
          else if (value && value < 1) value = 1;

          onChange(value || undefined);
        }}
      />
    </div>
  );
};

export default React.memo(ConfigString);
