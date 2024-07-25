import React from 'react'
import Dashboard from '~/components/Dashboard'
import Layout from '~/components/Layout'

export default ({ themeConfig }: any) => {
  return (
    <div style={{ padding: 25 }}>
      <Layout>
        <Dashboard />
      </Layout>
    </div>
  )
}
