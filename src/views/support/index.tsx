import React, { useState, useLayoutEffect } from 'react'
import styled, { css } from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Heading, CardBody, Skeleton, Flex } from '~/ui'
import Page from '~/components/layout/Page'

const zzz = styled.div``

const SupportView = () => {
  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          Need Help?
        </Heading>
        <hr />
        <CardBody>
          <strong>Telegram Support:</strong>{' '}
          <a href="https://t.me/RuneReports" target="_blank" rel="noreferrer">
            https://t.me/RuneReports
          </a>
          <br />
          <br />
          <strong>Discord Support:</strong>{' '}
          <a href="https://discord.gg/TqP6ECkB" target="_blank" rel="noreferrer">
            https://discord.gg/TqP6ECkB
          </a>
          <br />
          <br />
          <strong>Email Support:</strong>{' '}
          <a href="mailto:support@arken.gg" target="_blank" rel="noreferrer">
            support@arken.gg
          </a>
        </CardBody>
      </Card>
    </Page>
  )
}

export default SupportView
