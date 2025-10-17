'use client';

import { useAddSectionMutation } from '@/rtk/api/projectApi';
import { useGetSectionTemplatesQuery } from '@/rtk/api/sectionTemplateApi';
import { notify } from '@/utils/helpers';
import { Modal, Select, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AddNewSectionModal = ({ isModalOpen, setIsModalOpen, projectId }) => {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const {
    data: templatesRes,
    isFetching,
    isError,
  } = useGetSectionTemplatesQuery();

  const templates =
    templatesRes?.data?.map((t) => ({
      label: t.name,
      value: t._id,
    })) || [];

  const [addSection, { isLoading: isAddingSection }] = useAddSectionMutation();

  const handleTemplateChange = (value) => {
    const selected = templates.find((t) => t.value === value);
    setSelectedTemplate(selected);
  };

  const handleAddSection = async () => {
    if (!selectedTemplate) {
      notify.warning('Warning', 'Please select a section type.');
      return;
    }

    try {
      const res = await addSection({
        projectId,
        body: {
          title: selectedTemplate.label,
          template: selectedTemplate.value,
          data: {},
        },
      }).unwrap();

      setIsModalOpen(false);
      setSelectedTemplate(null);
      notify.success(
        'Section Added',
        'The new section has been successfully added.'
      );

      router.push(`/projects/customize/${projectId}/${res.data._id}`);
    } catch (err) {
      notify.error(
        'Request Failed',
        'An error occurred. Please try again in a moment.'
      );
      console.error('Add section error:', err);
    }
  };

  return (
    <Modal
      title="Add New Section"
      open={isModalOpen}
      onCancel={() => {
        setIsModalOpen(false);
        setSelectedTemplate(null);
      }}
      onOk={handleAddSection}
      okButtonProps={{
        disabled: !selectedTemplate,
        loading: isAddingSection,
      }}
      cancelButtonProps={{ disabled: isAddingSection }}
      width={400}
    >
      <div className="space-y-4 py-4">
        <label className="block font-medium text-gray-700 mb-2">
          Select Section Type
        </label>

        {isFetching ? (
          <Spin />
        ) : isError ? (
          <p className="text-red-500 text-sm">
            Failed to load section templates.
          </p>
        ) : (
          <Select
            style={{ width: '100%' }}
            placeholder="Choose a section template..."
            options={templates}
            value={selectedTemplate?.value}
            onChange={handleTemplateChange}
            size="large"
            disabled={isAddingSection}
          />
        )}
      </div>
    </Modal>
  );
};

export default AddNewSectionModal;
