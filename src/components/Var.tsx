import React from 'react';
import styled, { css } from 'styled-components';

const zzz = styled.div``;

export const Var = (props) => (
  <div>
    {props.icon ? (
      <span
        css={css`
          margin-right: 5px;
        `}>
        {props.icon}
      </span>
    ) : null}
    <span
      css={css`
        margin-right: 20px;
        color: #bb955e;
      `}>
      {props.title}
    </span>{' '}
    <span
      css={css`
        color: #fff;
      `}>
      {props.children}
    </span>
  </div>
);

export default Var;
