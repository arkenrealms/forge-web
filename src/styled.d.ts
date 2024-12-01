import type {} from 'styled-components/cssprop';
import { CSSProp } from 'styled-components';
import { MainTheme } from './theme';

// This will make it so any styled theme stuff (DefaultTheme) is extending our theme (MainTheme)
declare module 'styled-components' {
  export interface DefaultTheme extends MainTheme {
    brand?: string;
    name?: string;
    // fonts: { material: 'sans-serif', default: 'sans-serif' },
  }
}

// This will allow <div css={css``} /> to work, and will use the theme type above
declare module 'react' {
  export interface DefaultTheme extends MainTheme {}
  interface Attributes {
    css?: CSSProp<MyTheme>;
  }
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSProp<DefaultTheme>;
  }
}

declare module '*.png' {
  const value: any;
  export default value;
}

declare global {
  interface Window {
    queryClient: any;
  }
}
