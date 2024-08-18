import React, { useLayoutEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useSettings from '~/hooks/useSettings2';
import Svg from '../../Svg/Svg';
import { SvgProps } from '../../Svg/types';

interface LogoProps extends SvgProps {
  isDark: boolean;
  isMobile: boolean;
  heading: any;
  subheading: any;
}
// f1d497
// aa2b18 - red
// bc3b25 - light red
// c76e4c - lighter red
// b23b24
const Logo: React.FC<LogoProps> = ({ isDark, isMobile, heading, subheading, ...props }) => {
  const [pageLoaded, setPageLoaded] = useState(false);
  const settings = useSettings();
  const textColor = isDark ? '#FFFFFF' : '#000000';

  useLayoutEffect(() => {
    if (!window || !window.document || !window.location) return;
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0'
    )
      return;

    function switchToFancyLogo() {
      setTimeout(() => {
        setPageLoaded(true);
      }, 100);
    }

    if (window.document.readyState === 'complete') {
      switchToFancyLogo();
    } else {
      window.addEventListener('load', switchToFancyLogo);
    }

    return () => window.removeEventListener('load', switchToFancyLogo);
  }, []);

  return (
    <div
      css={css`
        animate: opacity 1.5s;

        opacity: ${pageLoaded ? 1 : 0};
      `}>
      <Heading>{heading}</Heading>
      <div
        css={css`
          margin-top: 4px;
          margin-left: 3px;
          font-family: 'Alegreya Sans', sans-serif, monospace;
          color: #d8c692;
          font-size: 16px;
          line-height: 16px;
          font-weight: 500;
          letter-spacing: 6px;
          white-space: nowrap;
        `}>
        {subheading}
      </div>
    </div>
  );
};

const Heading = styled.div`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #cecece;
  text-transform: uppercase;
  line-height: 1em;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  margin-bottom: -6px;
  font-size: 33px;
  // letter-spacing: 3px;
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
  transform: scale(1, 1);

  &,
  span {
    font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif !important;
    font-weight: normal;
  }
`;

const HeadingSilver = styled.div`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #cecece;
  text-transform: uppercase;
  line-height: 1em;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif !important;
  font-size: 42px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 3px rgba(0, 0, 0, 0.3));
`;

// const HeadingFire = styled.div`
//   background-image: -webkit-linear-gradient(
//     top,
//     #bcbcbc 0%,
//     #bcbcbc 17.5%,
//     #cecece 33.75%,
//     #f0f0f0 50%,
//     #cecece 63.75%,
//     #bcbcbc 77.5%,
//     #bcbcbc 100%
//   );
//   -webkit-background-clip: text;
//   // -webkit-text-fill-color: transparent;
//   color: #000;
//   text-transform: uppercase;
//   line-height: 1em;
//   font-family: "FMB", "Palatino Linotype", "Times", serif;
//   font-size: 48px;
//   font-weight: bold;
//   margin-top: 5px;
//   // filter: sepia(1) saturate(5) hue-rotate(-25deg);
//   // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)

//   -webkit-animation: fire 1.5s infinite;

//   @keyframes fire {
//     0% {
//       text-shadow: 0 0 2px #fd3, 0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px #ff3,
//         ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
//           ${(props) => props.fireStrength * 6}px #fd3,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
//           ${(props) => props.fireStrength * 11}px #f80,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 18}px #f20;
//     }
//     25% {
//       text-shadow: 0 0 3px #fd3,
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -6}px
//           ${(props) => props.fireStrength * 5}px #ff3,
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
//           ${(props) => props.fireStrength * 7}px #fd3,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -16}px
//           ${(props) => props.fireStrength * 13}px #f80,
//         ${(props) => props.fireStrength * -0}px ${(props) => props.fireStrength * -26}px
//           ${(props) => props.fireStrength * 20}px #f20;
//     }
//     50% {
//       text-shadow: 0 0 3px #fd3,
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -4}px
//           ${(props) => props.fireStrength * 6}px #ff3,
//         ${(props) => props.fireStrength * 0}px ${(props) => props.fireStrength * -12}px
//           ${(props) => props.fireStrength * 6}px #fd3,
//         ${(props) => props.fireStrength * -3}px ${(props) => props.fireStrength * -16}px
//           ${(props) => props.fireStrength * 15}px #f80,
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -28}px
//           ${(props) => props.fireStrength * 22}px #f20;
//     }
//     75% {
//       text-shadow: 0 0 2px #fd3,
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -7}px
//           ${(props) => props.fireStrength * 4}px #ff3,
//         ${(props) => props.fireStrength * 1}px ${(props) => props.fireStrength * -11}px
//           ${(props) => props.fireStrength * 8}px #fd3,
//         ${(props) => props.fireStrength * -1}px ${(props) => props.fireStrength * -14}px
//           ${(props) => props.fireStrength * 12}px #f80,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 21}px #f20;
//     }
//     100% {
//       text-shadow: 0 0 2px #fd3, 0 ${(props) => props.fireStrength * -5}px ${(props) => props.fireStrength * 4}px #ff3,
//         ${(props) => props.fireStrength * 2}px ${(props) => props.fireStrength * -10}px
//           ${(props) => props.fireStrength * 6}px #fd3,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -15}px
//           ${(props) => props.fireStrength * 11}px #f80,
//         ${(props) => props.fireStrength * -2}px ${(props) => props.fireStrength * -25}px
//           ${(props) => props.fireStrength * 18}px #f20;
//     }
//   }
// `;

export default React.memo(Logo, (prev, next) => prev.isDark === next.isDark);
