// src/routes/index.tsx
import { lazy, Suspense } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import Loading from '@/components/Loading';

// 懒加载页面
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Workflow = lazy(() => import('@/pages/Workflow'));
const Login = lazy(() => import('@/pages/Login'));

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'workflow',
        element: (
          <Suspense fallback={<Loading />}>
            <Workflow />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  { path: '*', element: <Navigate to="/login" replace /> },
];
