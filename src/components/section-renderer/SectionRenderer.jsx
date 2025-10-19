'use client';

import { memo } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for section components
const sectionComponents = {
  'Top Choice Section': dynamic(() => import('./top-choice/TopChoiceSection')),
  'Hero Section': dynamic(() => import('./hero/HeroSection')),
  'Featured Product Section': dynamic(() =>
    import('./featured-product/FeaturedProductSection')
  ),
};

// Default fallback component
const DefaultSection = ({ section }) => (
  <div className="border-2 border-dashed border-yellow-400 bg-yellow-50 p-8 rounded-lg text-center my-8">
    <div className="text-4xl mb-4">🚧</div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">
      {section.title || 'Unnamed Section'}
    </h3>
    <p className="text-gray-600 mb-4">
      Template: <strong>{section.template?.name}</strong>
    </p>
    <div className="bg-white p-4 rounded border">
      <p className="text-sm text-gray-500">
        ⚠️ Section component for <code>"{section.template?.name}"</code> not
        found.
      </p>
    </div>
  </div>
);

// Loading component for dynamic imports
const SectionLoading = ({ section }) => (
  <div className="animate-pulse bg-gray-100 rounded-lg p-8 my-8">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-32 bg-gray-200 rounded"></div>
  </div>
);

const SectionRenderer = memo(({ section }) => {
  if (!section?.isActive) {
    return null; // Skip inactive sections
  }

  const SectionComponent = sectionComponents[section.template?.name];

  if (!SectionComponent) {
    return <DefaultSection section={section} />;
  }

  return (
    <section
      id={`section-${section._id}`}
      className="scroll-mt-20" // Smooth scroll için
      data-section-type={section.template?.name}
      data-section-id={section._id}
    >
      <SectionComponent
        data={section.data || {}}
        section={section} // Tüm section prop'unu da geçebiliriz
      />
    </section>
  );
});

SectionRenderer.displayName = 'SectionRenderer';

export default SectionRenderer;
