import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div``

export default ({ children }) => {
  return (
    <div
      css={css`
        font-family: 'Alegreya Sans', sans-serif, monospace;
        text-transform: none;
        color: rgb(204, 204, 204);
      `}
    >
      {children}
    </div>
  )
}
