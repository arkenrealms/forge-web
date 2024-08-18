import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSettings from '~/hooks/useSettings2';

type Props = {
  animateParams: {
    rotate: string;
    x: [number, number, number];
    y: [number, number, number];
  };
  className: string;
};

const Triangle: React.FC<Props> = ({ animateParams, className }) => {
  // const { quality } = useSettings()

  // if (quality === 'bad') return <></>

  return (
    <motion.div
      initial={false}
      animate={animateParams}
      transition={{
        loop: Infinity,
        ease: 'easeIn',
        duration: 100,
      }}
      className={className}
    />
  );
};

export default Triangle;
