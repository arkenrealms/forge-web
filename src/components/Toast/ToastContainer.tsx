import React from 'react'
import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import Toast from './Toast'
import { ToastContainerProps } from './types'

const StyledToastContainer = styled.div`
  position: fixed;
  top: 120px;
  right: 0;
  z-index: 1000;
  width: 400px;
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
  // ${({ theme }) => theme.mediaQueries.sm} {
  //   display: block;
  // }

  .enter,
  .appear {
    opacity: 0.01;
  }

  .enter.enter-active,
  .appear.appear-active {
    opacity: 1;
    transition: opacity 250ms ease-in;
  }

  .exit {
    opacity: 1;
  }

  .exit.exit-active {
    opacity: 0.01;
    transition: opacity 250ms ease-out;
  }
`

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove, ttl = 6000, stackSpacing = 24 }) => {
  return (
    <StyledToastContainer>
      <TransitionGroup>
        {toasts.map((toast, index) => (
          <Toast key={toast.id} toast={toast} onRemove={onRemove} ttl={ttl} />
        ))}
      </TransitionGroup>
    </StyledToastContainer>
  )
}

export default ToastContainer
