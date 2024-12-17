import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  Card2,
  Card3,
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
} from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import history from '~/routerHistory';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Page from '~/components/layout/Page';
import { getBalanceNumber } from '~/utils/formatBalance';
import { useTotalSupply, useBurnedBalance } from '~/hooks/useTokenBalance';
import { useProfile } from '~/state/hooks';
import { useRunePrice } from '~/state/hooks';
import TipCard from '~/components/TipCard';
import useWeb3 from '~/hooks/useWeb3';
import CardHeader from '~/components/account/CardHeader';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers';
import { itemData, ItemType } from '@arken/node/legacy/data/items';
import CardValueUnstyled from '~/components/raid/CardValueUnstyled';
import { ItemsMainCategoriesType } from '@arken/node/legacy/data/items.type';
import { RecipeInfo } from '~/components/RecipeInfo';
import { ProfileInfo } from '~/components/ProfileInfo';
import NftList from '~/components/characters/NftList';
import ItemsTable from '~/components/ItemsTable';
import LoreContainer from '~/components/LoreContainer';

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
`;

const Catalog: React.FC<any> = () => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();

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
      <Card3>
        <LoreContainer color="dark">
          <ItemsTable />
        </LoreContainer>
      </Card3>
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
            <Card3 className="catalog-item">
              <RecipeInfo
                item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === item.name)}
                showStatus
                showStats
                showCraftButton
                showMarketButton
                showDetailsButton
              />
            </Card3>
          ))}
      </ItemContainer>
      <br />
      <br />
    </Page>
  );
};

export default Catalog;
