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
  box-shadow: ${getBoxShadow};

  ${space}
`;

const StyledCard4: React.FC<CardProps> = (props) => {
  return (
    <StyledCard className="app__styled-card4" {...props}>
      <div
        className="app__styled-card4--bg"
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

export const Card4: React.FC<CardProps> = ({ ribbon, children, ...props }) => {
  return (
    <StyledCard4 {...props}>
      {ribbon}
      {children}
    </StyledCard4>
  );
};
