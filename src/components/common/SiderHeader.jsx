'use client';

import React from 'react';
import { BellOutlined, LeftOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';
import { Button, Tag } from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;

const SiderHeader = ({ project, section = 'Preview Mode' }) => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between px-7">
      <Button
        type="default"
        icon={<LeftOutlined />}
        onClick={() => router.push(`/projects`)}
      >
        Back to Projects
      </Button>
      <div className="text-center">
        <Title level={4} className="my-0.5">
          {project?.title}
        </Title>
        <Tag color="geekblue" className="px-4 rounded-full">
          {section}
        </Tag>
      </div>
      <div className="flex gap-5 items-center">
        <BellOutlined />
        <SettingOutlined />
        <UserMenu />
      </div>
    </div>
  );
};

export default SiderHeader;
