'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp } from '@/utils/constants/animationVariants';

const FeaturedProductSection = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (!data) return null;

  const { eyebrow, title, subtitle } = data;

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center">
            {eyebrow && (
              <motion.p
                className="text-lg font-semibold text-blue-600 mb-3"
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {eyebrow}
              </motion.p>
            )}
            {title && (
              <motion.h2
                className="text-4xl font-bold text-gray-900 mb-4"
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {title}
              </motion.h2>
            )}
            {subtitle && (
              <motion.p
                className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        )}

        {/* Content Placeholder */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-12 text-center"
        >
          <div className="bg-sky-200 rounded-lg p-12 max-w-3xl mx-auto">
            <p className="text-gray-600 text-base mt-2">
              Customize this section to add specific content.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductSection;
