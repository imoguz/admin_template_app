'use client';

import { useState } from 'react';
import DataTable from '@/components/common/DataTable';
import { useRouter } from 'next/navigation';
import { Spin, Button, Popconfirm } from 'antd';
import CreateProjectModal from '@/components/CreateProjectModal';
import { notify } from '@/utils/helpers';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from '@/rtk/api/projectApi';

export default function ProjectsPage() {
  const router = useRouter();
  const [tableState, setTableState] = useState({ offset: 0, searchText: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { data, isLoading, isError } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const projects = data?.data ?? [];

  const handleRowClick = (record) => {
    router.push(`/projects/customize/${record._id}`);
  };

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) => deleteProject(id).unwrap())
      );
      notify.success('Success', 'Project(s) deleted successfully');
      setSelectedRowKeys([]);
    } catch (err) {
      console.error(err);
      notify.error(
        'Error',
        'Project(s) deleted successfullyFailed to delete project(s)'
      );
    }
  };

  const columns = [
    {
      title: 'Project Name',
      dataIndex: 'title',
      key: 'title',
      sorter: true,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      sorter: true,
    },
    {
      title: 'Thumbnail',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumb) =>
        thumb?.url ? (
          <img
            src={thumb.url}
            alt="thumb"
            className="w-16 h-10 object-cover rounded"
          />
        ) : (
          <img
            src="/images/web-site.jpg"
            alt="thumb"
            className="w-16 h-10 object-cover rounded"
          />
        ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col justify-center items-center space-y-6 custom-shadow-3 w-96 h-52 rounded-lg">
          <p className="text-center px-3 text-lg font-medium">
            An error was encountered while loading projects. Please refresh to
            try again.
          </p>
          <Button type="primary" onClick={() => router.refresh()}>
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Select a Project to Customize</h2>
        <CreateProjectModal />
      </div>
      <DataTable
        columns={columns}
        tableState={tableState}
        setTableState={setTableState}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        total={projects.length}
        showSearchInput
        onRowClick={handleRowClick}
        dataSource={projects}
        pageSize={5}
        selectMenuItems={[
          {
            key: 'delete',
            label: (
              <Popconfirm
                title="Are you sure to delete the selected project(s)?"
                description="This action cannot be undone."
                placement="left"
                onConfirm={handleDelete}
                okText="Yes, Delete"
                cancelText="Cancel"
              >
                <span className="cursor-pointer text-red-600">Delete</span>
              </Popconfirm>
            ),
          },
        ]}
      />
    </div>
  );
}
