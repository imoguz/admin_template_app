// Common variants
export const cardVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: (i) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

export const buttonHover = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
  },
};

export const buttonTap = {
  scale: 0.98,
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

export const listItemVariants = {
  hidden: {
    x: -40,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export const fadeInUp = {
  hidden: { y: 60, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const logoVariants = {
  hidden: { opacity: 0, scale: 0.8, rotate: -5 },
  visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6 } },
};

export const statsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

export const statsCardVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// Services section variants
export const servicesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const servicesCardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.5,
    },
  },
};

export const servicesImageVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    rotate: -5,
  },
  visible: {
    opacity: 0.8,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 15,
      delay: 0.4,
    },
  },
};
