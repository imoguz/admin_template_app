'use client';

import { useParams } from 'next/navigation';
import { useGetProjectQuery } from '@/rtk/api/projectApi';
import { Alert, Spin } from 'antd';
import SectionRenderer from '@/components/section-renderer/SectionRenderer';

export default function CustomizeProjectPage() {
  const { projectId } = useParams();
  const { data, isLoading, isError } = useGetProjectQuery(projectId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error Loading Project"
        description="Failed to load project data. Please try again."
        type="error"
        className="m-4"
      />
    );
  }

  const project = data?.data;

  if (!project) {
    return (
      <Alert
        message="Project Not Found"
        description="The requested project could not be found."
        type="warning"
        className="m-4"
      />
    );
  }

  // Active and ordered sections list
  const sortedSections =
    project.sections
      ?.filter((section) => section.isActive)
      ?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-white">
      <main>
        {sortedSections.length > 0 ? (
          sortedSections.map((section) => (
            <SectionRenderer key={section._id} section={section} />
          ))
        ) : (
          <div className="p-12 text-center text-gray-500">
            No sections configured yet.
          </div>
        )}
      </main>
    </div>
  );
}
