import React from 'react';
import styled from 'styled-components';
import Heading from '../Heading/Heading';
import Flex from '../Box/Flex';
import { ArrowBackIcon, CloseIcon } from '../Svg';
import { IconButton } from '../Button';
import { InjectedProps } from './types';
import { Card2 } from '../Card/Card2';

interface Props extends InjectedProps {
  title: string;
  hideCloseButton?: boolean;
  onBack?: () => void;
  bodyPadding?: string;
}

const StyledModal = styled(Card2)`
  background: ${({ theme }) => theme.modal.background};
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: auto;
    min-width: 360px;
    max-width: 100%;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 12px 24px;
`;

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`;

const Modal: React.FC<any> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
  ...props
}) => (
  <StyledModal className="app__styled-card2" {...props}>
    <ModalHeader>
      <ModalTitle>
        {onBack && (
          <IconButton variant="text" onClick={onBack} area-label="go back" mr="8px">
            <ArrowBackIcon color="primary" />
          </IconButton>
        )}
        <Heading>{title}</Heading>
      </ModalTitle>
      {!hideCloseButton && (
        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="primary" />
        </IconButton>
      )}
    </ModalHeader>
    <Flex flexDirection="column" p={bodyPadding}>
      {children}
    </Flex>
  </StyledModal>
);

export default Modal;
