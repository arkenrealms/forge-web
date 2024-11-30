import React from 'react';
import styled, { css, DefaultTheme } from 'styled-components';
import { space } from 'styled-system';
import { CardProps } from './types';

interface StyledCardProps extends CardProps {
  theme: DefaultTheme;
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

  ${space}
`;

StyledCard.defaultProps = {
  isActive: false,
  isSuccess: false,
  isWarning: false,
  isDisabled: false,
};

const StyledCard2 = function (props) {
  return (
    <StyledCard className="app__styled-card2" {...props}>
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
      {props.children}
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
