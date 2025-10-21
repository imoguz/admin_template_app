'use client';

import React from 'react';
import { EyeOutlined, LeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { Button, Tag } from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

const CustomizeSiderHeader = ({ project, section = 'Preview Mode' }) => {
  const router = useRouter();

  return (
    <div className="w-full flex items-center justify-between px-7">
      <Button
        type="default"
        icon={<LeftOutlined />}
        onClick={() =>
          router.push(`/${ADMIN_BASE_PATH}/dashboard/project-management`)
        }
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
        <Button
          type="default"
          shape="default"
          icon={<EyeOutlined />}
          block
          onClick={() =>
            router.push(`/${ADMIN_BASE_PATH}/customize-project/${project?._id}`)
          }
        >
          Preview
        </Button>
      </div>
    </div>
  );
};

export default CustomizeSiderHeader;
