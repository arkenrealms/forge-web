import styled from 'styled-components';
import { OverlayProps } from './types';

const Overlay = styled.div.attrs({ role: 'presentation' })<OverlayProps>`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: ${({ show = false }) => (show ? 'block' : 'none')};
  transition: opacity 0.4s;
  opacity: ${({ show = false }) => (show ? 0.6 : 0)};
  z-index: ${({ zIndex = 10 }) => zIndex};
  pointer-events: ${({ show = false }) => (show ? 'initial' : 'none')};
`;

export default Overlay;
