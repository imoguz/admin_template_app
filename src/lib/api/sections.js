import dynamic from 'next/dynamic';

// Slug based mapping
export const sections = {
  hero: dynamic(() => import('@/components/section-renderer/hero/HeroSection')),
  'top-choice-section': dynamic(() =>
    import('@/components/section-renderer/top-choice/TopChoiceSection')
  ),
  'featured-product': dynamic(() =>
    import(
      '@/components/section-renderer/featured-product/FeaturedProductSection'
    )
  ),
};
