import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { space } from 'styled-system';
import { CardProps } from './types';

interface StyledCardProps extends CardProps {
  theme?: DefaultTheme;
  isActive?: boolean;
  isSuccess?: boolean;
  isWarning?: boolean;
  isDisabled?: boolean;
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ isActive = false, isSuccess = false, isWarning = false, theme }: StyledCardProps) => {
  if (isWarning) {
    return theme.card.boxShadowWarning;
  }

  if (isSuccess) {
    return theme.card.boxShadowSuccess;
  }

  if (isActive) {
    return theme.card.boxShadowActive;
  }

  return theme.card.boxShadow;
};

const StyledCard = styled.div<StyledCardProps>`
  overflow: hidden;
  position: relative;

  // border-style: solid;
  // border-color: transparent;
  // border-image: url('/images/frame.png') 120 repeat;
  // border-image-width: 80px;
  // background-color: rgba(0, 0, 0, 1);

  // border-radius: 0;

  ${space}
  box-shadow: ${(props) => getBoxShadow(props)};
`;

export default function Card(props: StyledCardProps) {
  const { isActive = false, isSuccess = false, isWarning = false, isDisabled = false, children, ...restProps } = props;

  return (
    <StyledCard
      className="app__styled-card"
      isActive={isActive}
      isSuccess={isSuccess}
      isWarning={isWarning}
      isDisabled={isDisabled}
      {...restProps}>
      <div
        className="app__styled-card--bg"
        css={css`
          position: absolute;
          left: 8px;
          top: 8px;
          right: 8px;
          bottom: 8px;
          z-index: 0;
          pointer-events: none;
        `}
      />
      {children}
    </StyledCard>
  );
}
