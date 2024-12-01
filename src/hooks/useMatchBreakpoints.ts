import { useEffect, useState } from 'react';

export type Breakpoints = string[];

export type MediaQueries = {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
  xxxl: string;
  nav: string;
};

export const breakpointMap: { [key: string]: number } = {
  xs: 370,
  sm: 576,
  md: 852,
  lg: 968,
  xl: 1080,
  xxl: 1400,
  xxxl: 1920,
};

export const breakpoints: Breakpoints = Object.values(breakpointMap).map(
  (breakpoint) => `${breakpoint}px`
);

// export const mediaQueries2: MediaQueries = {
//   xs: `@media screen and (min-width: ${breakpointMap.xs}px)`,
//   sm: `@media screen and (min-width: ${breakpointMap.sm}px)`,
//   md: `@media screen and (min-width: ${breakpointMap.md}px)`,
//   lg: `@media screen and (min-width: ${breakpointMap.lg}px)`,
//   xl: `@media screen and (min-width: ${breakpointMap.xl}px)`,
//   xxl: `@media screen and (min-width: ${breakpointMap.xxl}px)`,
//   xxxl: `@media screen and (min-width: ${breakpointMap.xxxl}px)`,
//   nav: `@media screen and (min-width: ${breakpointMap.lg}px)`,
// }

type State = {
  [key: string]: boolean;
};

/**
 * Can't use the media queries from "base.mediaQueries" because of how matchMedia works
 * In order for the listener to trigger we need have have the media query with a range, e.g.
 * (min-width: 370px) and (max-width: 576px)
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList
 */
const mediaQueries: any = (() => {
  let prevMinWidth = 0;

  return Object.keys(breakpointMap).reduce((accum, size, index) => {
    // Largest size is just a min-width of second highest max-width
    if (index === Object.keys(breakpointMap).length - 1) {
      return { ...accum, [size]: `(min-width: ${prevMinWidth}px)` };
    }

    const minWidth = prevMinWidth;
    const breakpoint = breakpointMap[size];

    // Min width for next iteration
    prevMinWidth = breakpoint + 1;

    return { ...accum, [size]: `(min-width: ${minWidth}px) and (max-width: ${breakpoint}px)` };
  }, {});
})();

const getKey = (size: string) => `is${size.charAt(0).toUpperCase()}${size.slice(1)}`;

const useMatchBreakpoints = (): State => {
  const [state, setState] = useState<State>(() => {
    if (!window.matchMedia) return {};

    const values: any = Object.keys(mediaQueries).reduce((accum, size) => {
      const key = getKey(size);
      const mql = window.matchMedia(mediaQueries[size]);
      return { ...accum, [key]: mql.matches };
    }, {});

    const { isMd, isLg, isXl, isXxl, isXxxl } = values;
    const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

    return { ...values, isMobile };
  });

  useEffect(() => {
    // Create listeners for each media query returning a function to unsubscribe
    const handlers = Object.keys(mediaQueries).map((size) => {
      if (!window.matchMedia) return () => {};

      const mql = window.matchMedia(mediaQueries[size]);

      const handler = (matchMediaQuery: any) => {
        const key = getKey(size);
        setState((prevState) => ({
          ...prevState,
          [key]: matchMediaQuery.matches,
        }));
      };

      // Safari < 14 fix
      if (mql.addEventListener) {
        mql.addEventListener('change', handler);
      }

      return () => {
        // Safari < 14 fix
        if (mql.removeEventListener) {
          mql.removeEventListener('change', handler);
        }
      };
    });

    return () => {
      handlers.forEach((unsubscribe) => {
        unsubscribe();
      });
    };
  }, [setState]);

  return state;
};

export default useMatchBreakpoints;
