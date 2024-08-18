import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import cx from 'classnames';
import navigateToDirection from '~/utils/navigateToDirection';
import useSettings from '~/hooks/useSettings2';

export enum NavigationArrowVariant {
  LEFT = 'left',
  RIGHT = 'right',
}

type Props = {
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<[number, number]>>;
  variant: NavigationArrowVariant;
  maxPage?: number;
};

const Arrow = styled.div`
  cursor: url('/images/cursor3.png'), pointer;
  top: 0;
  height: 300px;
`;

const NavigationArrow: React.FC<Props> = ({ currentPage, variant, setPage, maxPage = 2 }) => {
  const { quality } = useSettings();
  const [showAnimation, setShowAnimation] = useState(false);

  const isLeftArrow = variant === NavigationArrowVariant.LEFT;
  const isDisabled = (isLeftArrow && currentPage === 0) || (!isLeftArrow && currentPage === maxPage - 1);

  useEffect(() => {
    if (showAnimation) return;
    setShowAnimation(true);
  }, [showAnimation, setShowAnimation]);

  return (
    <Arrow
      className={cx(
        { 'left-minus-40': isLeftArrow, 'right-minus-40': !isLeftArrow },
        'absolute h-full hidden flex items-center z-30'
      )}>
      {quality === 'bad' ? (
        <img
          onClick={() =>
            isLeftArrow
              ? navigateToDirection(-1, currentPage, setPage, maxPage - 1)
              : navigateToDirection(1, currentPage, setPage, maxPage - 1)
          }
          className={cx(
            {
              'opacity-50': isDisabled,
              'cursor-pointer': currentPage !== 0,
              'transform rotate-180': isLeftArrow,
            },
            'h-16'
          )}
          src="/icons/arrow-no-curve.png"
          alt="Arrow"
        />
      ) : (
        <motion.img
          initial={false}
          animate={{
            rotate: isLeftArrow ? '-180deg' : '0deg',
            scale: isDisabled ? [1, 1, 1] : [1, 1.2, 1],
          }}
          transition={{
            loop: Infinity,
            ease: 'easeIn',
            duration: 1,
          }}
          onClick={() =>
            isLeftArrow
              ? navigateToDirection(-1, currentPage, setPage, maxPage - 1)
              : navigateToDirection(1, currentPage, setPage, maxPage - 1)
          }
          className={cx(
            {
              'opacity-50': isDisabled,
              'cursor-pointer': currentPage !== 0,
              'transform rotate-180': isLeftArrow,
            },
            'h-16'
          )}
          src="/icons/arrow-no-curve.png"
        />
      )}
    </Arrow>
  );
};

export default NavigationArrow;
