import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, LinkExternal, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import BottomCTA from '~/components/BottomCTA'
import i18n from '~/config/i18n'

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
const Rules = () => {
  const { t } = useTranslation()
  const [showVision, setShowVision] = useState(false)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  return (
    <Page>
      <Card style={{ maxWidth: 1200, margin: '0 auto 30px auto', width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Polls')}
        </Heading>
        <hr />
        <CardBody>
          <p>Rune was launched March 28, 2021.</p>
          <br />
          <br />

          <PitchCard>
            <div style={{ width: '280px', marginTop: '-20px' }}>
              <img src="/images/nfts/sorceress.png" alt="Metaverse"></img>
            </div>
            <div>
              <BoxHeading as="h2" size="xl">
                {t('Metaverse')}
              </BoxHeading>
              <br />
              <p>
                Explore the depths of the Arken Realms. Immerse yourself in our Play4Rewards fantasy games, winning Rune
                tokens and NFTs, trade them on our NFT Marketplace and participate in NFT farms and pools.
                <br />
                <br />
                <ul>
                  <li>NFT Service (token IDs + metadata)</li>
                  <li>P2E Service (secure rewards)</li>
                  <li>RNG Service (transparency)</li>
                  <li>Lend Service (boost + consume items)</li>
                  <li>Gear Service (access to multiple character inventory)</li>
                  <li>Game Service (Unity game server for logic)</li>
                  <li>Cache Service (compiles &amp; distributes web3 cache)</li>
                </ul>
              </p>
            </div>
          </PitchCard>
        </CardBody>
      </Card>
      <BottomCTA />
    </Page>
  )
}

export default Rules
