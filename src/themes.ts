import { DefaultTheme } from 'styled-components'
import type { MainTheme } from '@arken/forge-ui/themes'
import _ from 'lodash'

export const lightBaseTheme: MainTheme = {
  isDark: false,
  colors: {
    primary: '#6200ee',
    primaryVariant: '#ede6ff',
    secondary: '#008073',
    secondaryVariant: '#deffff',
    colorBgLayout: '#e3e7ee',
    bodyBackground: '#fff',
    contentBackground: '#f3f3f3',
  },
  fonts: {
    material: 'Lato',
    default: 'Lato',
  },
}

export const lightTheme: any = {
  base: lightBaseTheme,
  cerebro: _.merge(lightBaseTheme, {
    colors: {
      bodyBackground: '#e3e7ee',
      colorBgLayout: '#e3e7ee',
      contentBackground: '#fff',
    },
  }),
}

export const darkBaseTheme: MainTheme = {
  isDark: true,
  colors: {
    primary: '#6200ee',
    primaryVariant: '#ede6ff',
    secondary: '#008073',
    secondaryVariant: '#deffff',
    bodyBackground: '#f5f5f5',
    colorBgLayout: '#e3e7ee',
    contentBackground: '#000',
  },
  fonts: {
    material: 'Lato',
    default: 'Lato',
  },
}

export const darkTheme: any = {
  base: darkBaseTheme,
  cerebro: _.merge(darkBaseTheme, {
    colors: {
      bodyBackground: '#000',
    },
  }),
}
