import React from 'react'
import styled from 'styled-components'
import { Heading, Text, BaseLayout } from '~/ui'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'

const Marketplace: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <PageWindow>
        <Heading as="h1" size="xxl" color="secondary" mb="8px">
          {t('Marketplace')}
        </Heading>
        <Heading as="h2" size="lg" mb="8px">
          {t('Coming soon')}
        </Heading>
      </PageWindow>
    </Page>
  )
}

export default Marketplace
