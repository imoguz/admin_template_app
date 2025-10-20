'use client';

import { useState } from 'react';
import { Button, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useGetSectionTemplatesQuery,
  useCreateSectionTemplateMutation,
  useUpdateSectionTemplateMutation,
  useDeleteSectionTemplateMutation,
} from '@/rtk/api/sectionTemplateApi';
import SectionTemplateList from '@/components/section-template/SectionTemplateList';
import SectionForm from '@/components/section-template/SectionForm';

export default function SectionManagementPage() {
  const {
    data: templatesData,
    isLoading,
    refetch,
  } = useGetSectionTemplatesQuery();
  const [createSectionTemplate, { isLoading: isCreating }] =
    useCreateSectionTemplateMutation();
  const [updateSectionTemplate, { isLoading: isUpdating }] =
    useUpdateSectionTemplateMutation();
  const [deleteSectionTemplate] = useDeleteSectionTemplateMutation();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [tableState, setTableState] = useState({
    offset: 0,
    searchText: '',
    filters: {},
    sorter: {},
  });

  const templates = templatesData?.data || [];

  const handleCreate = async (formData) => {
    try {
      await createSectionTemplate(formData).unwrap();
      message.success('Section template created successfully');
      setIsFormOpen(false);
      refetch();
    } catch (error) {
      message.error(
        error?.data?.message || 'Failed to create section template'
      );
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleUpdate = async (formData) => {
    try {
      await updateSectionTemplate({
        id: editingTemplate._id,
        body: formData,
      }).unwrap();
      message.success('Section template updated successfully');
      setIsFormOpen(false);
      setEditingTemplate(null);
      refetch();
    } catch (error) {
      message.error(
        error?.data?.message || 'Failed to update section template'
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSectionTemplate(id).unwrap();
      message.success('Section template deleted successfully');
      refetch();
    } catch (error) {
      message.error(
        error?.data?.message || 'Failed to delete section template'
      );
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingTemplate) {
      return handleUpdate(formData);
    }
    return handleCreate(formData);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingTemplate(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Section Templates
          </h1>
          <p className="text-gray-600">Manage your section templates</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsFormOpen(true)}
          size="large"
        >
          New Template
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <SectionTemplateList
          data={templates}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          tableState={tableState}
          setTableState={setTableState}
        />
      )}

      <SectionForm
        open={isFormOpen}
        onCancel={handleFormClose}
        onSubmit={handleFormSubmit}
        initialValues={editingTemplate}
        isLoading={isCreating || isUpdating}
        title={
          editingTemplate ? 'Edit Section Template' : 'Create Section Template'
        }
      />
    </div>
  );
}
