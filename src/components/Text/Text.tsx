import styled, { DefaultTheme } from 'styled-components';
import { space, typography } from 'styled-system';
import getThemeValue from '~/utils/getThemeValue';
import { TextProps } from './types';

interface ThemedProps extends TextProps {
  theme: DefaultTheme;
}

const getColor = ({ color = 'text', theme }: ThemedProps) => {
  return getThemeValue(`colors.${color}`, color)(theme);
};

const getFontSize = ({ fontSize, small = false }: TextProps) => {
  return small ? '0.8rem' : fontSize || '1rem';
};

const Text = styled.div<TextProps>`
  color: ${getColor};
  font-size: ${getFontSize};
  font-weight: ${({ bold }) => (bold ? 600 : 400)};
  line-height: 1.5;
  ${({ textTransform }) => textTransform && `text-transform: ${textTransform};`}
  ${space}
  ${typography}
`;

export default Text;
