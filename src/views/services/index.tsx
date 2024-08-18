import React, { useState } from 'react'
import { css } from 'styled-components'
import { Breadcrumb, Layout, Button, Menu, theme } from 'antd'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui'
import Page from '~/components/layout/Page'

const { Header, Content, Footer, Sider } = Layout

export default function () {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <Page>
      <Layout style={{ padding: '24px 0' }}></Layout>
    </Page>
  )
}
