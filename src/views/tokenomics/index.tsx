import React, { useEffect, useRef, useState, useContext } from 'react'
import styled, { css } from 'styled-components'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon, LinkExternal, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Page from '~/components/layout/Page'
import { PurchaseModal } from '~/components/PurchaseModal'
import PageWindow from '~/components/PageWindow'
import i18n from '~/config/i18n'
import useCache from '~/hooks/useCache'
import Tokenomics from '~/components/Tokenomics'
import { safeRuneList } from '~/config'

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`
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
  font-size: 0.8rem;
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
const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`
const StyledRuneStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
`

const TokenomicsView = () => {
  const { t } = useTranslation()
  const [showVision, setShowVision] = useState(false)
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  const cache = useCache()

  const runes = window?.location?.hostname === 'localhost' ? ['rxs', 'rune', ...safeRuneList] : ['rxs', ...safeRuneList]
  let totalMarketCap = 0

  return (
    <Page>
      <Tokenomics />
      <br />
      <StyledRuneStats>
        <CardBody>
          <Heading size="xl" mb="24px">
            {t('Token Stats')}
          </Heading>
          <Flex alignItems={['start', null, 'start']} flexDirection={['column', null, 'row']}>
            <div style={{ width: '50%' }}>
              {runes.slice(0, runes.length / 2).map((rune) => {
                const price = cache.runes[rune].price || 0
                const totalSupply = cache.runes[rune].totalSupply || 0
                const totalBurned = cache.runes[rune].totalBurned || 0
                const circulatingSupply = cache.runes[rune].circulatingSupply || 0
                const marketCap = price * circulatingSupply || 0

                if (rune !== runes[runes.length - 1] && rune !== 'rune') {
                  totalMarketCap += marketCap
                }

                return (
                  <div key={rune}>
                    <Row>
                      <br />
                    </Row>
                    <Row>
                      <Text>{t(`${rune.toUpperCase()} Price`)}</Text>
                      {price && <Text bold>${price.toFixed(4)}</Text>}
                    </Row>
                    <Row>
                      <Text>{t(`${rune.toUpperCase()} Market Cap`)}</Text>
                      {circulatingSupply && (
                        <Text bold>${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                      )}
                    </Row>
                    <Row>
                      <Text>{t(`Max ${rune.toUpperCase()} Supply`)}</Text>
                      <Text bold>{circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    </Row>
                    <Row>
                      <Text>
                        {totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} minted -{' '}
                        {totalBurned.toLocaleString(undefined, { maximumFractionDigits: 0 })} burned
                      </Text>
                    </Row>
                    <Row>
                      <br />
                    </Row>
                  </div>
                )
              })}
            </div>
            <div
              css={css`
                width: 50%;
                padding-left: 50px;
                margin-left: 50px;
                border-left: 1px solid #bb955e;
              `}
            >
              {runes.slice(runes.length / 2).map((rune) => {
                const price = cache.runes[rune].price || 0
                const totalSupply = cache.runes[rune].totalSupply || 0
                const totalBurned = cache.runes[rune].totalBurned || 0
                const circulatingSupply = cache.runes[rune].circulatingSupply || 0
                const marketCap = price * circulatingSupply || 0

                if (rune !== runes[runes.length - 1] && rune !== 'rune') {
                  totalMarketCap += marketCap
                }

                return (
                  <div key={rune}>
                    <Row>
                      <br />
                    </Row>
                    <Row>
                      <Text>{t(`${rune.toUpperCase()} Price`)}</Text>
                      {price && <Text bold>${price.toFixed(4)}</Text>}
                    </Row>
                    <Row>
                      <Text>{t(`${rune.toUpperCase()} Market Cap`)}</Text>
                      {circulatingSupply && (
                        <Text bold>${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                      )}
                    </Row>
                    <Row>
                      <Text>{t(`Max ${rune.toUpperCase()} Supply`)}</Text>
                      <Text bold>{circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
                    </Row>
                    <Row>
                      <Text>
                        {totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} minted -{' '}
                        {totalBurned.toLocaleString(undefined, { maximumFractionDigits: 0 })} burned
                      </Text>
                    </Row>
                    <Row>
                      <br />
                    </Row>
                  </div>
                )
              })}
            </div>
          </Flex>
          <Row>
            <Text bold>{t('TOTAL MARKET CAP')}</Text>
            <Text bold>${totalMarketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
          </Row>
        </CardBody>
      </StyledRuneStats>
    </Page>
  )
}

export default TokenomicsView
