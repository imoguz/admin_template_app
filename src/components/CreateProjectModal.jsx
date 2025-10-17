'use client';

import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useCreateProjectMutation } from '@/rtk/api/projectApi';
import ImageUploadWithCrop from '@/components/common/ImageUploadWithCrop';
import { notify } from '@/utils/helpers';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');

export default function CreateProjectModal() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [createProject, { isLoading }] = useCreateProjectMutation();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('slug', values.slug);
      if (values.description)
        formData.append('description', values.description);
      if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

      await createProject(formData).unwrap();
      notify.success('Success', 'Project created successfully!');

      form.resetFields();
      setThumbnailFile(null);
      setSlugEdited(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
      notify.error('Error', 'Failed to create project.');
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create New Project
      </Button>

      <Modal
        title="Create New Project"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
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
            <ImageUploadWithCrop value={null} onChange={setThumbnailFile} />
          </Form.Item>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Create
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}
