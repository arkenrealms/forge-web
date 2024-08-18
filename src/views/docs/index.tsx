import React, { useEffect, useRef, useState, useContext } from 'react'
import styled from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import i18n from '~/config/i18n'

const Text = styled.div``

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 4;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
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
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: none;
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

  const otherLinks = [
    {
      label: 'Tracker: CoinGecko',
      href: 'https://www.coingecko.com/en/coins/rune',
    },
    {
      label: 'Tracker: CoinMarketCap',
      href: 'https://coinmarketcap.com/watchlist/6155d7e5bea8737592b2b8a6',
    },
    {
      label: 'Chart: Poo (RXS)',
      href: 'https://poocoin.app/tokens/0x2098fef7eeae592038f4f3c4b008515fed0d5886',
    },
    {
      label: 'Chart: Swapp (RXS)',
      href: 'https://goswapp-bsc.web.app/0x2098fef7eeae592038f4f3c4b008515fed0d5886',
    },
    {
      label: 'Chart: DexTools (RXS)',
      href: 'https://www.dextools.io/app/bsc/pair-explorer/0xe576ebf57b3776f8892e2df1787cb163f41a1242',
    },
    {
      label: 'Chart: Poo (RUNE)',
      href: 'https://poocoin.app/tokens/0xa9776b590bfc2f956711b3419910a5ec1f63153e',
    },
    {
      label: 'Chart: Swapp (RUNE)',
      href: 'https://goswapp-bsc.web.app/0xa9776b590bfc2f956711b3419910a5ec1f63153e',
    },
    {
      label: 'Chart: DexTools (RUNE)',
      href: 'https://www.dextools.io/app/bsc/pair-explorer/0x68513e24495b9d1d1fedee0906872a96858e8ad2',
    },
    {
      label: 'NFT Market: Binance',
      href: 'https://www.binance.com/en/nft/shopWindow?orderBy=amount_sort&orderType=1&isBack=1&uid=67515745&order=amount_sort%401',
    },
    {
      label: 'NFT Market: Altura',
      href: 'https://app.alturanft.com/collection/0x652010d7a2c983802bf84a0ea3f9c850880af030',
    },
    {
      label: 'NFT Market: Mochi',
      href: 'https://app.mochi.market/collection/56/0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40?ViewAll=true',
    },
    {
      label: 'NFT Market: Babylons',
      href: 'https://app.babylons.io/rune',
    },
    {
      label: 'NFT Market: Treasureland',
      href: 'https://treasureland.market/assets?contract=0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40&chain_id=56',
    },
  ]

  return (
    <Page>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Docs')}
        </Heading>
        <hr />
        <CardBody>
          <ul>
            <li>
              <RouterLink to="/faq">FAQ</RouterLink>
            </li>
            <li>
              <RouterLink to="/tokenomics">Tokenomics</RouterLink>
            </li>
            {otherLinks.map((link) => (
              <li>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </Page>
  )
}

export default Rules
