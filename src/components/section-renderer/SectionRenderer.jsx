'use client';

import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { Skeleton, Row, Col } from 'antd';

const sectionComponents = {
  'Top Choice Section': dynamic(() => import('./top-choice/TopChoiceSection')),
  'Hero Section': dynamic(() => import('./hero/HeroSection')),
  'Featured Product Section': dynamic(() =>
    import('./featured-product/FeaturedProductSection')
  ),
};

const DefaultSection = ({ section }) => (
  <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 p-8 rounded-lg text-center my-8">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {section.title || 'Unnamed Section'}
    </h3>
    <p className="text-gray-600 mb-4">
      Template: <strong>{section.template?.name}</strong>
    </p>
    <div className="bg-white p-4 rounded border">
      <p className="text-sm text-gray-500">
        Section component for &quot;{section.template?.name}&quot; not found.
      </p>
    </div>
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

const SectionRenderer = memo(({ section }) => {
  if (!section?.isActive) {
    return null;
  }

  const SectionComponent = sectionComponents[section.template?.name];

  if (!SectionComponent) {
    return <DefaultSection section={section} />;
  }

  return (
    <section
      id={`section-${section._id}`}
      className="scroll-mt-20"
      data-section-type={section.template?.name}
      data-section-id={section._id}
    >
      <React.Suspense fallback={<SectionLoading />}>
        <SectionComponent data={section.data || {}} section={section} />
      </React.Suspense>
    </section>
  );
});

SectionRenderer.displayName = 'SectionRenderer';

export default SectionRenderer;
