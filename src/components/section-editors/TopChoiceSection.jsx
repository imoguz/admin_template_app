'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Switch, InputNumber } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import { useUpdateSectionMutation } from '@/rtk/api/projectApi';
import { notify } from '@/utils/helpers';
import ImageUpload from '../common/ImageUpload';

const { TextArea } = Input;

export default function TopChoiceSection({ section, projectId }) {
  const [form] = Form.useForm();
  const [updateSection, { isLoading }] = useUpdateSectionMutation();
  const [cardImages, setCardImages] = useState({});

  // Initial values
  const initialValues = {
    sectionTitle: section.title,
    isActive: section.isActive,
    eyebrow: section.data?.eyebrow || '',
    title: section.data?.title || '',
    subtitle: section.data?.subtitle || '',
    backgroundColor: section.data?.backgroundColor || '#f0f5fc',
    highlightBox: {
      text: section.data?.highlightBox?.text || '',
      showHighlight: section.data?.highlightBox?.showHighlight ?? true,
      highlightText: section.data?.highlightBox?.highlightText || '',
    },
    cards:
      section.data?.cards?.map((card) => ({
        ...card,
        image: card.image?.url || card.image || '',
      })) || [],
    gridConfig: section.data?.gridConfig || {
      xs: 24,
      sm: 12,
      md: 8,
      lg: 6,
      gutter: 24,
    },
  };

  const handleCardImageChange = (cardId, file) => {
    setCardImages((prev) => ({
      ...prev,
      [cardId]: file,
    }));
  };

  const handleSave = async (values) => {
    try {
      const formData = new FormData();

      // basic fields
      formData.append('title', values.sectionTitle);
      formData.append('isActive', values.isActive);

      // data objects without image
      const data = {
        eyebrow: values.eyebrow,
        title: values.title,
        subtitle: values.subtitle,
        backgroundColor: values.backgroundColor,
        highlightBox: values.highlightBox,
        gridConfig: values.gridConfig,
        cards: values.cards.map((card, index) => {
          const imageFile = cardImages[card.id];
          return {
            id: card.id,
            title: card.title,
            subtitle: card.subtitle,
            description: card.description,
            image: imageFile ? '' : card.image,
          };
        }),
      };

      formData.append('data', JSON.stringify(data));

      // Add image files
      values.cards.forEach((card, index) => {
        const imageFile = cardImages[card.id];
        if (imageFile) {
          formData.append(`cards[${index}][image]`, imageFile);
        }
      });

      await updateSection({
        projectId,
        sectionId: section._id,
        body: formData,
      }).unwrap();

      notify.success('Success', 'Section updated successfully!');
      setCardImages({});
    } catch (error) {
      console.error('Update error:', error);
      notify.error('Error', 'Failed to update section');
    }
  };

  const moveCard = (index, direction) => {
    const currentCards = form.getFieldValue('cards') || [];
    const newCards = [...currentCards];

    if (direction === 'left' && index > 0) {
      [newCards[index], newCards[index - 1]] = [
        newCards[index - 1],
        newCards[index],
      ];
    } else if (direction === 'right' && index < newCards.length - 1) {
      [newCards[index], newCards[index + 1]] = [
        newCards[index + 1],
        newCards[index],
      ];
    }

    form.setFieldsValue({ cards: newCards });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Top Choice Section Customize</h2>
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

        {/* Highlight Box */}
        <Card title="Highlight Box" size="small">
          <Form.Item
            name={['highlightBox', 'showHighlight']}
            label="Show Highlight Box"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item name={['highlightBox', 'text']} label="Main Text">
            <TextArea rows={4} placeholder="Main highlight text content..." />
          </Form.Item>

          <Form.Item
            name={['highlightBox', 'highlightText']}
            label="Special Highlight Text"
          >
            <TextArea
              rows={3}
              placeholder="📢 Special announcement or callout..."
            />
          </Form.Item>
        </Card>

        {/* Cards Management */}
        <Card
          title="Feature Cards"
          size="small"
          extra={
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={() => {
                const currentCards = form.getFieldValue('cards') || [];
                form.setFieldsValue({
                  cards: [
                    ...currentCards,
                    {
                      id: `card-${Date.now()}`,
                      image: '',
                      title: 'New Feature',
                      subtitle: 'Feature subtitle',
                      description: 'Feature description',
                    },
                  ],
                });
              }}
            >
              Add Card
            </Button>
          }
        >
          <Form.List name="cards">
            {(fields, { remove }) => {
              // Güncel kartları alıyoruz
              const cards = form.getFieldValue('cards') || [];

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cards.map((card, index) => {
                    // Form.List’in field bilgisi
                    const field = fields[index];
                    if (!field) return null;

                    return (
                      <Card
                        key={card.id} // id üzerinden key, sıra değişiminde korunur
                        size="small"
                        title={`Card ${index + 1}`}
                        className="relative"
                        extra={
                          <div className="flex space-x-1">
                            <Button
                              size="small"
                              icon={<ArrowLeftOutlined />}
                              disabled={index === 0}
                              onClick={() => moveCard(index, 'left')}
                            />
                            <Button
                              size="small"
                              icon={<ArrowRightOutlined />}
                              disabled={index === cards.length - 1}
                              onClick={() => moveCard(index, 'right')}
                            />
                            <Button
                              danger
                              size="small"
                              icon={<DeleteOutlined />}
                              onClick={() => remove(field.name)}
                            />
                          </div>
                        }
                      >
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Card Image
                          </label>
                          <ImageUpload
                            value={card.image}
                            onChange={(file) =>
                              handleCardImageChange(card.id, file)
                            }
                            maxCount={1}
                          />
                        </div>

                        <Form.Item
                          name={[field.name, 'title']}
                          label="Card Title"
                          className="mb-3"
                        >
                          <Input placeholder="Feature title" />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, 'subtitle']}
                          label="Card Subtitle"
                          className="mb-3"
                        >
                          <Input placeholder="Feature subtitle" />
                        </Form.Item>

                        <Form.Item
                          name={[field.name, 'description']}
                          label="Description"
                          className="mb-0"
                        >
                          <TextArea
                            rows={3}
                            placeholder="Feature description..."
                          />
                        </Form.Item>
                      </Card>
                    );
                  })}
                </div>
              );
            }}
          </Form.List>
        </Card>

        {/* Grid Settings */}
        <Card title="Grid Settings" size="small">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Form.Item name={['gridConfig', 'xs']} label="Mobile">
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>

            <Form.Item name={['gridConfig', 'sm']} label="Tablet">
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>

            <Form.Item name={['gridConfig', 'md']} label="Desktop">
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>

            <Form.Item name={['gridConfig', 'lg']} label="Large Desktop">
              <InputNumber min={1} max={24} className="w-full" />
            </Form.Item>

            <Form.Item
              name={['gridConfig', 'gutter']}
              label="Spacing Between Cards"
            >
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
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
}
