'use client';
import React from 'react';
import { GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useDeleteSectionMutation } from '@/rtk/api/projectApi';
import { notify } from '@/utils/helpers';

const ADMIN_BASE_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH;

const SortableSection = ({ section, projectId, sectionId, router }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section._id });

  const [deleteSection] = useDeleteSectionMutation();

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSection({ projectId, sectionId: section._id }).unwrap();
      notify.success('Success', 'Section deleted successfully.');
    } catch (err) {
      notify.error('Error', 'Failed to delete section.');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative flex items-center gap-2 transition-all ${
        sectionId === section._id ? 'border-blue-500 bg-blue-50' : 'bg-white'
      } ${
        isDragging ? 'opacity-50 shadow-lg' : 'border border-gray-200'
      } border-solid rounded-lg select-none min-h-12 p-1 cursor-pointer`}
      onClick={() =>
        router.push(
          `/${ADMIN_BASE_PATH}/customize-project/${projectId}/${section._id}`
        )
      }
    >
      <div
        {...listeners}
        className="flex items-center justify-center h-full px-1 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="text-gray-500 group-hover:text-gray-700" />
      </div>

      <div className="flex flex-col gap-y-1 w-full flex-grow-1">
        <span className="line-clamp-1">{section.title}</span>
        <span className="text-gray-500 text-xs line-clamp-1">
          Template: {section.template.name} / Order: {section.order + 1}
        </span>
      </div>

      <div
        className="hidden group-hover:inline-block"
        onClick={(e) => e.stopPropagation()}
      >
        <Popconfirm
          title="Delete Section"
          placement="right"
          description={`Are you sure to delete "${section.title}"?`}
          onConfirm={handleConfirmDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            size="small"
            shape="circle"
            danger
            icon={<DeleteOutlined />}
          />
        </Popconfirm>
      </div>
    </div>
  );
};

export default SortableSection;
