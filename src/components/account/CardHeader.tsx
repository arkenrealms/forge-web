import styled, { DefaultTheme } from 'styled-components'
import { CardHeader as UIKitCardHeader } from '~/ui'

const getBackground = (theme: DefaultTheme) => {
  if (theme.isDark) {
    return 'linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)'
  }

  return 'linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)'
}

const CardHeader = styled(UIKitCardHeader)`
  background: ${({ theme }) => getBackground(theme)};
  position: relative;
  border-radius: 10px;
  margin: 3px;
`

export default CardHeader
