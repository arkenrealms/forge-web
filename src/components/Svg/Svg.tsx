import styled, { css, keyframes } from 'styled-components';
import { space } from 'styled-system';
import getThemeValue from '~/utils/getThemeValue';
import { SvgProps } from './types';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const spinStyle = css`
  animation: ${rotate} 2s linear infinite;
`;

const Svg = styled.svg.attrs<SvgProps>((props) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  width: props.width || '20px',
  color: props.color || 'text',
  spin: props.spin || false,
}))<SvgProps>`
  fill: ${({ theme, color }) => getThemeValue(`colors.${color}`, color)(theme)};
  flex-shrink: 0;

  ${({ spin }) => spin && spinStyle}
`;

export default Svg;
