import { useState, useEffect } from "react";
import { Form, Input, Button, Card, ColorPicker, InputNumber } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

export default function ProductSliderEditor({ sectionData, onUpdate }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (sectionData) {
      form.setFieldsValue(sectionData);
    }
  }, [sectionData, form]);

  const handleValuesChange = (changedValues, allValues) => {
    onUpdate(allValues);
  };

  return (
    <div className="space-y-4">
      <Card title="Product Slider Settings" size="small">
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          {/* Başlık */}
          <Form.Item name="title" label="Section Title">
            <Input placeholder="Enter section title" />
          </Form.Item>

          {/* Ürün Listesi */}
          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium">Products</label>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  >
                    Add Product
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    className="mb-3"
                    size="small"
                    title={`Product ${index + 1}`}
                    extra={
                      <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      />
                    }
                  >
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      label="Product Name"
                    >
                      <Input placeholder="Product name" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "image"]}
                      label="Image URL"
                    >
                      <Input placeholder="https://example.com/image.jpg" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "price"]}
                      label="Price"
                    >
                      <Input placeholder="$99" />
                    </Form.Item>

                    <Form.Item
                      {...field}
                      name={[field.name, "link"]}
                      label="Product Link"
                    >
                      <Input placeholder="/products/1" />
                    </Form.Item>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          {/* Stiller */}
          <Card title="Styles" size="small" className="mt-4">
            <Form.Item
              name={["styles", "backgroundColor"]}
              label="Background Color"
            >
              <ColorPicker format="hex" />
            </Form.Item>

            <Form.Item name={["styles", "textColor"]} label="Text Color">
              <ColorPicker format="hex" />
            </Form.Item>

            <Form.Item name={["styles", "slideSpeed"]} label="Slide Speed (ms)">
              <InputNumber min={1000} max={10000} step={500} />
            </Form.Item>
          </Card>
        </Form>
      </Card>
    </div>
  );
}
