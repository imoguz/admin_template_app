'use client';

import React from 'react';
import { BellOutlined, SettingOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import UserMenu from './UserMenu';
import { Typography } from 'antd';
const { Title } = Typography;

const DashboardSiderHeader = () => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between px-7">
      <Title level={4} className="my-0.5">
        Admin Dashboard
      </Title>
      <div className="flex gap-5 items-center">
        <BellOutlined />
        <SettingOutlined />
        <UserMenu />
      </div>
    </div>
  );
};

export default DashboardSiderHeader;
