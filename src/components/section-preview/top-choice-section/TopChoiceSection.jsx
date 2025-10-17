'use client';

import React, { useRef } from 'react';
import { Row, Col } from 'antd';
import { motion, useInView } from 'framer-motion';
import {
  fadeInUp,
  staggerContainer,
} from '@/utils/constants/animationVariants';

const TopChoiceCard = ({ card, index }) => {
  // Image URL
  const getImageUrl = () => {
    if (!card.image) return null;

    if (typeof card.image === 'object' && card.image.url) {
      return card.image.url;
    }

    if (typeof card.image === 'string') {
      return card.image;
    }

    return null;
  };

  const imageUrl = getImageUrl();
  const { title, subtitle, description } = card;

  return (
    <motion.div
      className="w-full h-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      custom={index}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl || '/images/noimage.png'}
          alt={title || 'Feature image'}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>

      {/* Content Section */}
      <div className="p-6">
        {title && (
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {title}
          </h3>
        )}

        {subtitle && (
          <h4 className="text-base font-medium text-gray-600 mb-3 line-clamp-2">
            {subtitle}
          </h4>
        )}

        {description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const TopChoiceSection = ({ data }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  if (!data) return null;

  // Color format
  const getBackgroundColor = () => {
    if (!data.backgroundColor) return '#f0f5fc';

    if (typeof data.backgroundColor === 'string') {
      return data.backgroundColor;
    }

    if (data.backgroundColor.metaColor) {
      const { r, g, b, a } = data.backgroundColor.metaColor;
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    return '#f0f5fc';
  };

  const {
    eyebrow,
    title,
    subtitle,
    highlightBox,
    cards = [],
    gridConfig = {},
  } = data;

  const { xs = 24, sm = 12, md = 8, lg = 6, gutter = 24 } = gridConfig;
  const backgroundColor = getBackgroundColor();

  // Filter cards
  const validCards = cards.filter((card) => card && card.id);

  return (
    <section
      ref={ref}
      className="py-16 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(eyebrow || title || subtitle) && (
          <div className="text-center mb-16">
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

        {/* Highlight Box */}
        {highlightBox?.showHighlight && highlightBox?.text && (
          <motion.div
            className="mb-16"
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <p className="text-lg text-gray-800 leading-relaxed mb-6">
                {highlightBox.text}
              </p>

              {highlightBox.highlightText && (
                <motion.div
                  className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <p className="text-base text-gray-800 leading-relaxed text-left font-medium">
                    {highlightBox.highlightText}
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Cards Grid */}
        {validCards.length > 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <Row
              gutter={[gutter, gutter * 2]}
              justify="start"
              className="w-full"
            >
              {validCards.map((card, index) => (
                <Col
                  key={card.id || index}
                  xs={xs}
                  sm={sm}
                  md={md}
                  lg={lg}
                  className="flex"
                >
                  <TopChoiceCard card={card} index={index} />
                </Col>
              ))}
            </Row>
          </motion.div>
        ) : (
          // placeholder
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center py-12"
          >
            <div className="bg-gray-100 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-gray-500 text-lg">No cards added yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Add cards to display them in a beautiful grid layout
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopChoiceSection;
