'use client';

import React, { memo } from 'react';
import { Skeleton, Row, Col } from 'antd';
import { sections } from '@/lib/api/sections';

const DefaultSection = ({ section }) => (
  <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 p-8 rounded-lg text-center my-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {section.title || 'Unnamed Section'}
    </h3>
    <p className="text-gray-600 mb-4">
      Template: <strong>{section.template?.name}</strong>
      {section.template?.slug && ` (${section.template.slug})`}
    </p>
    <p className="text-sm text-gray-500">
      Section component for &quot;{section.template?.slug}&quot; not found.
    </p>
  </div>
);

const SectionLoading = () => (
  <div className="my-8 p-6">
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Skeleton active paragraph={{ rows: 3 }} title={{ width: '60%' }} />
      </Col>
    </Row>
  </div>
);

const SectionRenderer = memo(({ section, isPreview = false, projectId }) => {
  if (!section?.isActive && !isPreview) {
    return null;
  }

  // Slug-based component lookup
  const sectionSlug = section.template?.slug;
  const SectionComponent = sections[sectionSlug];

  if (!SectionComponent) {
    return <DefaultSection section={section} />;
  }

  return (
    <section
      id={`section-${section._id}`}
      className="scroll-mt-20"
      data-section-type={sectionSlug}
      data-section-id={section._id}
    >
      <React.Suspense fallback={<SectionLoading />}>
        <SectionComponent
          data={section.data || {}}
          section={section}
          isPreview={isPreview}
          projectId={projectId}
        />
      </React.Suspense>
    </section>
  );
});

SectionRenderer.displayName = 'SectionRenderer';

export default SectionRenderer;
