import { Colors } from './types';

export const baseColors = {
  failure: '#ED4B9E',
  primary: '#bb955e',
  primaryBright: '#53DEE9',
  primaryDark: '#0098A1',
  primaryButton: '#6e0000',
  secondary: '#6e0000',
  success: '#31D0AA',
  warning: '#FFB237',
};

export const brandColors = {
  binance: '#F0B90B',
};

export const lightColors: Colors = {
  ...baseColors,
  ...brandColors,
  bodyBackground: '#fff',
  background: '#FAF9FA',
  backgroundDisabled: '#E9EAEB',
  contrast: '#191326',
  invertedContrast: '#FFFFFF',
  input: '#eeeaf4',
  inputSecondary: '#d7caec',
  tertiary: '#EFF4F5',
  text: '#b1754f',
  textDisabled: '#BDC2C4',
  textSubtle: '#8f80ba',
  borderColor: '#E9EAEB',
  card: '#FFFFFF',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)',
  },
};

export const darkColors: Colors = {
  ...baseColors,
  ...brandColors,
  bodyBackground: '#000',
  secondary: '#fff',
  background: 'rgba(0, 0, 0, 50%)',
  backgroundDisabled: '#3c3742',
  contrast: '#FFFFFF',
  invertedContrast: '#191326',
  input: '#5a3f3f',
  inputSecondary: '#8d6e57',
  primaryDark: '#0098A1',
  tertiary: 'rgba(255, 255, 255, 10%)',
  text: '#bb955e',
  textDisabled: '#666171',
  textSubtle: '#bb955e',
  borderColor: '#28233d',
  card: 'rgb(0 0 0 / 99%)',
  gradients: {
    bubblegum: 'linear-gradient(139.73deg, #313D5C 0%, #3D2A54 100%)',
  },
};
