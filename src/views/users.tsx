import React from 'react'
import Users from '~/components/Users'
import Layout from '~/components/Layout'

export default ({ themeConfig }: any) => {
  return (
    <Layout>
      <Users themeConfig={themeConfig} />
    </Layout>
  )
}
