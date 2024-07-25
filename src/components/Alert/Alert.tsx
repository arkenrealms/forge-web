import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import CheckmarkCircleIcon from '../Svg/Icons/CheckmarkCircle'
import ErrorIcon from '../Svg/Icons/Error'
import BlockIcon from '../Svg/Icons/Block'
import InfoIcon from '../Svg/Icons/Info'
import { Text } from '../Text'
import { IconButton } from '../Button'
import { CloseIcon } from '../Svg'
import Flex from '../Box/Flex'
import { AlertProps, variants } from './types'

interface ThemedIconLabel {
  variant: AlertProps['variant']
  theme: DefaultTheme
  hasDescription: boolean
}

const getThemeColor = ({ theme, variant = variants.INFO }: ThemedIconLabel) => {
  switch (variant) {
    case variants.DANGER:
      return theme.colors.failure
    case variants.WARNING:
      return theme.colors.warning
    case variants.SUCCESS:
      return theme.colors.success
    case variants.INFO:
    default:
      return theme.colors.secondary
  }
}

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return BlockIcon
    case variants.WARNING:
      return ErrorIcon
    case variants.SUCCESS:
      return CheckmarkCircleIcon
    case variants.INFO:
    default:
      return InfoIcon
  }
}

const IconLabel = styled.div<ThemedIconLabel>`
  background-color: ${getThemeColor};
  // border-radius: 16px 0 0 16px;
  color: ${({ theme }) => theme.alert.background};
  padding: 12px;
`

const withHandlerSpacing = 32 + 12 + 8 // button size + inner spacing + handler position
const Details = styled.div<{ hasHandler: boolean }>`
  flex: 1;
  padding-bottom: 6px;
  padding-left: 6px;
  padding-right: ${({ hasHandler }) => (hasHandler ? `${withHandlerSpacing}px` : '6px')};
  padding-top: 6px;
`

const CloseHandler = styled.div`
  border-radius: 0 16px 16px 0;
  right: 8px;
  position: absolute;
  top: 8px;
`

const StyledAlert = styled(Flex)`
  position: relative;
  border: solid 2px rgba(133, 133, 133, 0.1);
  border-radius: 3px;
  // padding: 0px 5px 0px 0;
  background: #000 url(/images/background.jpeg) repeat-x 0 50%;
  background-size: 400px;
  box-shadow: 0 0px 0 0 rgb(0 0 0 / 80%), inset 0 0 0 0 rgb(0 0 0 / 10%), 0 0 10px 10px rgb(0 0 0 / 10%);
  filter: drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
  color: #fff;
  padding: 4px;
`

const Alert: React.FC<AlertProps> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant)

  return (
    <StyledAlert>
      {/* <IconLabel variant={variant} hasDescription={!!children}>
        <Icon color="currentColor" width="24px" />
      </IconLabel> */}
      <Details hasHandler={!!onClick}>
        <Text bold>{title}</Text>
        {typeof children === 'string' ? <Text as="p">{children}</Text> : children}
      </Details>
      {onClick && (
        <CloseHandler>
          <IconButton scale="sm" variant="text" onClick={onClick}>
            <CloseIcon width="24px" color="currentColor" />
          </IconButton>
        </CloseHandler>
      )}
    </StyledAlert>
  )
}

export default Alert
