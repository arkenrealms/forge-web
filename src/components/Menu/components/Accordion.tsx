import React, { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { MENU_ENTRY_HEIGHT } from '../config'
import { LinkLabel, MenuEntry } from './MenuEntry'
import { PushedProps } from '../types'
import { ArrowDropDownIcon, ArrowDropUpIcon } from '../../Svg'

interface Props extends PushedProps {
  label: string
  icon: React.ReactElement
  initialOpenState?: boolean
  className?: string
  children: ReactNode
  isActive?: boolean
  entryCss?: any
  contentCss?: any
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // Safari fix
  flex-shrink: 0;
`

const AccordionContent = styled.div<{ isOpen: boolean; isPushed: boolean; maxHeight: number }>`
  max-height: ${({ isOpen, isPushed, maxHeight }) => (isOpen && isPushed ? `${maxHeight}px` : 0)};
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  border-color: ${({ isOpen, isPushed }) => (isOpen && isPushed ? 'rgba(133, 133, 133, 0.1)' : 'transparent')};
  border-style: solid;
  border-width: 1px 0;
`

const Accordion: React.FC<Props> = ({
  label,
  icon,
  isPushed,
  pushNav,
  initialOpenState = false,
  children,
  className,
  isActive,
  entryCss,
  contentCss,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpenState)

  const handleClick = () => {
    if (isPushed) {
      setIsOpen((prevState) => !prevState)
    } else {
      pushNav(true)
      setIsOpen(true)
    }
  }

  return (
    <Container>
      <MenuEntry onClick={handleClick} className={className} isActive={isActive} css={entryCss || css``}>
        {icon}
        <LinkLabel isPushed={isPushed}>{label}</LinkLabel>
        {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      </MenuEntry>
      <AccordionContent
        isOpen={isOpen}
        isPushed={isPushed}
        maxHeight={React.Children.count(children) * MENU_ENTRY_HEIGHT}
        css={contentCss || css``}
      >
        {children}
      </AccordionContent>
    </Container>
  )
}

export default React.memo(Accordion, (prev, next) => prev.isPushed === next.isPushed)
