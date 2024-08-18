import get from 'lodash/get'
import { DefaultTheme } from 'styled-components'

const getThemeValue =
  (path: string, fallback?: string) =>
  (theme: DefaultTheme): string => {
    // console.log('ffff', theme, path, fallback)
    return get(theme, path, fallback)
  }

export default getThemeValue
