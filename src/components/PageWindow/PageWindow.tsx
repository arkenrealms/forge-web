import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

interface PageWindowProps {
  theme: DefaultTheme
}

/**
 * Priority: Warning --> Success --> Active
 */
const getBoxShadow = ({ theme }: PageWindowProps) => {
  return theme.card.boxShadow
}

// const Container = styled.div<PageWindowProps>`
//   box-shadow: ${getBoxShadow};
//   color: ${({ theme }) => theme.colors.text};
//   position: relative;

//   border-width: 40px 40px;
//   border-style: solid;
//   border-color: inherit;
//   border-image: url('/images/pop_up_window_B.png') 900 repeat;
//   border-image-width: 600px;
//   background-color: rgba(0, 0, 0, 0.4);
//
// background-size: 400px;
//   box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);

//   margin: 0px;
//   width: 100%;
// `
const Container = styled.div<PageWindowProps>`
  box-shadow: ${getBoxShadow};
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  margin: 0px;
  width: 100%;
`

const PageWindow = ({ children }) => {
  return <Container>{children}</Container>
}

PageWindow.defaultProps = {}

export default PageWindow
