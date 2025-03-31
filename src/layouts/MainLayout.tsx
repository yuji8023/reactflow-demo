import React from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Outlet, Link } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const menuItems = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: <Link to="/dashboard">首页</Link>,
  },
  {
    key: '2',
    icon: <VideoCameraOutlined />,
    label: <Link to="/workflow">工作流</Link>,
  },
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 左侧边栏 */}
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="logo"
          style={{
            height: '32px',
            margin: '16px',
            background: 'rgba(255, 255, 255, 0.3)',
          }}
        />
        <Menu
          theme="dark"
          items={menuItems}
          mode="inline"
          defaultSelectedKeys={['1']}
        ></Menu>
      </Sider>

      <Layout className="site-layout" style={{ background: '#fff' }}>
        {/* 顶部导航栏 */}
        <Header className="" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger text-white',
              onClick: () => setCollapsed(!collapsed),
            },
          )}
        </Header>

        {/* 主要内容区域 */}
        <Content
          style={{
            margin: 0,
            padding: 0,
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
