import { Card, Col, Progress, Row, Statistic } from 'antd';
import { useState } from 'react';

const Dashboard = () => {
  // 模拟统计数据
  const [stats] = useState([
    { title: '总访问量', value: 5689, color: '#1890ff' },
    { title: '活跃用户', value: 2345, color: '#52c41a' },
    { title: '新增用户', value: 167, color: '#faad14' },
    { title: '转化率', value: 82, suffix: '%', color: '#722ed1' },
  ]);

  // 模拟任务进度数据
  const [tasks] = useState([
    { name: '项目完成度', percent: 65, color: '#1890ff' },
    { name: '文档完善度', percent: 45, color: '#52c41a' },
    { name: '测试覆盖率', percent: 78, color: '#faad14' },
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* 统计卡片区域 */}
      <Row gutter={16} className="mb-6">
        {stats.map((item, index) => (
          <Col span={6} key={index}>
            <Card className="transition-shadow duration-300 hover:shadow-lg">
              <Statistic
                title={<span className="text-gray-600">{item.title}</span>}
                value={item.value}
                suffix={item.suffix}
                valueStyle={{ color: item.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* 进度展示区域 */}
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">任务进度</h2>
        <Row gutter={32}>
          {tasks.map((task, index) => (
            <Col span={8} key={index}>
              <div className="text-center">
                <Progress
                  type="dashboard"
                  percent={task.percent}
                  strokeColor={task.color}
                  className="mb-2"
                />
                <span className="text-gray-600">{task.name}</span>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 快速导航卡片 */}
      <Card
        title="快捷操作"
        className="shadow-sm"
        headStyle={{ borderBottom: 0 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <div className="cursor-pointer rounded-md bg-blue-50 p-4 transition-colors hover:bg-blue-100">
              <h3 className="mb-2 font-medium text-blue-600">新建项目</h3>
              <p className="text-sm text-gray-600">创建新的项目计划</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="cursor-pointer rounded-md bg-green-50 p-4 transition-colors hover:bg-green-100">
              <h3 className="mb-2 font-medium text-green-600">数据报表</h3>
              <p className="text-sm text-gray-600">查看业务数据报表</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="cursor-pointer rounded-md bg-purple-50 p-4 transition-colors hover:bg-purple-100">
              <h3 className="mb-2 font-medium text-purple-600">消息中心</h3>
              <p className="text-sm text-gray-600">查看未读消息</p>
            </div>
          </Col>
          <Col span={6}>
            <div className="cursor-pointer rounded-md bg-orange-50 p-4 transition-colors hover:bg-orange-100">
              <h3 className="mb-2 font-medium text-orange-600">系统设置</h3>
              <p className="text-sm text-gray-600">管理系统配置</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Dashboard;
