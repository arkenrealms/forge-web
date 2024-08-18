import React from 'react';
import styled from 'styled-components';
import { SvgProps } from '../types';

const Icon: React.FC<SvgProps> = (props) => {
  return <Img>{/* <img src="/images/no-profile.png" width={32} height={32} style={{ maxWidth: '32px' }} /> */}</Img>;
};

const Img = styled.div`
  filter: grayscale(1) drop-shadow(0px 0px 2px #444);
  &:hover {
    filter: drop-shadow(0px 0px 2px #444);
  }
`;

export default Icon;
