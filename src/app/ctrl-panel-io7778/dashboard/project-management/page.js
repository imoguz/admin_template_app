'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Button, Popconfirm, Tag, Badge } from 'antd';
import {
  EditOutlined,
  AppstoreOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import DataTable from '@/components/common/DataTable';
import ProjectFormModal from '@/components/project-management/ProjectFormModal';
import { getImageUrl, notify } from '@/utils/helpers';
import {
  useGetProjectsQuery,
  useDeleteProjectMutation,
} from '@/rtk/api/projectApi';
import Image from 'next/image';

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getTimeSinceUpdate = (dateString) => {
  const now = new Date();
  const updated = new Date(dateString);
  const diffTime = Math.abs(now - updated);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};

const countActiveSections = (sections) => {
  return sections?.filter((section) => section.isActive).length || 0;
};

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

export default function ProjectsPage() {
  const router = useRouter();
  const [tableState, setTableState] = useState({ offset: 0, searchText: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalState, setModalState] = useState({
    isCreateOpen: false,
    isEditOpen: false,
    editingProject: null,
  });

  const { data, isLoading, isError, refetch } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();

  const projects = useMemo(() => data?.data ?? [], [data]);

  const stats = useMemo(
    () => ({
      total: projects.length,
      published: projects.filter((p) => p.isPublished).length,
      drafts: projects.filter((p) => !p.isPublished).length,
    }),
    [projects]
  );

  const handleRowClick = useCallback(
    (record) => {
      router.push(`/${ADMIN_BASE_PATH}/customize-project/${record._id}`);
    },
    [router]
  );

  const handleDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((id) => deleteProject(id).unwrap())
      );
      notify.success('Success', 'Project(s) deleted successfully');
      setSelectedRowKeys([]);
    } catch (err) {
      console.error(err);
      notify.error('Error', 'Failed to delete project(s)');
    }
  };

  const handleEdit = useCallback((project, e) => {
    e?.stopPropagation();
    setModalState({
      isCreateOpen: false,
      isEditOpen: true,
      editingProject: project,
    });
  }, []);

  const handleFormSuccess = useCallback(() => {
    setModalState({
      isCreateOpen: false,
      isEditOpen: false,
      editingProject: null,
    });
    refetch();
  }, [refetch]);

  const handleModalClose = useCallback(() => {
    setModalState({
      isCreateOpen: false,
      isEditOpen: false,
      editingProject: null,
    });
  }, []);

  // Table columns
  const columns = useMemo(
    () => [
      {
        title: 'Project',
        dataIndex: 'title',
        key: 'title',
        sorter: true,
        render: (title, record) => (
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Image
                src={
                  getImageUrl(record.thumbnail?.url) || '/images/web-site.jpg'
                }
                alt={title || 'Project thumbnail'}
                width={80}
                height={40}
                className="object-contain rounded-md border"
                style={{
                  width: '80px',
                  height: '40px',
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  e.target.src = '/images/web-site.jpg';
                }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {title}
              </h3>
              <p className="text-sm text-gray-500 truncate">{record.slug}</p>
            </div>
          </div>
        ),
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (description) => (
          <p className="text-sm text-gray-600 max-w-xs truncate">
            {description || 'No description'}
          </p>
        ),
      },
      {
        title: 'Last Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        render: (date) => (
          <div className="text-sm">
            <div className="text-gray-900 font-medium">{formatDate(date)}</div>
            <div className="text-gray-500 text-xs">
              {getTimeSinceUpdate(date)}
            </div>
          </div>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'isPublished',
        key: 'isPublished',
        render: (isPublished) => (
          <Tag color={isPublished ? 'green' : 'orange'}>
            {isPublished ? 'Published' : 'Draft'}
          </Tag>
        ),
      },
      {
        title: 'Active Sections',
        dataIndex: 'sections',
        key: 'sections',
        render: (sections) => (
          <Tag color="blue" icon={<AppstoreOutlined />}>
            {countActiveSections(sections)} sections
          </Tag>
        ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        render: (_, record) => (
          <Button
            type="link"
            icon={<EditOutlined />}
            size="small"
            onClick={(e) => handleEdit(record, e)}
          >
            Edit
          </Button>
        ),
      },
    ],
    [handleEdit]
  );

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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and customize your landing projects
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() =>
            setModalState({
              isCreateOpen: true,
              isEditOpen: false,
              editingProject: null,
            })
          }
        >
          Create New Project
        </Button>
      </div>

      {/* Statistics */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-lg custom-shadow-0">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-gray-600 text-sm">Total Projects</div>
        </div>
        <div className="bg-white p-4 rounded-lg custom-shadow-0">
          <div className="text-2xl font-bold text-green-600">
            {stats.published}
          </div>
          <div className="text-gray-600 text-sm">Published</div>
        </div>
        <div className="bg-white p-4 rounded-lg custom-shadow-0">
          <div className="text-2xl font-bold text-orange-600">
            {stats.drafts}
          </div>
          <div className="text-gray-600 text-sm">Drafts</div>
        </div>
      </div>

      {/* Data Table */}
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
        pageSize={10}
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
                okType="danger"
              >
                <span className="cursor-pointer text-red-600">
                  Delete Selected
                </span>
              </Popconfirm>
            ),
          },
        ]}
      />

      {/* Modals */}
      <ProjectFormModal
        open={modalState.isCreateOpen}
        onSuccess={handleFormSuccess}
        onCancel={handleModalClose}
      />

      <ProjectFormModal
        project={modalState.editingProject}
        open={modalState.isEditOpen}
        onSuccess={handleFormSuccess}
        onCancel={handleModalClose}
      />
    </div>
  );
}
