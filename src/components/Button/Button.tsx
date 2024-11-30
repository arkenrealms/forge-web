import React, { cloneElement, ElementType, isValidElement } from 'react';
import getExternalLinkProps from '~/utils/getExternalLinkProps';
import StyledButton from './StyledButton';
import { ButtonProps, scales, variants } from './types';

const Button = ({
  startIcon,
  endIcon,
  external = false,
  className,
  isLoading = false,
  disabled = false,
  variant = variants.PRIMARY,
  scale = scales.MD,
  children,
  ...rest
}: any): any => {
  const internalProps = external ? getExternalLinkProps() : {};
  const isDisabled = isLoading || disabled;
  const classNames = className ? [className] : [];

  if (isLoading) {
    classNames.push('arcane-button--loading');
  }

  if (isDisabled && !isLoading) {
    classNames.push('arcane-button--disabled');
  }

  return (
    <StyledButton
      $isLoading={isLoading}
      className={classNames.join(' ')}
      disabled={isDisabled}
      {...internalProps}
      variant={variant}
      scale={scale}
      {...rest}>
      <>
        {isValidElement(startIcon) && cloneElement(startIcon, {})}
        {children}
        {isValidElement(endIcon) && cloneElement(endIcon, {})}
      </>
    </StyledButton>
  );
};

export default Button;
