import React from 'react'
import styled from 'styled-components'

export interface TooltipProps {
  content: React.ReactNode
}

const TooltipContent = styled.div`
  background: ${({ theme }) => theme.tooltip.background};
  padding: 16px;
  border-radius: 16px;
  // color: ${({ theme }) => theme.tooltip.text};
  color: #000;
  width: max-content;
  display: none;
  padding: 16px;
  max-height: 500px;
  z-index: ${({ theme }) => theme.zIndices.modal};
  position: absolute;
  bottom: calc(100% + 16px);
  transform: translate(34px, 0);
  right: 0;
  max-width: 246px;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;

  &:after {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid ${({ theme }) => theme.tooltip.background};
    bottom: 0;
    position: absolute;
    transform: translate(-34px, 9px);
    right: 0;
  }
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
