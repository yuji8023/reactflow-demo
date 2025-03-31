import React from 'react';
import { Spin } from 'antd';

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <Spin
        size="large"
        tip="加载中..."
        className="flex flex-col gap-4"
        indicator={
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        }
      >
        <span className="text-lg text-gray-600">正在加载，请稍候...</span>
      </Spin>
    </div>
  );
};

export default Loading;
