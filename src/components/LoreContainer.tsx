import React from 'react';
import styled, { css } from 'styled-components';

const zzz = styled.div``;

export default function ({ children, color = 'default', ...rest }) {
  return (
    <div
      className="lore-container"
      css={[
        css`
          max-width: 1200px;
          margin: 0 auto;
          // background: #000;
          margin-bottom: 30px;
          box-shadow: rgb(0 0 0 / 50%) 0px 2px 25px 10px, rgb(0 0 0 / 10%) 0px -1px 0px 0px inset,
            rgb(0 0 0 / 10%) 0px 0px 66px 66px;
          border-radius: 0 0 7px 7px;
          position: relative;
        `,
        rest.wrapperCss,
      ]}>
      <div
        css={css`
          position: absolute;
          left: 8px;
          top: 8px;
          right: 8px;
          bottom: 8px;
          z-index: -1;
          pointer-events: none;
          border-style: solid;
          border-width: 1px;
          border-color: rgba(255, 217, 0, 0.1);
          border-radius: 6px;
          background-color: hsla(0, 0%, 100%, 0.04);

          background-image: linear-gradient(180deg, rgba(114, 255, 182, 0.06), rgba(253, 255, 144, 0.06));
          box-shadow: 1px 1px 17px 0 rgba(0, 0, 0, 0.38);
          opacity: 0.5;

          ${color === 'navy'
            ? 'background-image: linear-gradient(221deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(37, 28, 3, 0.46)), linear-gradient(180deg, rgba(54, 93, 116, 0.13), rgba(54, 93, 116, 0.13)), url("/images/bg-brighter.jpg");'
            : ''}
          ${color === 'red'
            ? 'background-image: linear-gradient(221deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(26, 3, 3, 0.46)), linear-gradient(180deg, rgba(75, 54, 116, 0.13), rgba(75, 54, 116, 0.13)), url("/images/bg-brighter.jpg");'
            : ''}
          ${color === 'blue'
            ? 'background-image: linear-gradient(221deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(12, 62, 119, 0.46)), linear-gradient(180deg, rgba(14, 170, 209, 0.13), rgba(14, 170, 209, 0.13)), url("/images/bg-brighter.jpg");'
            : ''}
          ${color === 'orange'
            ? 'background-image: linear-gradient(221deg, rgba(0, 0, 0, 0.35), transparent 31%, rgba(71, 71, 71, 0.46)), url("/images/bg-brighter.jpg");'
            : ''}
          ${color === 'light'
            ? 'background-image: linear-gradient(180deg, rgba(173, 145, 83, 0.2), rgba(173, 145, 83, 0.2)), url("/images/background.jpg");'
            : ''}
          ${color === 'dark' ? 'background: rgba(0, 0, 0, 0.5);' : ''}
          ${color === 'none' ? 'background: none; box-shadow: unset; border: 0 none;' : ''}
        `}
      />
      {color !== 'none' ? (
        <div
          css={css`
            position: fixed;
            left: 2px;
            top: auto;
            right: 2px;
            bottom: 2px;
            z-index: 20;
            display: block;
            height: 50%;
            pointer-events: none;

            background-image: linear-gradient(180deg, transparent 53%, rgba(0, 0, 0, 0.5) 82%, #000);
          `}
        />
      ) : null}
      {color === 'dark' ? (
        <div
          css={css`
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: -2;
            pointer-events: none;
            border-style: solid;
            border-width: 1px;
            border-color: rgba(255, 217, 0, 0.1);
            border-radius: 6px;
            background-color: hsla(0, 0%, 100%, 0.04);

            background-image: linear-gradient(180deg, rgba(114, 255, 182, 0.06), rgba(253, 255, 144, 0.06));
            box-shadow: 1px 1px 17px 0 rgba(0, 0, 0, 0.38);
            opacity: 0.5;
            background: #000;
          `}
        />
      ) : null}
      {children}
    </div>
  );
}
