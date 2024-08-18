import React, { useEffect, useRef, useState, useContext } from 'react'
import styled, { css } from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import TipCard from '~/components/TipCard'
import Linker from '~/components/Linker'
import i18n from '~/config/i18n'

const Text = styled.div``

const Cards = styled(BaseLayout)`
  display: block;

  ${({ theme }) => theme.mediaQueries.lg} {
    display: grid;
    align-items: stretch;
    justify-content: stretch;
    margin-bottom: 32px;
    grid-gap: 25px;

    & > div {
      grid-column: span 12;
      width: 100%;
    }

    & > div {
      grid-column: span 4;
    }
  }
`

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 0.9rem;
`

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`

const Tag2 = styled(Tag)`
  zoom: 0.7;
`

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  padding: 0 10px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`

const Image = styled.img`
  border-radius: 7px;
`

const ImageBlock = ({ url }) => <Image src={url} />

const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`

const Rules = () => {
  const { t } = useTranslation()
  const [showVision, setShowVision] = useState(false)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  const games = [
    {
      name: 'Arken: Runic Raids',
      path: '/raid',
      image: '/images/games/raid-card.png',
      description: (
        <ul>
          <li>Farm for rune rewards (by staking liquidity).</li>
          <li>Craft items that change harvest mechanics.</li>
        </ul>
      ),
      status: 'released',
    },
    {
      name: 'Arken: Evolution Isles',
      path: '/evolution',
      image: '/images/games/evolution-card.png',
      description: (
        <ul>
          <li>2D Arcade. Simple to play, hard to master.</li>
          <li>P2E by winning rounds & finding items ingame.</li>
          <li>Web, android, iphone, desktop.</li>
        </ul>
      ),
      status: 'beta',
    },
    {
      name: 'Arken: Infinite Arena',
      path: '/infinite',
      image: '/images/games/infinite-card.png',
      description: (
        <ul>
          <li>2D Top Down ARPG. Very fluid action gameplay. </li>
          <li>P2E by winning arena battles.</li>
          <li>Gear-enabled by default.</li>
          <li>Desktop, with web + phone app for certain features.</li>
        </ul>
      ),
      status: 'pending',
    },
    {
      name: 'Arken: Heart of the Oasis',
      path: '/sanctuary',
      image: '/images/games/sanctuary-card.png',
      description: (
        <ul>
          <li>3D MMORPG.</li>
          <li>P2E by finding unique items, winning raid battles, etc.</li>
          <li>Buy land + NPCs + Guild tokens to customize the world around you.</li>
          <li>Desktop, with web + phone app for certain features.</li>
        </ul>
      ),
      status: 'pending',
    },
    {
      name: 'Arken: Guardians Unleashed',
      path: '/guardians',
      image: '/images/games/guardians-card.png',
      description: (
        <ul>
          <li>2D breeding game, generate and hatch pets used in other Arken games.</li>
          <li>Web, android, iphone, desktop.</li>
        </ul>
      ),
      status: 'pending',
    },
  ]

  return (
    <Page>
      <TipCard npc="ramir" id="our-games" heading={t('Our Games')}>
        <p>Hey, you!</p>
        <br />
        <p>
          <Linker id="play" replaceItems={false} replaceStringLinks={false}>
            Here's the low down.. our games are made to be <strong>fun traditional games</strong> with deep blockchain
            integration. We were the first in the world to build <strong>on-chain mechanics directly into NFTs</strong>{' '}
            with our Arken: Runic Raids blockchain game. We followed it up with our first downloadable Play4Rewards game
            Arken: Evolution Isles <strong>within 6 months</strong>. Our next big endevour is an arena brawler called
            Zeno Infinite. During this process, we'll build on everything we've created for Arken: Heart of the Oasis -
            a massive RPG in the Arken Realms.
          </Linker>
        </p>
        <br />
      </TipCard>
      <br />
      <Cards>
        {games.map((game) => (
          <MainCard>
            <Header>
              <Heading>{game.name}</Heading>
              <HeaderTag>
                {game.status === 'released' ? (
                  <Tag2 outline variant="success">
                    Released
                  </Tag2>
                ) : null}
                {game.status === 'beta' ? (
                  <Tag2 outline variant="success">
                    Beta
                  </Tag2>
                ) : null}
                {game.status === 'pending' ? (
                  <Tag2 outline variant="textDisabled">
                    In Development
                  </Tag2>
                ) : null}
              </HeaderTag>
              {/* {walletOwnsNft && (
                                    <Tag outline variant="secondary">
                                        {t('Chosen')}
                                    </Tag>
                                    )} */}
              {/* {profile?.nft?.characterId === characterId && (
                                    <Tag outline variant="success">
                                        {t('Active')}
                                    </Tag>
                                    )} */}
            </Header>
            <ImageBlock url={game.image} />
            <InfoBlock>{game.description}</InfoBlock>
            <br />
            <br />
            <br />
            <br />
            <BottomMenu>
              {game.status === 'released' || game.status === 'beta' ? (
                <Button as={RouterLink} to={game.path} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                  Play Now
                </Button>
              ) : null}
              {game.status === 'earlyaccess' ? (
                <Button as={RouterLink} to={game.path} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                  Get Early Access
                </Button>
              ) : null}
              {game.status === 'earliestaccess' ? (
                <Button as={RouterLink} to={game.path} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                  Get Earliest Access
                </Button>
              ) : null}
              {game.status === 'pending' ? (
                <Button
                  as={RouterLink}
                  variant="text"
                  to={game.path}
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                  Preview
                </Button>
              ) : null}
            </BottomMenu>
          </MainCard>
        ))}
      </Cards>
    </Page>
  )
}

export default Rules
