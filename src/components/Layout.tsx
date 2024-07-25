import React, { useEffect, useState } from 'react'
import { EllipsisOutlined } from '@ant-design/icons'
import type { TourProps } from 'antd'
import styled, { createGlobalStyle, css } from 'styled-components'
import { Layout, Spin, Button, Modal, Divider, Space, Tour, Tabs } from 'antd'
import _ from 'lodash'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { FloatButton } from 'antd'
import { useAuth } from '@arken/forge-ui/hooks/useAuth'
import Header from './Header'
import Footer from './Footer'
import { Collapse, Col, Row } from 'antd'

const zzz = styled.div``

const GlobalStyles = createGlobalStyle`
`

export default ({ children }: any) => {
  const history = useNavigate()
  const location = useLocation()
  const { user, permissions, login, logout } = useAuth()

  return (
    <Layout
      css={css`
        background: none;
        overflow: hidden;
        padding-bottom: 3px;
      `}
    >
      <GlobalStyles />
      <Header user={user} permissions={permissions} login={login} logout={logout} />
      {children}
      <Footer />
    </Layout>
  )
}
