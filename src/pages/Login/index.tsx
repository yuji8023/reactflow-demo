import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React from 'react';

type FieldType = {
  username?: string;
  password?: string;
};

const LoginPage: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-96 rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          系统登录
        </h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="space-y-6"
        >
          <Form.Item<FieldType>
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-300" />}
              placeholder="用户名"
              className="py-2"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-300" />}
              placeholder="密码"
              className="py-2"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
