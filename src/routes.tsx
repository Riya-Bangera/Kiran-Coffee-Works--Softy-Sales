import DashboardPage from './pages/DashboardPage';
import MonthlyViewPage from './pages/MonthlyViewPage';
import YearlyViewPage from './pages/YearlyViewPage';
import SettingsPage from './pages/SettingsPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: <DashboardPage />
  },
  {
    name: 'Monthly View',
    path: '/monthly',
    element: <MonthlyViewPage />
  },
  {
    name: 'Yearly View',
    path: '/yearly',
    element: <YearlyViewPage />
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />
  }
];

export default routes;
