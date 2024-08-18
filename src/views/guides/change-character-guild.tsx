import React from 'react'
import { Card, CardBody, Heading } from '~/ui'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import Page from '~/components/layout/Page'
import PageWindow from '~/components/PageWindow'

const Guide = ({ match }) => {
  const { id }: { id: string } = match.params
  return (
    <Page>
      <PageWindow>
        <Card>
          <CardBody>
            <Heading size="xl" mb="24px">
              Guide: Change Character Guild
            </Heading>
            <ul>
              <ol>
                Go to account <RouterLink to="/account">https://arken.gg/account</RouterLink>
              </ol>
              <ol>Click on Edit Guild Membership</ol>
              <ol>Click Pause Guild Membership</ol>
              <ol>Click I Understand + Confirm</ol>
              <ol>Confirm transaction</ol>
              <ol>
                Go to <RouterLink to="/characters">https://arken.gg/characters</RouterLink>
              </ol>
              <ol>Click your character and click Transfer</ol>
              <ol>Paste address and click Confirm</ol>
            </ul>
          </CardBody>
        </Card>
      </PageWindow>
    </Page>
  )
}

export default Guide
