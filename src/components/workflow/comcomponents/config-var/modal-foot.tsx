'use client';
import type { FC } from 'react';
import React from 'react';
import { Button } from 'antd';

export type IModalFootProps = {
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalFoot: FC<IModalFootProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex justify-end gap-2">
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" onClick={onConfirm}>
        保存
      </Button>
    </div>
  );
};
export default React.memo(ModalFoot);
