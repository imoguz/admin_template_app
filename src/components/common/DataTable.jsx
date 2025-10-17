'use client';

import { Table, Button, Dropdown, Input } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { useState, useEffect, useCallback } from 'react';

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function DataTable({
  total = 0,
  tableState = { offset: 0, searchText: '', filters: {}, sorter: {} },
  setTableState,
  selectedRowKeys = [],
  setSelectedRowKeys,
  columns = [],
  selectMenuItems = [],
  showSearchInput = false,
  onRowClick,
  rowKey = '_id',
  pageSize = 10,
  showRowSelection = true,
  editable = false,
  editingKey = '',
  onSave = () => {},
  onDelete = () => {},
  ...props
}) {
  const [searchText, setSearchText] = useState(tableState.searchText || '');
  const debouncedSearch = useDebounce(searchText);

  useEffect(() => {
    setTableState?.((prev) => ({ ...prev, searchText: debouncedSearch }));
  }, [debouncedSearch, setTableState]);

  const handlePageChange = useCallback(
    (page) => {
      setTableState?.((prev) => ({ ...prev, offset: (page - 1) * pageSize }));
    },
    [pageSize, setTableState]
  );

  const handleTableChange = (pagination, filters, sorter) => {
    setTableState?.((prev) => ({
      ...prev,
      page: pagination.current,
      offset: (pagination.current - 1) * pageSize,
      filters,
      sorter: {
        field: sorter.field,
        order: sorter.order,
      },
    }));
  };

  const rowSelection = showRowSelection
    ? {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
      }
    : null;

  const actionMenu =
    selectedRowKeys.length > 0 && selectMenuItems.length > 0 ? (
      <Dropdown menu={{ items: selectMenuItems }} placement="bottomLeft">
        <Button icon={<MoreOutlined />} />
      </Dropdown>
    ) : null;

  const TableHeader = (showSearchInput || actionMenu) && (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2 p-3">
      {showSearchInput && (
        <Input
          placeholder="Search..."
          variant="borderless"
          prefix={<SearchOutlined />}
          style={{ borderBottom: '1px solid gray' }}
          className="!border border-gray-300 rounded-none w-full max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      )}
      {actionMenu}
    </div>
  );

  return (
    <div className="flex flex-col bg-white border border-solid border-gray-200 rounded-lg shadow-sm overflow-x-auto">
      {TableHeader}

      <Table
        rowKey={rowKey}
        rowSelection={rowSelection}
        size="middle"
        pagination={{
          showSizeChanger: false,
          pageSize,
          total,
          current: tableState.offset / pageSize + 1,
          onChange: handlePageChange,
        }}
        rowClassName={(record) =>
          `cursor-pointer hover:bg-gray-50 ${
            editingKey === record[rowKey] ? 'editable-row' : ''
          }`
        }
        columns={columns.map((col) => {
          if (!editable || !col.editable) return col;

          return {
            ...col,
            onCell: (record) => ({
              record,
              editable: col.editable,
              editing: editingKey === record[rowKey],
              dataIndex: col.dataIndex,
              title: col.title,
              inputType: col.dataIndex,
              handleSave: onSave,
            }),
          };
        })}
        onRow={
          onRowClick
            ? (record) => ({
                onClick: () => onRowClick(record),
              })
            : undefined
        }
        onChange={handleTableChange}
        {...props}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
