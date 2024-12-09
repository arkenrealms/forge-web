import React, { useEffect, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Card3, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import { useAuth } from '~/hooks/useAuth';

const Text = styled.div``;

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
`;

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`;

const InfoBlock = styled.div`
  // padding: 24px;
  margin-top: 20px;
  text-align: left;
  font-size: 0.9rem;
`;

const HeaderTag = styled.div`
  margin-top: 10px;
  width: 100%;
`;

const Tag2 = styled(Tag)`
  zoom: 1;
`;

// const Card3 = styled(Card3)`
//   position: relative;
//   font-weight: bold;
//   padding: 0 10px;
//   // transform: scale(0.8);
//   text-shadow: 1px 1px 1px black;
//   // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
//   text-align: center;
//   color: #bb955e;
//   text-shadow: 1px 1px 1px black;
//   font-weight: bold;
// `;

const Image = styled.img`
  border-radius: 7px;
`;

const ImageBlock = ({ url }) => (
  <div
    css={css`
      position: absolute;
      left: 0;
      top: 0;
      background-image: url(${url});
      width: 100%;
      height: 100%;
      background-size: cover;
      z-index: -1;
    `}
  />
);

const BottomMenu = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  text-align: center;
`;

const Rules = () => {
  const { t } = useTranslation();
  const auth = useAuth();

  const games = [
    {
      name: 'Evolution Isles',
      path: '/games/evolution',
      image: '/images/games/evolution-card.png',
      description: (
        <ul>
          <li>2D Arcade. Easy to start, difficult to master.</li>
          <li>Win rounds & find items ingame. {auth?.isCryptoMode ? '(Play 4 Rewards)' : ''}</li>
          <li>Web, android, iphone, desktop.</li>
        </ul>
      ),
      status: 'beta',
    },
    {
      name: 'Infinite Arena',
      path: '/games/infinite',
      image: '/images/games/infinite-card.png',
      description: (
        <ul>
          <li>2D Top Down ARPG. Very fluid action gameplay. </li>
          <li>Win arena battles. {auth?.isCryptoMode ? '(Play 4 Rewards)' : ''}</li>
          <li>Gear-enabled by default.</li>
          <li>Desktop, with web + phone app for certain features.</li>
        </ul>
      ),
      status: 'pending',
    },
    {
      name: 'Heart of the Oasis',
      path: '/games/oasis',
      image: '/images/games/sanctuary-card.png',
      description: (
        <ul>
          <li>3D MMORPG.</li>
          <li>Find unique items, winning raid battles, etc. {auth?.isCryptoMode ? '(Play 4 Rewards)' : ''}</li>
          <li>Buy land + NPCs + Guild tokens to customize the world around you.</li>
          <li>Desktop, with web + phone app for certain features.</li>
        </ul>
      ),
      status: 'pending',
    },
    // {
    //   name: 'Runic Raids',
    //   path: '/raid',
    //   image: '/images/games/raid-card.png',
    //   description: (
    //     <ul>
    //       <li>Farm for rune rewards (by staking liquidity).</li>
    //       <li>Craft items that change harvest mechanics.</li>
    //     </ul>
    //   ),
    //   status: 'retired',
    // },
    // {
    //   name: 'Guardians Unleashed',
    //   path: '/guardians',
    //   image: '/images/games/guardians-card.png',
    //   description: (
    //     <ul>
    //       <li>2D breeding game, generate and hatch pets used in other Arken games.</li>
    //       <li>Web, android, iphone, desktop.</li>
    //     </ul>
    //   ),
    //   status: 'pending',
    // },
  ];

  return (
    <Cards>
      {games.map((game) => (
        <Card3>
          <Header>
            <Heading size="lg">{game.name}</Heading>
            <HeaderTag>
              {game.status === 'released' ? (
                <Tag2 outline variant="failure">
                  Released
                </Tag2>
              ) : null}
              {game.status === 'retired' ? (
                <Tag2 outline variant="textDisabled">
                  Retired
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
          </Header>
          <ImageBlock url={game.image} />
          <CardBody>
            <InfoBlock>{game.description}</InfoBlock>
            <br />
            <br />
            <br />
            <br />
          </CardBody>
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
              <Button as={RouterLink} to={game.path} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                Preview
              </Button>
            ) : null}
            {game.status === 'retired' ? (
              <Button
                as={RouterLink}
                to={game.path}
                disabled
                style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                Retired
              </Button>
            ) : null}
          </BottomMenu>
        </Card3>
      ))}
    </Cards>
  );
};

export default Rules;
