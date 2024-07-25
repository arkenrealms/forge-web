import React from 'react'
import Referrals from '~/components/Referrals'
import AdminLayout from '~/components/Layout'

export default ({ themeConfig }: any) => {
  return (
    <AdminLayout>
      <Referrals themeConfig={themeConfig} />
    </AdminLayout>
  )
}
