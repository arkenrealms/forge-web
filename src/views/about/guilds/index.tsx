import React from 'react'
import styled, { css } from 'styled-components'
import { AutoRenewIcon, Flex, Heading, Card, CardBody, Skeleton } from '~/ui'
import orderBy from 'lodash/orderBy'
import { useTeams } from '~/state/hooks'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'
import PageLoader from '~/components/PageLoader'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import InnerGuilds from '~/components/Guilds'

const aaa = styled.div``
const Guilds = () => {
  return (
    <Page>
      <InnerGuilds />
    </Page>
  )
}

export default Guilds
