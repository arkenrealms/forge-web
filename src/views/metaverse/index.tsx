import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
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
} from '~/ui';
import Unity, { UnityContext } from 'react-unity-webgl';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import history from '~/routerHistory';
import { getUsername } from '~/state/profiles/getProfile';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Page from '~/components/layout/Page';

const Mana = styled.div`
  position: absolute;
  left: 780px;
  top: 21px;
  width: 128px;
  height: 128px;
  background: url(images_extra/mana.png?3) repeat;
  animation: animate-mana linear 20s infinite;
  clip-path: circle(50%);
`;

const Health = styled.div`
  position: absolute;
  left: 78px;
  top: 21px;
  width: 128px;
  height: 128px;
  background: url(images_extra/health.png?3) repeat;
  animation: animate-health linear 20s infinite;
  clip-path: circle(50%);
`;

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 85px);
  justify-content: center;
`;

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  background-color: rgba(0, 0, 0, 0.4);
  background-image: url(/images/background.jpeg);
  background-size: 400px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  max-width: 500px;

  p {
    text-transform: none;
    font-family: 'Alegreya Sans', sans-serif, Cambria, Verdana, monospace;
  }
`;
const Home: React.FC<any> = () => {
  return (
    <StyledNotFound>
      <MainCard>
        <Heading size="xl">Under Development</Heading>
        <br />
        <p style={{ color: 'white' }}>
          Battle your way through the Arcane Sanctuary arena for glory and loot.
          <br />
          <br />
          This online multiplayer arena game is set in Haerra, the world of Heart of the Oasis. <br />
          <br />
          Ready to join the battle in Infinite Arena? Equip your hero with items found in Runic Raids and Evolution
          Isles.
        </p>
        <br />
        <br />
        <p style={{ color: 'white' }}>See the Nexus for more info.</p>
      </MainCard>
    </StyledNotFound>
  );
};

export default Home;
