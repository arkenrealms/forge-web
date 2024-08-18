import React from 'react'
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui'

export default function () {
  return (
    <>
      <Card style={{ overflow: 'visible' }}>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <div>
              <Heading size="lg" mb="8px">
                Metaverses
              </Heading>
              <Text as="p">Navigate metaverse</Text>
              {/* <Text as="p">{t('Collecting points for these quests makes them available again.')}</Text> */}
            </div>
          </Flex>
        </CardHeader>
        <CardBody>
          <Flex flexDirection="row" alignItems="center" justifyContent="center">
            {/* <iframe src="http://localhost:555" style={{ width: '100%', height: '100%' }} /> */}
          </Flex>
        </CardBody>
      </Card>
    </>
  )
}
