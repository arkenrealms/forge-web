import React, { cloneElement, ElementType, isValidElement } from 'react';
import getExternalLinkProps from '~/utils/getExternalLinkProps';
import StyledButton from './StyledButton';
import { ButtonProps, scales, variants } from './types';

const Button = (props: any): any => {
  const { startIcon, endIcon, external, className, isLoading, disabled, children, ...rest } = props;
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
      {...rest}>
      <>
        {isValidElement(startIcon) && cloneElement(startIcon, {})}
        {children}
        {isValidElement(endIcon) && cloneElement(endIcon, {})}
      </>
    </StyledButton>
  );
};

Button.defaultProps = {
  isLoading: false,
  external: false,
  variant: variants.PRIMARY,
  scale: scales.MD,
  disabled: false,
};

export default Button;
