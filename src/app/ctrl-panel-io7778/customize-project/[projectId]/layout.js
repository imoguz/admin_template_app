'use client';

import { useState } from 'react';
import { Layout, Divider, Button, Spin } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import CustomizeSiderHeader from '@/components/common/CustomizeSiderHeader';
import { useGetProjectQuery } from '@/rtk/api/projectApi';
import SectionManager from '@/components/section-management/SectionManager';

const { Header, Content, Sider } = Layout;

export default function CustomizeLayout({ children, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const projectId = params.projectId;

  // Active sectionId
  const pathParts = pathname.split('/').filter(Boolean);
  const sectionId =
    pathParts[pathParts.length - 1] === projectId
      ? null
      : pathParts[pathParts.length - 1];

  const [collapsed, setCollapsed] = useState(false);

  // Project detail
  const { data, isLoading, isError } = useGetProjectQuery(projectId);
  const project = data?.data;
  const sections = project?.sections ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-500">
        Failed to load project.
      </div>
    );
  }

  const selectedSection = sections.find((s) => s._id === sectionId) || null;

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
        <div className="relative flex items-center justify-center h-16 cursor-pointer">
          {!collapsed && (
            <Image
              src="/images/logo.svg"
              alt="Logo"
              width={132}
              height={28}
              priority
            />
          )}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="absolute top-1/2 right-0 -translate-y-1/2 h-10 w-10 text-xl"
          />
        </div>

        <Divider className="border-gray-200 my-2" />

        <SectionManager
          sections={sections}
          projectId={projectId}
          collapsed={collapsed}
          sectionId={sectionId}
        />
      </Sider>

      <Layout>
        <Header
          className={`sticky top-0 bg-sider shadow-sm border-0 border-l border-solid border-gray-200 p-0 h-16 flex items-center z-[99] transition-all duration-300`}
        >
          <CustomizeSiderHeader
            project={project}
            section={selectedSection?.title}
          />
        </Header>

        <Content className="m-4 overflow-auto bg-white rounded-lg">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
