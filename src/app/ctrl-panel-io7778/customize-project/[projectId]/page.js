'use client';

import { useParams } from 'next/navigation';
import { useGetProjectQuery } from '@/rtk/api/projectApi';
import { Spin } from 'antd';
import HeroSection from '@/components/section-preview/hero-section/HeroSection';
import TopChoiceSection from '@/components/section-preview/top-choice-section/TopChoiceSection';
import FeaturedProductSection from '@/components/section-preview/featured-product/FeaturedProductSection';

export default function ProjectPage() {
  const { projectId } = useParams();
  const { data, isLoading, isError } = useGetProjectQuery(projectId);

  if (isLoading) return <Spin />;
  if (isError)
    return <div className="text-red-500">Failed to load project</div>;

  const project = data?.data;

  console.log('log project', project);
  if (!project) {
    return <div className="p-6 text-gray-500">Project not found</div>;
  }

  // sort order, filter only active sections
  const sortedSections =
    project.sections
      ?.filter((section) => section.isActive)
      ?.sort((a, b) => a.order - b.order) || [];

  // Dynamic section renderer
  const renderSection = (section) => {
    console.log('log section', section);
    if (!section.isActive) return null;

    const sectionProps = {
      data: section.data || {},
    };

    switch (section.template.slug) {
      case 'hero':
        return <HeroSection key={section._id} {...sectionProps} />;
      case 'top-choice-section':
        return <TopChoiceSection key={section._id} {...sectionProps} />;
      case 'featured-product':
        return <FeaturedProductSection key={section._id} {...sectionProps} />;
      default:
        console.warn(`Unknown section template: ${section.template.slug}`);
        return (
          <div
            key={section._id}
            className="p-4 bg-yellow-100 border border-yellow-300 rounded"
          >
            <p>
              Unknown section type: <strong>{section.template.slug}</strong>
            </p>
            <pre className="text-xs mt-2">
              {JSON.stringify(section.data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Render Sections */}
      <div>
        {sortedSections.length > 0 ? (
          sortedSections.map(renderSection)
        ) : (
          <div className="p-8 text-center text-gray-500">
            No sections available. Add sections to your project.
          </div>
        )}
      </div>
    </div>
  );
}
