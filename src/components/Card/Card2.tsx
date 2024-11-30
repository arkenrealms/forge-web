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
const getBoxShadow = ({ isActive, isSuccess, isWarning, theme }: StyledCardProps) => {
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

  box-shadow: ${(props) => getBoxShadow(props)};
  ${space}
`;

const StyledCard2: React.FC<StyledCardProps> = ({
  isActive = false,
  isSuccess = false,
  isWarning = false,
  isDisabled = false,
  children,
  ...props
}) => {
  return (
    <StyledCard
      className="app__styled-card2"
      isActive={isActive}
      isSuccess={isSuccess}
      isWarning={isWarning}
      isDisabled={isDisabled}
      {...props}>
      <div
        className="app__styled-card2--bg"
        css={css`
          position: absolute;
          left: 8px;
          top: 8px;
          right: 8px;
          bottom: 8px;
          z-index: -1;
          pointer-events: none;
        `}
      />
      {children}
    </StyledCard>
  );
};

export const Card2: React.FC<CardProps> = ({ ribbon, children, ...props }) => {
  return (
    <StyledCard2 {...props}>
      {ribbon}
      {children}
    </StyledCard2>
  );
};
