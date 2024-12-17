import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
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
import useWeb3 from '~/hooks/useWeb3';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import TipCard from '~/components/TipCard';
import { itemData, getFilteredItems } from '@arken/node/legacy/data/items';
import { ItemsMainCategoriesType } from '@arken/node/legacy/data/items.type';
import { RecipeInfo } from '~/components/RecipeInfo';

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

const ItemCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  padding: 30px !important;
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
`;

const items = getFilteredItems(itemData[ItemsMainCategoriesType.OTHER]);

const Runeforms: React.FC<any> = () => {
  const { t } = useTranslation();
  const { address: account } = useWeb3();

  return (
    <>
      <TipCard id="craft-welcome" npc="josh" heading={t('Craft')}>
        <p>Welcome adventurer!</p>
        <br />
        <p>
          Crafting your first randomly generated Rune item can be a really exciting journey. First you will need to{' '}
          <RouterLink to="/swap" style={{ borderBottom: '1px solid #fff' }}>
            Swap Tokens
          </RouterLink>{' '}
          to purchase your runes. Once you have your runes, choose the Runeform you would like to transmute with the
          cube below!
        </p>
        <br />
        <br />
        <br />
        {/* <br />
        <p>
          My good friend will explain it full detail in the video below. That's all there is to it. Good luck on the
          crafts!
        </p> */}
        {/* <br />
        <br />
        <Flex
          flexDirection="column"
          alignItems="center"
          mb="8px"
          justifyContent="start"
          style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src="https://www.youtube.com/embed/K3oZXgCoRSM"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ width: '100%', height: '100%', top: 0, left: 0, position: 'absolute' }}></iframe>
        </Flex> */}
      </TipCard>
      {/* <PageWindow> */}
      <br />
      <ItemContainer>
        {items
          .filter((item) => !item.isDisabled && !item.isSecret && !(item as any).isUltraSecret && item.isCraftable)
          .reverse()
          .map((item) => (
            <Card3 className="catalog-item" key={item.name}>
              <RecipeInfo
                item={items.find((r) => r.name === item.name)}
                // showStatus
                showStats
                showCraftButton
                showMarketButton
              />
            </Card3>
          ))}
      </ItemContainer>
      <br />
      <br />
      <br />
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Button
          as={RouterLink}
          to="/catalog"
          style={{ zoom: 1.3, padding: '6px 20px', textAlign: 'center' }}
          onClick={() => {
            window.scrollTo(0, 0);
          }}>
          Browse Full Catalog
        </Button>
      </Flex>
      <br />
      <br />
    </>
  );
};

export default Runeforms;
