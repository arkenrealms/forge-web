import React from 'react'
import styled, { css } from 'styled-components'
import { Layout } from 'antd'

const { Footer } = Layout

const CustomFooter = styled(Footer)`
  display: flex;
  align-self: center;
  flex: 1;
  align-items: end;
  margin-top: 20px;
`

const AppFooter = () => {
  return (
    <></>
    // <CustomFooter>
    //   <div data-testid="webui-footer-copyright-div">
    //     &copy; {new Date().getFullYear()} Nexus
    //   </div>
    // </CustomFooter>
  )
}

export default AppFooter
