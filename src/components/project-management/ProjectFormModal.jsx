'use client';

import { useState, useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from '@/rtk/api/projectApi';
import ImageUpload from '@/components/common/ImageUpload';
import { notify, getImageUrl } from '@/utils/helpers';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');

export default function ProjectFormModal({
  project = null,
  open = false,
  onSuccess,
  onCancel,
}) {
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();

  const isLoading = isCreating || isUpdating;
  const isEditMode = !!project;

  const currentThumbnailUrl = project?.thumbnail?.url
    ? getImageUrl(project.thumbnail.url)
    : null;

  useEffect(() => {
    if (open) {
      if (project) {
        // Edit mode
        form.setFieldsValue({
          title: project.title,
          slug: project.slug,
          description: project.description,
        });
        setSlugEdited(true);
        setThumbnailFile(null);
      } else {
        // Create mode
        form.resetFields();
        setThumbnailFile(null);
        setSlugEdited(false);
      }
    }
  }, [open, project, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('slug', values.slug);

      if (values.description?.trim()) {
        formData.append('description', values.description.trim());
      }

      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      if (isEditMode) {
        await updateProject({ id: project._id, body: formData }).unwrap();
        notify.success('Success', 'Project updated successfully!');
      } else {
        await createProject(formData).unwrap();
        notify.success('Success', 'Project created successfully!');
      }

      handleCancel();
      onSuccess?.();
    } catch (err) {
      console.error('Project form submission error:', err);
      const errorMessage = err?.data?.message || 'Operation failed';
      notify.error('Error', errorMessage);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setThumbnailFile(null);
    setSlugEdited(false);
    onCancel?.();
  };

  const handleThumbnailChange = (file) => {
    setThumbnailFile(file);
  };

  return (
    <Modal
      title={isEditMode ? 'Edit Project' : 'Create New Project'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onValuesChange={(changed, all) => {
          if (changed.title !== undefined && !slugEdited) {
            form.setFieldsValue({ slug: slugify(all.title) });
          }
        }}
      >
        <Form.Item
          name="title"
          label="Project Title"
          rules={[{ required: true, message: 'Please enter project title' }]}
        >
          <Input placeholder="My Landing Page" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: 'Please enter slug' }]}
        >
          <Input
            placeholder="my-landing"
            onChange={() => setSlugEdited(true)}
          />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Short description..." rows={3} />
        </Form.Item>

        <Form.Item label="Thumbnail">
          <ImageUpload
            value={currentThumbnailUrl}
            onChange={handleThumbnailChange}
          />
          {isEditMode && currentThumbnailUrl && !thumbnailFile && (
            <div className="mt-2 text-xs text-gray-500">
              Current thumbnail will be kept if no new image is selected.
            </div>
          )}
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
