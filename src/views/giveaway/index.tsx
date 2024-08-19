import React, { useEffect, useRef, useState, useContext } from 'react';
import { decodeItem } from '@arken/node/util/decoder';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { Button, Flex, Card, Heading, CardBody, BaseLayout, ButtonMenu, ButtonMenuItem } from '~/ui';
import Page from '~/components/layout/Page';
import { Link as RouterLink } from 'react-router-dom';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import PageWindow from '~/components/PageWindow';

import { ItemInfo } from '~/components/ItemInfo';
import { ItemCategoriesType } from '@arken/node/data/items.type';

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const VerticalCards = styled.div``;

const Container = styled.div`
  background: #000;
  & > * {
    text-transform: uppercase;
    line-height: 1rem;
    font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
    color: #fff;
  }
`;

const List = styled.div`
  width: 100%;
  margin-bottom: 30px;
  padding: 25px 15px 0;
`;

const ListItem = styled.div`
  width: 100%;
  font-size: 1.5rem;
  line-height: 2.3rem;
  align-items: stretch;
  justify-content: stretch;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 32px;
`;

const ListItemLeft = styled.div`
  grid-column: span 1;
  width: 30px;
`;

const ListItemCenter = styled.div`
  grid-column: span 8;
  width: 100%;
`;

const ListItemRight = styled.div`
  grid-column: span 3;
  text-align: center;
  width: 30px;
`;

const MainHeading = styled.div`
  font-size: 2.5rem;
  line-height: 3.5rem;
`;

const SubHeading = styled.div`
  width: 100%;
  font-size: 2rem;
  line-height: 2rem;
  text-align: center;
  text-decoration: underline;
`;

const Giveaway = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { t } = useTranslation();

  const GlobalStyles = createGlobalStyle`
  input, textarea {
    text-transform: none;
  }
  `;

  // useEffect(() => {
  //   if (!window) return

  //   window.document.getElementById('blackhole').style.display = 'none'
  // }, [])

  const prevItem = {
    total: null,
    steel: null,
    fury: null,
    lorekeeper: null,
  };
  const rank = {
    total: 1,
    steel: 1,
    fury: 1,
    lorekeeper: 1,
  };

  return (
    <Page>
      <GlobalStyles />
      <Container>
        {/* <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading size="xl" mb="24px" style={{fontSize: '3rem'}}>
            {t('Giveaway')}
        </Heading>
        <p>
            <em>Raider Rankings</em>
        </p>
        </Flex> */}
        <br />
        <br />
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Card>
            <ButtonMenu activeIndex={tabIndex} scale="md" onItemClick={(index) => setTabIndex(index)}>
              <ButtonMenuItem>{t('Top Crafters')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Top Guilds')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Top Raiders')}</ButtonMenuItem>
            </ButtonMenu>
          </Card>
        </Flex>
        <br />
        <br />
        <br />
        <br />
        <br />
        {tabIndex === 0 ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <MainHeading>Top Crafters</MainHeading>
            <br />
            <br />
            <br />
            <Cards>
              <VerticalCards>
                <SubHeading>Overall</SubHeading>
                <List></List>
              </VerticalCards>
              <VerticalCards>
                <SubHeading>Steel</SubHeading>
                <List></List>
                <SubHeading>Fury</SubHeading>
                <List></List>
                <SubHeading>Lorekeeper</SubHeading>
                <List></List>
              </VerticalCards>
            </Cards>
            <br />
            <br />
            <p>
              <em>Note: Direct crafts only. Not transfers/sales.</em>
            </p>
            <br />
            <br />
            <a href="https://www.youtube.com/channel/UCFkCD9N_-d4QGKddOkWbhgg">
              <em>
                Data provided by <strong>Rune Experiments</strong>
              </em>
            </a>
          </Flex>
        ) : null}
        {tabIndex === 1 ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <MainHeading>Coming Soon</MainHeading>
          </Flex>
        ) : null}
        {tabIndex === 2 ? (
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <MainHeading>Coming Soon</MainHeading>
          </Flex>
        ) : null}
      </Container>
    </Page>
  );
};

export default Giveaway;
