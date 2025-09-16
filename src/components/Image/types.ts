import { SpaceProps } from 'styled-system';

export interface ContainerProps {
  height?: number;
  width?: number;
  responsive?: boolean;
}

export interface ImageProps extends ContainerProps, SpaceProps {
  src: string;
  alt?: string;
}
