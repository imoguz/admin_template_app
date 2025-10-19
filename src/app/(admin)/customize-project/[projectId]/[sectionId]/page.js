'use client';

import { useParams } from 'next/navigation';
import { Spin } from 'antd';
import { useGetProjectQuery } from '@/rtk/api/projectApi';
import HeroSection from '@/components/section-editors/HeroSection';
import TopChoiceSection from '@/components/section-editors/TopChoiceSection';
import FeaturedProductSection from '@/components/section-editors/FeaturedProductSection';

export default function CustomizeSectionPage() {
  const { projectId, sectionId } = useParams();
  const { data, isLoading, isError } = useGetProjectQuery(projectId);

  if (isLoading) return <Spin />;
  if (isError) return <div className="p-6 text-red-500">Failed to load</div>;

  const project = data?.data;
  const section = project?.sections.find((s) => s._id === sectionId);
  console.log('project:', project);
  console.log('section:', section);
  if (!section) {
    return <div className="p-6 text-gray-500">Section not found</div>;
  }

  // Dynamic render
  const renderCustomizer = () => {
    switch (section.template.slug) {
      case 'hero':
        return <HeroSection section={section} projectId={projectId} />;
      case 'top-choice-section':
        return <TopChoiceSection section={section} projectId={projectId} />;
      case 'featured-product':
        return (
          <FeaturedProductSection section={section} projectId={projectId} />
        );

      default:
        return <div>No customizer for {section.template.slug}</div>;
    }
  };

  return <div className="p-6">{renderCustomizer()}</div>;
}
