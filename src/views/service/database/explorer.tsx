import React from 'react'
import { css } from 'styled-components'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui'
import Page from '~/components/layout/Page'

export default function () {
  return (
    <Page>
      <Card style={{ overflow: 'visible' }}>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px" css={css``}>
                Database Explorer
              </Heading>
              {/* <Text as="p">Navigate metaverse</Text> */}
            </div>
          </Flex>
        </CardHeader>
        <CardBody
          css={css`
            padding: 0;
            filter: hue-rotate(15deg);
          `}
        >
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            <iframe title="zz" src="http://localhost:5555" style={{ width: '100%', height: 900 }} />
          </Flex>
        </CardBody>
      </Card>
    </Page>
  )
}
