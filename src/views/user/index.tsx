import React from 'react'
import styled from 'styled-components'
import Page from '~/components/layout/Page'
import { useTranslation } from 'react-i18next'
import PageLoader from '~/components/PageLoader'
import PageWindow from '~/components/PageWindow'
import useWeb3 from '~/hooks/useWeb3'
import PublicProfile from '~/components/PublicProfile'

const Wrapper = styled.div`
  border-bottom: 2px solid ${({ theme }) => theme.colors.textSubtle};
  margin-bottom: 24px;
  padding-bottom: 24px;
`

const User = ({ match }) => {
  const { t } = useTranslation()
  const { address: account } = useWeb3()

  return (
    <Page>
      <PageWindow>
        <PublicProfile match={match} />
      </PageWindow>
    </Page>
  )
}

export default User
