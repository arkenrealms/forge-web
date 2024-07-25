import React from 'react'
import Layout from '~/components/Layout'
import Roles from '~/components/Roles'

export default ({ themeConfig }: any) => {
  return (
    <Layout>
      <Roles themeConfig={themeConfig} />
    </Layout>
  )
}
