'use client';

import { Form, Input, Button, Card, Switch } from 'antd';
import { useUpdateSectionMutation } from '@/rtk/api/projectApi';
import { notify } from '@/utils/helpers';

const { TextArea } = Input;

const FeaturedProductSection = ({ section, projectId }) => {
  const [form] = Form.useForm();
  const [updateSection, { isLoading }] = useUpdateSectionMutation();

  // Initial values
  const initialValues = {
    sectionTitle: section.title,
    isActive: section.isActive,
    eyebrow: section.data?.eyebrow || '',
    title: section.data?.title || '',
    subtitle: section.data?.subtitle || '',
  };

  const handleSave = async (values) => {
    try {
      const data = {
        eyebrow: values.eyebrow,
        title: values.title,
        subtitle: values.subtitle,
      };

      await updateSection({
        projectId,
        sectionId: section._id,
        body: {
          title: values.sectionTitle,
          isActive: values.isActive,
          data: data,
        },
      }).unwrap();

      notify.success('Success', 'Section updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      notify.error('Error', 'Failed to update section');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {section.template.name} Section Customize
        </h2>
        <Button
          type="primary"
          loading={isLoading}
          onClick={() => form.submit()}
        >
          Save Changes
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSave}
        className="space-y-6"
      >
        {/* Basic Settings */}
        <Card title="Basic Settings" size="small">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="sectionTitle" label="Section Title">
              <Input placeholder="Section display name" />
            </Form.Item>

            <Form.Item name="isActive" label="Active" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Card>

        {/* Header Content */}
        <Card title="Header Content" size="small">
          <Form.Item name="eyebrow" label="Eyebrow Text">
            <Input placeholder="🏆 Excellence in Education" />
          </Form.Item>

          <Form.Item name="title" label="Main Title">
            <Input placeholder="Why Choose Us?" />
          </Form.Item>

          <Form.Item name="subtitle" label="Subtitle">
            <TextArea
              rows={3}
              placeholder="Discover what makes us the ideal choice..."
            />
          </Form.Item>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
          >
            Save Section
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FeaturedProductSection;
