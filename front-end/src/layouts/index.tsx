import { Outlet } from 'umi';
// import { Switch } from 'antd';
// import { useTheme } from '@/hooks/useTheme';

export default function Layout() {
  // const { theme, setTheme } = useTheme();

  return (
    <div>
      <Outlet />
    </div>
  );
}
