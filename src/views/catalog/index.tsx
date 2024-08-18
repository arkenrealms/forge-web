import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  PrizeIcon,
  OpenNewIcon,
  LinkExternal,
  Link,
  BlockIcon,
} from '~/ui'
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import history from '~/routerHistory'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import Page from '~/components/layout/Page'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from '~/hooks/useTokenBalance'
import { useProfile } from '~/state/hooks'
import { useRunePrice } from '~/state/hooks'
import TipCard from '~/components/TipCard'
import useWeb3 from '~/hooks/useWeb3'
import CardHeader from '~/components/account/CardHeader'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import { itemData, ItemType } from 'rune-backend-sdk/build/data/items'
import CardValueUnstyled from '~/components/raid/CardValueUnstyled'
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type'
import { RecipeInfo } from '~/components/RecipeInfo'
import { ProfileInfo } from '~/components/ProfileInfo'
import NftList from '~/components/characters/NftList'
import ItemsTable from '~/components/ItemsTable'
import LoreContainer from '~/components/LoreContainer'

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;

  & > div {
    min-height: 500px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`

const ItemCard = styled.div`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  padding: 30px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  width: calc(100% - 0px);

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`

const Catalog: React.FC = () => {
  const { t } = useTranslation()
  const { address: account } = useWeb3()

  return (
    <Page>
      <TipCard id="catalog-welcome" npc="josh" heading={t('Catalog')}>
        <p>You won't find any secret items here my friend.</p>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </TipCard>
      {/* <PageWindow> */}
      <br />
      <LoreContainer color="dark">
        <ItemsTable />
      </LoreContainer>
      <br />
      <ItemContainer>
        {itemData[ItemsMainCategoriesType.OTHER]
          .filter(
            (item: any) =>
              account === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' ||
              (item.isPublishable && !item.isUltraSecret && !item.isSecret && !item.isDisabled)
          )
          .reverse()
          .map((item) => (
            <ItemCard>
              <RecipeInfo
                item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === item.name)}
                showStatus
                showStats
                showCraftButton
                showMarketButton
                showDetailsButton
              />
            </ItemCard>
          ))}
      </ItemContainer>
      <br />
      <br />
    </Page>
  )
}

export default Catalog
