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
 * Determines the appropriate box shadow based on priority:
 * Warning --> Success --> Active
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

const StyledCard3: React.FC<CardProps> = ({ children, className, ...rest }) => {
  return (
    <StyledCard className={'app__styled-card3 ' + className} {...rest}>
      <div
        className="app__styled-card3--bg"
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

export const Card3: React.FC<CardProps> = ({ ribbon, children, ...props }) => {
  return (
    <StyledCard3 {...props}>
      {ribbon}
      {children}
    </StyledCard3>
  );
};
