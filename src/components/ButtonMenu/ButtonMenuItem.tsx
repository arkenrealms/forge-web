import React from 'react';
import styled from 'styled-components';
import Button from '../Button3/Button';
import { BaseButtonProps, PolymorphicComponent, variants } from '../Button3/types';
import { ButtonMenuItemProps } from './types';

interface InactiveButtonProps extends BaseButtonProps {
  forwardedAs: BaseButtonProps['as'];
  colorkey: 'primary' | 'textSubtle';
}

const InactiveButton: any = styled(Button)<InactiveButtonProps>`
  background-color: transparent;
  color: ${({ theme, colorkey }) => theme.colors[colorkey]};
  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }
`;

const ButtonMenuItem: any = ({ isActive = false, variant = variants.PRIMARY, as, ...props }: ButtonMenuItemProps) => {
  if (!isActive) {
    return (
      <InactiveButton
        forwardedAs={as}
        variant="tertiary"
        colorkey={variant === variants.PRIMARY ? 'primary' : 'textSubtle'}
        {...props}
      />
    );
  }

  return <Button as={as} variant={variant} {...props} />;
};

export default ButtonMenuItem;
