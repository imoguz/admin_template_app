'use client';

import { Modal, Form, Input, Button, message } from 'antd';
import { useEffect, useState } from 'react';

// Slug oluşturma fonksiyonu
const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-') || '';

const SectionForm = ({
  open,
  onCancel,
  onSubmit,
  initialValues,
  isLoading = false,
  title = 'Create Section Template',
}) => {
  const [form] = Form.useForm();
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      setSlugEdited(false);
      if (initialValues) {
        form.setFieldsValue(initialValues);
        setSlugEdited(true); // Edit modunda slug zaten edited kabul et
      }
    }
  }, [open, initialValues, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
      setSlugEdited(false);
    } catch (error) {
      message.error('Please fill all required fields correctly');
    }
  };

  // Form değerleri değiştiğinde otomatik slug oluştur
  const handleValuesChange = (changedValues, allValues) => {
    // Eğer name değişti ve slug manuel edit edilmediyse
    if (changedValues.name && !slugEdited) {
      const slug = slugify(changedValues.name);
      form.setFieldsValue({ slug });
    }
  };

  // Slug input'una manuel müdahale edildiğinde
  const handleSlugChange = () => {
    if (!slugEdited) {
      setSlugEdited(true);
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isLoading}
          onClick={handleSubmit}
        >
          {initialValues ? 'Update' : 'Create'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        onValuesChange={handleValuesChange}
      >
        <Form.Item
          name="name"
          label="Template Name"
          rules={[
            { required: true, message: 'Please enter template name' },
            { min: 2, message: 'Name must be at least 2 characters' },
          ]}
        >
          <Input placeholder="Enter template name (e.g., Hero Section)" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[
            { required: true, message: 'Please enter slug' },
            {
              pattern: /^[a-z0-9-]+$/,
              message:
                'Slug can only contain lowercase letters, numbers, and hyphens',
            },
          ]}
        >
          <Input
            placeholder="Enter slug (e.g., hero-section)"
            onChange={handleSlugChange}
          />
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            placeholder="Enter description about this section template"
            rows={3}
          />
        </Form.Item>

        <Form.Item name="icon" label="Icon">
          <Input placeholder="Enter icon (e.g., 📄, Settings, User)" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SectionForm;
