'use client';

import { useState } from 'react';
import { Layout, Menu, Divider, Button } from 'antd';
import {
  ProjectOutlined,
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import DashboardSiderHeader from '@/components/common/DashboardSiderHeader';

const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: '/dashboard/project-management',
      icon: <ProjectOutlined />,
      label: 'Project Management',
    },
    {
      key: '/dashboard/section-management',
      icon: <AppstoreOutlined />,
      label: 'Section Management',
    },
  ];

  const handleMenuClick = (e) => {
    router.push(e.key);
  };

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="md"
        collapsedWidth={50}
        collapsible
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
        trigger={null}
        width={300}
        className="custom-scrollbar bg-sider shadow sticky top-0 h-screen overflow-y-auto"
      >
        <div className="relative flex items-center justify-center h-16">
          {!collapsed && (
            <Image
              src="/images/landing-template.png"
              alt="Logo"
              width={150}
              height={50}
              priority
              className="rounded-md"
            />
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-1/2 right-0 -translate-y-1/2 h-10 w-10 text-xl"
          />
        </div>

        <Divider className="my-0" />

        <Menu
          mode="inline"
          selectedKeys={[
            pathname.startsWith('/dashboard/section-templates')
              ? '/dashboard/section-templates'
              : '/dashboard/projects',
          ]}
          items={menuItems}
          onClick={handleMenuClick}
          className="border-0"
        />
      </Sider>

      {/* Main Layout */}
      <Layout>
        <Header className="bg-white border-b border-gray-200 px-6 flex items-center justify-between h-16">
          <DashboardSiderHeader />
        </Header>

        <Content className="m-4 bg-white rounded-lg shadow-sm p-6 overflow-auto">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
