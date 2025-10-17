'use client';

import React, { useState } from 'react';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useReorderSectionsMutation } from '@/rtk/api/projectApi';
import AddNewSectionModal from './AddNewSectionModal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableSection from './SortableSection';
import { notify } from '@/utils/helpers';

const SectionManager = ({ sections, projectId, collapsed, sectionId }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reorderSections] = useReorderSectionsMutation();

  // Star drag after 8px
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    try {
      const oldIndex = sections.findIndex(
        (section) => section._id === active.id
      );
      const newIndex = sections.findIndex((section) => section._id === over.id);

      const reorderedSections = arrayMove(sections, oldIndex, newIndex);

      await reorderSections({
        projectId,
        order: reorderedSections.map((section) => section._id),
      }).unwrap();

      notify.success('Success', 'Section successfully reordered.');
    } catch (error) {
      notify.error('Error', 'The section order could not be modified.');
    }
  };

  return (
    <div className="px-3">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        shape={collapsed ? 'circle' : 'default'}
        block
        className="mb-4"
        onClick={() => setIsModalOpen(true)}
        disabled={isModalOpen}
      >
        {!collapsed && 'Add Section'}
      </Button>

      {/* Sortable Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((section) => section._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sections.map((section) => (
              <SortableSection
                key={section._id}
                section={section}
                projectId={projectId}
                sectionId={sectionId}
                router={router}
              />
            ))}

            {sections.length === 0 && !collapsed && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="text-sm">No sections yet</div>
                <div className="text-xs mt-1">
                  Add your first section to get started
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <AddNewSectionModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        projectId={projectId}
      />
    </div>
  );
};

export default SectionManager;
