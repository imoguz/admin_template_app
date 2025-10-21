'use client';

import { Button, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import DataTable from '@/components/common/DataTable';

const SectionTemplateList = ({
  data,
  loading,
  onEdit,
  onDelete,
  tableState,
  setTableState,
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug) => <Tag color="blue">{slug}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => (
        <Tooltip title={text}>
          <span className="line-clamp-2">{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      render: (icon) => icon || '📄',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete this template?"
            description="This action cannot be undone."
            onConfirm={() => onDelete(record._id)}
            okText="Yes"
            cancelText="No"
            okType="danger"
            placement="left"
          >
            <Button danger type="link" icon={<DeleteOutlined />} size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      dataSource={data}
      loading={loading}
      total={data?.length || 0}
      tableState={tableState}
      setTableState={setTableState}
      pageSize={10}
      showSearchInput={true}
      rowKey="_id"
    />
  );
};

export default SectionTemplateList;
