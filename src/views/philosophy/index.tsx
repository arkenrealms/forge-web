import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon, LinkExternal } from '~/ui'
import Page from '~/components/layout/Page'

const Philosophy = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Philosophy')}
        </Heading>
        <hr />
        <CardBody>
          Our goal is to create a flat decentralized organization where each team member has freedom and ownership in
          what they do. By rewarding talent and dedication, the ownership of the organization will fall into the right
          hands, who are dedicated to building the best competitive gaming experiences, not those only thinking about
          the bottom line.
        </CardBody>
      </Card>
    </Page>
  )
}

export default Philosophy
