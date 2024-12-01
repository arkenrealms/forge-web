import React from 'react';
import styled from 'styled-components';
import useWindowSize from '~/hooks/useWindowSize';

const Viewport = styled.div`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  height: 100%;
  width: 100%;

  overflow: hidden;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.35);

  overflow: visible;
`;
const ViewportContent = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`;
const BottomCornersCover = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  background: black;
  z-index: 999;
  height: 0;
  height: var(--safe-area-inset-bottom);
`;
export default ({ children, maxWidth = 450, maxHeight = 896 }) => {
  // const [width, height] = useWindowSize()
  return (
    <>
      {children}
      <BottomCornersCover />
    </>
  );
};
