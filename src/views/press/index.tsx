import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import BottomCTA from '~/components/BottomCTA'
import Page from '~/components/layout/Page'
import { useModal } from '~/components/Modal'
import { PurchaseModal } from '~/components/PurchaseModal'
import { Button, Card, CardBody, Flex, Heading, Link } from '~/ui'

const Image = styled.img`
  border-radius: 7px;
`

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`
const PitchCard = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    flex: 1;
    flex-direction: row;

    & > div:first-child {
      flex-grow: 0;
      flex-shrink: 0;
    }

    & > div {
    }
  }
`
const Textarea = styled.textarea`
  width: 400px;
  height: 150px;
  text-transform: none;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #fff;
  padding: 10px;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
`
const Rules = () => {
  const { t } = useTranslation()
  const [showVision, setShowVision] = useState(false)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  return (
    <Page>
      <Card style={{ maxWidth: 1200, margin: '0 auto 30px auto', width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Rune Press Kit')}
        </Heading>
        <hr />
        <CardBody>
          <img src="/images/chars.png" />
          <br />
          <br />
          <Flex justifyContent="space-between" alignItems="center">
            <Button
              as={Link}
              href="https://drive.google.com/file/d/1uxUZq7o5fW3_feDqDuMH0pzPvgJWSAJc/view?usp=sharing"
              style={{ margin: '0 auto' }}>
              Download
            </Button>
          </Flex>
        </CardBody>
      </Card>
      <Card style={{ maxWidth: 1200, margin: '0 auto 30px auto', width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Banners')}
        </Heading>
        <hr />
        <CardBody>
          <Heading as="h2" size="lg" color="#fff" mb="24px">
            Embed HTML
          </Heading>
          <br />
          <br />
          <h2>Mobile:</h2>
          <br />
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe title="arken.gg" src="/ads/1/mobile/index.html#u=join" style="width: 100%; height: 200px;"></iframe>`,
            }}
          />
          <br />
          <Textarea rows={10}>{`
<iframe title="arken.gg" src="https://arken.gg/ads/1/mobile/index.html#u=join" style="width: 100%; height: 200px;"></iframe>
`}</Textarea>
          <br />
          <br />
          <h2>Desktop:</h2>
          <br />
          <div
            dangerouslySetInnerHTML={{
              __html: `<iframe title="arken.gg" src="/ads/1/desktop/index.html#u=join" style="width: 100%; height: 48px;"></iframe>`,
            }}
          />
          <br />
          <Textarea rows={10}>{`
<iframe title="arken.gg" src="https://arken.gg/ads/1/desktop/index.html#u=join" style="width: 100%; height: 48px;"></iframe>
`}</Textarea>
        </CardBody>
      </Card>
      <BottomCTA />
    </Page>
  )
}

export default Rules
