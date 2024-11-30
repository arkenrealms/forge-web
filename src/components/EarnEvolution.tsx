import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Button, OpenNewIcon, Skeleton, LinkExternal } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  border-radius: 32px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
  body.good-quality & {
    animation: ${RainbowLight} 2s linear infinite;
  }
`;

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  line-height: 1.3rem;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;
`;

const HelpLinks = styled.div`
  text-align: left;
  width: 100%;
  margin-top: 20px;
  line-height: 1.3rem;

  &,
  div,
  span,
  a {
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
    text-transform: none;
    font-size: 0.8rem;
    color: #aaa;
  }
`;

const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`;

const endpoints = {
  cache: 'https://s1.envoy.arken.asi.sh',
  coordinator: 'https://s1.relay.arken.asi.sh',
  // cache: 'http://localhost:6001', // 'https://s1.envoy.arken.asi.sh'
  // coordinator: 'http://localhost:5001' // 'https://s1.relay.arken.asi.sh'
};

const EarnAPYCard = () => {
  const { t } = useTranslation();
  const [realms, setRealms] = useState([]);
  const [playerCount, setPlayerCount] = useState(null);

  useEffect(function () {
    // if (!account) return
    if (!window) return;

    async function init() {
      const coeff = 1000 * 60 * 2;
      const date = new Date(); //or use any other date
      const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();
      // const rand1 = Math.floor(Math.random() * Math.floor(999999))
      const response1 = await fetch(`${endpoints.cache}/evolution/servers.json`); // ?${rand}
      const servers = await response1.json();

      // if (
      //   window.location.hostname !== 'arken.gg' &&
      //   window.location.hostname !== 'beta.arken.gg' &&
      //   window.location.hostname !== 'localhost'
      // ) {
      //   servers = servers.filter((s) => s.name === 'Test Realm')
      // }

      // servers = servers.filter((s) => s.status === 'online' || s.status === 'offline')

      setRealms(servers);

      let pp = 0;
      for (const server of servers) {
        if (server.status !== 'online') continue;
        if (server.updateMode === 'manual') continue;

        pp += server.playerCount;
      }

      setPlayerCount(pp);

      // const rand = Math.floor(Math.random() * Math.floor(999999))
      // const response = await fetch(`https://s1.envoy.arken.asi.sh/evolution/rewardHistory.json?${rand}`)
      // const responseData = await response.json()

      // const rewardsData = responseData.filter((r) => r.winner.address === account)

      // setRewards(rewardsData)
    }

    init();

    // const inter = setInterval(init, 1 * 60 * 1000)

    // return () => {
    //   clearInterval(inter)
    // }
  }, []);

  // if (!playerCount || playerCount < 3) return <></>

  return (
    <>
      <Heading color="contrast" size="lg">
        Battle
      </Heading>
      <CardMidContent color="#e9a053">
        {playerCount !== null && playerCount >= 3 ? (
          <>{playerCount} online</>
        ) : playerCount !== null && playerCount < 3 ? (
          <>dragons</>
        ) : (
          <Skeleton animation="pulse" variant="rect" height="44px" />
        )}
      </CardMidContent>
      <Heading color="contrast" size="lg">
        in Evolution Isles
      </Heading>
    </>
  );
};

export default EarnAPYCard;
