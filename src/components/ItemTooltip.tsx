import React from 'react'
import styled from 'styled-components'

export interface TooltipProps {
  content: React.ReactNode
}

const TooltipContent = styled.div`
  width: max-content;
  display: none;
  max-height: 500px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  bottom: -200%;
  transform: translate(34px, 0);
  right: 100%;
  max-width: 400px;
  padding: 100% 0 0 100%;
`

const Container = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${TooltipContent}, &:focus-within ${TooltipContent} {
    display: block;
  }
`

const Tooltip: React.FunctionComponent<any> = ({ content, children, ...props }) => {
  return (
    <Container {...props}>
      {children}
      <TooltipContent>{content}</TooltipContent>
    </Container>
  )
}

export default Tooltip
