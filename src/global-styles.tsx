import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  html{
    --bg-color: #f1f1f1;
  }
  html.dark{
    --bg-color: #0F172A;
    --bg-header-color: #0F172A;
  }

  body{
    background-color: var(--bg-color);
  }

  /* latin */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    font-stretch: 100%;
    font-display: swap;
    src: url(/dashboard/fonts/open-sans/OpenSans-Light.woff2) format('woff2');
    unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    src: url(/dashboard/fonts/open-sans/opensans-latin-ext-400.woff2) format('woff2');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    font-stretch: 100%;
    src: url(/dashboard/fonts/open-sans/opensans-latin-400.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-stretch: 100%;
    src: url(/dashboard/fonts/open-sans/opensans-latin-ext-700.woff2) format('woff2');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 700;
    font-stretch: 100%;
    src: url(/dashboard/fonts/open-sans/opensans-latin-700.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Open Sans Condensed';
    font-style: normal;
    font-weight: 700;
    src: url(/dashboard/fonts/open-sans/opensanscondensed-latin-ext-700.woff2) format('woff2');
    unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Open Sans Condensed';
    font-style: normal;
    font-weight: 700;
    src: url(/dashboard/fonts/open-sans/opensanscondensed-latin-700.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    src: url(/dashboard/fonts/Lato/Lato-Black.ttf) format("truetype")
  }

  @font-face {
    font-family: Lato;
    font-style: italic;
    font-weight: 900;
    src: url(/dashboard/fonts/Lato/Lato-BlackItalic.ttf) format("truetype")
  }

  @font-face {
    font-family: Lato;
    font-style: normal;
    font-weight: 700;
    src: url(/dashboard/fonts/Lato/Lato-Bold.ttf) format("truetype")
  }

  @font-face {
    font-family: Lato;
    font-style: italic;
    font-weight: 700;
    src: url(/dashboard/fonts/Lato/Lato-BoldItalic.ttf) format("truetype")
  }

  @font-face {
    font-family: Lato;
    font-style: normal;
    font-weight: 400 500;
    src: url(/dashboard/fonts/Lato/Lato-Regular.ttf) format("truetype")
  }

  @font-face {
    font-family: Lato;
    font-style: italic;
    font-weight: 400 500;
    src: url(/dashboard/fonts/Lato/Lato-Italic.ttf) format("truetype")
  }

  @font-face {
    font-family: ZonaPro;
    font-style: normal;
    font-weight: 700;
    src: url(/dashboard/fonts/zona-pro/ZonaPro-Bold.otf) format("opentype")
  }

  html {
    height: 100%;
    width: 100%;
  }

  body {
    --safe-area-inset-bottom: constant(safe-area-inset-bottom); 
    --safe-area-inset-bottom: env(safe-area-inset-bottom);
    width: 100%;
    margin: 0;

    
    // &:before {
    //   content: '';
    //   position: fixed;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   height: var(--safe-area-inset-bottom);
    //   z-index: 9999999;
    // }

    background: ${({ theme }) => theme.colors.bodyBackground};
    background-size: stretch;
    line-height: 130%;

    img {
      height: auto;
      max-width: 100%;
      image-rendering: -webkit-optimize-contrast;
    }
    
    button svg {
      vertical-align: -0.125em;
    }

    hr {
      margin-block-start: 15px;
      margin-block-end: 15px;
    }
  }

  #root {
    width: 100%;
    height: 100%;

    background-image: url(https://www.anaconda.com/wp-content/uploads/2024/05/data-globe-hero@3x.png);
    background-attachment: fixed;
    background-repeat: no-repeat;
    background-size: cover;
    background-blend-mode: difference;
  }

  :where(#root) .ant-layout {
    background: transparent !important;
    a {
      &:hover {
        color: #007dc8;
      }
    }
  }

  .App {
    text-align: center;
  }
  
  .App-logo {
    height: 40vmin;
    pointer-events: none;
  }
  
  @media (prefers-reduced-motion: no-preference) {
    .App-logo {
      animation: App-logo-spin infinite 20s linear;
    }
  }
  
  .App-header {
    background-color: #282c34;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: white;
  }
  
  .App-link {
    color: #61dafb;
  }
  
  .ant-form-item-label {
    // margin-right: 8px;
    // text-align: unset !important;
    // overflow: inherit !important;
  }

  .ant-dropdown-button > button {
    width: 110px;
    overflow: hidden;
  }
  
  .ant-dropdown-button > button > span {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-menu-submenu-popup .ant-menu-vertical.ant-menu-sub {
    min-width: 180px !important;
  }
  
  
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @media print {
    input[type=checkbox], input[type=radio] 
    {
      opacity: 1 !important;
    }
  }

  /* Not sure why this was needed, should be covered by the themeConfig in App */
  // .ant-checkbox-inner, .ant-btn, .ant-table-wrapper table, .ant-table-wrapper .ant-table, .ant-table-wrapper .ant-table-container, .ant-table-wrapper .ant-table .ant-table-header, .ant-table-wrapper .ant-table-container table>thead>tr:first-child >*:last-child, .ant-input {
  //   border-radius: 0 !important;
  // }


  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value="9px"]::before {
    content: "9";
    font-size: 9px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="10px"]::before {
    content: "10";
    font-size: 10px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="11px"]::before {
    content: "11";
    font-size: 11px !important;
  }
  .ql-snow .ql-size .ql-picker-item[data-value="12px"]::before {
    content: "12";
    font-size: 12px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="14px"]::before {
    content: "14";
    font-size: 14px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="16px"]::before {
    content: "16";
    font-size: 16px !important;
  }
  .ql-snow .ql-size .ql-picker-item[data-value="18px"]::before {
    content: "18";
    font-size: 18px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="20px"]::before {
    content: "20";
    font-size: 20px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="22px"]::before {
    content: "22";
    font-size: 22px !important;
  }
  .ql-snow .ql-size .ql-picker-item[data-value="24px"]::before {
    content: "24";
    font-size: 24px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="26px"]::before {
    content: "26";
    font-size: 26px !important;
  }

  .ql-snow .ql-size .ql-picker-item[data-value="28px"]::before {
    content: "28";
    font-size: 28px !important;
  }
`
