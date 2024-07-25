import React from 'react'
import styled from 'styled-components'
import { SvgProps } from '../../Svg'
import * as IconModule from '../icons'
import Accordion from './Accordion'
import { MenuEntry, LinkLabel } from './MenuEntry'
import MenuLink from './MenuLink'
import { PanelProps, PushedProps } from '../types'

interface Props extends PanelProps, PushedProps {
  isMobile: boolean
  location: string
}

const Icons = IconModule as unknown as { [key: string]: React.FC<SvgProps> }

const Container = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`

const PanelBody: React.FC<Props> = ({ location, isPushed, pushNav, isMobile, links }) => {
  // Close the menu when a user clicks a link on mobile
  const handleClick = isMobile ? () => pushNav(false) : undefined

  return (
    <Container>
      {links.map((entry) => {
        const Icon = Icons[entry.icon]
        const iconElement = <Icon width="24px" mr="8px" />
        const calloutClass = entry.calloutClass ? entry.calloutClass : undefined

        if (entry.items) {
          const itemsMatchIndex = entry.items.findIndex((item) => item.href === location)
          const initialOpenState = entry.initialOpenState === true ? entry.initialOpenState : itemsMatchIndex >= 0
          return (
            <Accordion
              key={entry.label}
              isPushed={isPushed}
              pushNav={pushNav}
              icon={iconElement}
              label={entry.label}
              initialOpenState={initialOpenState}
              className={calloutClass}
              isActive={false}>
              {entry.items.map((item) => (
                // <div key={item.href}>{item.label}</div>
                <MenuEntry key={item.href} secondary isActive={false} onClick={handleClick}>
                  <MenuLink href={item.href}>{item.label}</MenuLink>
                </MenuEntry>
              ))}
            </Accordion>
          )
        }
        return (
          <MenuEntry key={entry.label} isActive={false} className={calloutClass}>
            <MenuLink href={entry.href} onClick={handleClick}>
              {iconElement}
              <LinkLabel isPushed={isPushed}>{entry.label}</LinkLabel>
            </MenuLink>
          </MenuEntry>
        )
      })}
    </Container>
  )
}

export default PanelBody
