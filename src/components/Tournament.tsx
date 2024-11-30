import React, { useEffect, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import random from 'lodash/random';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Tag, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon } from '~/ui';
import Page from '~/components/layout/Page';

const dummy = styled.div``;

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

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

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`;

const palette = [
  '#ffb3ba',
  '#ffdfba',
  '#feffba',
  '#bae1ff',
  '#9cec86',
  '#edbde7',
  '#c481e8',
  '#fff',
  '#464bff',
  '#ff4646',
  '#ffa000',
  '#00faff',
  '#643b45',
  '#8e8e8e',
];

const placements = {
  10: 1,
  7: 2,
  5: 3,
  3: 4,
  1: 5,
};

const playerColors = {};
const takenColors = {};

const TournamentResult = ({ result }) => {
  const standingsMap = {};

  for (const round of result.rounds) {
    for (const player of round.players) {
      while (!playerColors[player.name]) {
        const randomColor = palette[random(0, palette.length - 1)];

        if (takenColors[randomColor] && Object.keys(takenColors).length !== palette.length) continue;

        if (takenColors[randomColor] === undefined) takenColors[randomColor] = 0;

        takenColors[randomColor] += 1;
        playerColors[player.name] = randomColor;
      }

      if (!standingsMap[player.name]) standingsMap[player.name] = 0;

      standingsMap[player.name] += player.points;
    }
  }

  let standings = [];

  for (const name of Object.keys(standingsMap)) {
    standings.push({
      name,
      points: standingsMap[name],
    });
  }

  standings = standings.sort((a, b) => b.points - a.points).slice(0, 10);

  const standingsEle = (
    <>
      {standings.map((standing, index) => (
        <>
          <strong style={{ color: playerColors[standing.name], marginRight: 5 }}>
            {index + 1}. {standing.name} ({standing.points})
          </strong>
        </>
      ))}
    </>
  );

  return (
    <div
      css={css`
        border: 1px solid #bb955e;
        padding: 10px;
        margin-bottom: 20px;
        font-size: 0.9rem;
      `}>
      <h3 style={{ fontSize: '1.2rem' }}>{result.name}</h3>
      <br />
      <p>
        <strong>Standings:</strong> {standingsEle}
        <br />
        <strong>Prize:</strong> {result.prize}
        <br />
        <strong>Format:</strong> {result.format}
        <br />
        <strong>Server:</strong> {result.server}
        <br />
        <strong>Rounds:</strong> <br />
        <ul>
          {result.rounds.map((r, i) => (
            <li>
              Round #{i + 1} - {r.mode} -{' '}
              {r.players.map((p, i2) => (
                <span style={{ paddingRight: 5 }}>
                  {i2 + 1}. <strong style={{ color: playerColors[p.name] }}>{p.name} </strong>
                </span>
              ))}
            </li>
          ))}
        </ul>
      </p>
    </div>
  );
};

const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;

const Tournament = () => {
  const { t } = useTranslation();

  const tournaments = [
    {
      name: 'Rune Royale: Beginnings',
      winner: 'ItsMeJJ',
      prize: '50,000 RXS',
      server: 'North America',
      format: 'Standard',
      date: 'January 31, 2022',
      results: [
        {
          name: 'ItsMeJJ',
          points: 66,
        },
        {
          name: 'Fortress',
          points: 42,
        },
        {
          name: 'Ekkeharta',
          points: 39,
        },
        {
          name: 'SirNoypi',
          points: 31,
        },
        {
          name: 'Loffarn',
          points: 27,
        },
        {
          name: 'Zoey',
          points: 25,
        },
        {
          name: 'REEEnzo',
          points: 23,
        },
        {
          name: 'Sassyboy',
          points: 21,
        },
        {
          name: 'Drackon',
          points: 11,
        },
        {
          name: 'llnoscaredll',
          points: 10,
        },
        {
          name: 'Flobss',
          points: 6,
        },
        {
          name: 'Innosuke',
          points: 4,
        },
        {
          name: 'Farkan',
          points: 3,
        },
      ],
      rounds: [
        // 1
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Flobss',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Mix Game 2',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'Ekkeharta',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'SirNoypi',
              points: 3,
            },
            {
              name: 'MrsPasty',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Ekkeharta',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'SirNoypi',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Loffarn',
              points: 5,
            },
            {
              name: 'SirNoypi',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'Ekkeharta',
              points: 7,
            },
            {
              name: 'Loffarn',
              points: 5,
            },
            {
              name: 'llnoscaredll',
              points: 3,
            },
            {
              name: 'ItsMeJJ',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'SirNoypi',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Farkan',
              points: 3,
            },
            {
              name: 'Drackon',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Zoey',
              points: 10,
            },
            {
              name: 'Ekkeharta',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'Innosuke',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Innosuke',
              points: 3,
            },
            {
              name: 'SirNoypi',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'Loffarn',
              points: 7,
            },
            {
              name: 'SirNoypi',
              points: 5,
            },
            {
              name: 'Drackon',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Evolution',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'SirNoypi',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'Poseidon',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'Drackon',
              points: 7,
            },
            {
              name: 'Zoey',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'Flobss',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: The Dawning',
      winner: 'Loffarn',
      server: 'Europe',
      prize: '50,000 RXS',
      format: 'Standard',
      date: 'February 28, 2022',
      rounds: [
        // 1
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'ItsMeJJ',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Sticky Mode',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'llnoscaredll',
              points: 7,
            },
            {
              name: 'Zoey',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Mix Game 2',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Sukuna',
              points: 5,
            },
            {
              name: 'SirNoypi',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'Sukuna',
              points: 7,
            },
            {
              name: 'SirNoypi',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Standard',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'SirNoypi',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'iqbalomen',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'Sassyboy',
              points: 7,
            },
            {
              name: 'Ekkeharta',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'SirNoypi',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Sassyboy',
              points: 10,
            },
            {
              name: 'REEEnzo',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Zoey',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Leadercap',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'llnoscaredll',
              points: 7,
            },
            {
              name: 'Innosuke',
              points: 5,
            },
            {
              name: 'Zoey',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'SirNoypi',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'Sukuna',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Innosuke',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'Loffarn',
              points: 5,
            },
            {
              name: 'ItsMeJJ',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Marco Polo',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'SirNoypi',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'Loffarn',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'Ekkeharta',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: Lets Be Friends',
      winner: 'Ginoong Halimaw',
      server: 'Asia',
      prize: '50,000 RXS',
      format: 'Standard',
      date: 'March 28, 2022',
      rounds: [
        // 1
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Mix Game 2',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Sukuna',
              points: 7,
            },
            {
              name: 'Innosuke',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Standard',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Sassyboy',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Zoey',
              points: 3,
            },
            {
              name: 'Innosuke',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Leadercap',
          players: [
            {
              name: 'Sassyboy',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Innosuke',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'Sukuna',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'Innosuke',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Innosuke',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'Sukuna',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'Sassyboy',
              points: 7,
            },
            {
              name: 'Sukuna',
              points: 5,
            },
            {
              name: 'Ginoong Halimaw',
              points: 3,
            },
            {
              name: 'Zoey',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Zoey',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Sticky Mode',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Sassyboy',
              points: 7,
            },
            {
              name: 'Sukuna',
              points: 5,
            },
            {
              name: 'Innosuke',
              points: 3,
            },
            {
              name: 'Zoey',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'Innosuke',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Zoey',
              points: 3,
            },
            {
              name: 'Sukuna',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Evolution',
          players: [
            {
              name: 'Sassyboy',
              points: 10,
            },
            {
              name: 'Zoey',
              points: 7,
            },
            {
              name: 'Innosuke',
              points: 5,
            },
            {
              name: 'Ginoong Halimaw',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: Pandamonium',
      winner: 'Dazai',
      server: 'Asia',
      prize: '50,000 RXS',
      format: 'Standard',
      date: 'April 25, 2022',
      rounds: [
        // 1
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'REEEnzo',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Lounjakt',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Evolution',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Mix Game 1',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'REEEnzo',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'akablackreaper',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'akablackreaper',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Marco Polo',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'akablackreaper',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Ekkeharta',
              points: 5,
            },
            {
              name: 'Lounjakt',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Mix Game 2',
          players: [
            {
              name: 'akablackreaper',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'akablackreaper',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'REEEnzo',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Standard',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Lounjakt',
              points: 3,
            },
            {
              name: 'akablackreaper',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: Hysteria',
      winner: 'ItsMeJJ',
      server: 'South America',
      prize: '50,000 RXS',
      format: 'Standard',
      date: 'May 29, 2022',
      rounds: [
        // 1
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'REEEnzo',
              points: 3,
            },
            {
              name: 'Ginoong Halimaw',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Evolution',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Reverse Evolve',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'llnoscaredll',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'REEEnzo',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'llnoscaredll',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'plexbrahial',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Reverse Evolve',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'llnoscaredll',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Sticky Mode',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'Sassyboy',
              points: 7,
            },
            {
              name: 'REEEnzo',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'REEEnzo',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Ginoong Halimaw',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Leadercap',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'ItsMeJJ',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Mix Game 2',
          players: [
            {
              name: 'ItsMeJJ',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'llnoscaredll',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Evolution',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'ItsMeJJ',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Leadercap',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'ItsMeJJ',
              points: 3,
            },
            {
              name: 'Lounjakt',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Lounjakt',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'ItsMeJJ',
              points: 5,
            },
            {
              name: 'Ginoong Halimaw',
              points: 3,
            },
            {
              name: 'Dazai',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: Crimson Dawn',
      winner: 'Dazai',
      server: 'Oceanic',
      prize: '50,000 RXS',
      format: 'Standard',
      date: 'June 27, 2022',
      rounds: [
        // 1
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Chaos★Myth',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        // 2
        {
          mode: 'Evolution',
          players: [
            {
              name: 'llnoscaredll',
              points: 10,
            },
            {
              name: 'Chaos★Myth',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 3
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: 'Ekkeharta',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'llnoscaredll',
              points: 3,
            },
            {
              name: 'Dazai',
              points: 1,
            },
          ],
        },
        // 4
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Chaos★Myth',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 5
        {
          mode: 'Sticky Mode',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Ekkeharta',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Chaos★Myth',
              points: 1,
            },
          ],
        },
        // 6
        {
          mode: 'Standard',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Ginoong Halimaw',
              points: 5,
            },
            {
              name: 'llnoscaredll',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        // 7
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Ekkeharta',
              points: 5,
            },
            {
              name: 'llnoscaredll',
              points: 3,
            },
            {
              name: 'Chaos★Myth',
              points: 1,
            },
          ],
        },
        // 8
        {
          mode: 'Marco Polo',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Ekkeharta',
              points: 7,
            },
            {
              name: 'llnoscaredll',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        // 9
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'Chaos★Myth',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
        // 10
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'llnoscaredll',
              points: 10,
            },
            {
              name: 'Ginoong Halimaw',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'Ekkeharta',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 11
        {
          mode: 'Sprite Leader',
          players: [
            {
              name: 'Ginoong Halimaw',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Chaos★Myth',
              points: 1,
            },
          ],
        },
        // 12
        {
          mode: 'Standard',
          players: [
            {
              name: 'Sassyboy',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'The New Normal',
              points: 5,
            },
            {
              name: 'Ginoong Halimaw',
              points: 3,
            },
            {
              name: 'Ekkeharta',
              points: 1,
            },
          ],
        },
      ],
    },
    {
      name: 'Rune Royale: Pre-season',
      winner: 'Dazai',
      server: 'North America',
      prize: '100 BUSD',
      format: 'Standard',
      date: 'July 31, 2022',
      rounds: [
        // 1
        {
          mode: 'Macro Polo',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Gamel',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Sticky Mode',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'Mr buggins',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Dazai',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'The New Normal',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: '0verHaul',
              points: 3,
            },
            {
              name: 'Rüzgar',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Leadercap',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'The New Normal',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'Rüzgar',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Indiana Jones',
          players: [
            {
              name: 'Ruque',
              points: 10,
            },
            {
              name: 'Mr buggins',
              points: 7,
            },
            {
              name: 'Chaos★Myth',
              points: 5,
            },
            {
              name: '0verHaul',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Reverse Evolve',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: '0verHaul',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Marco Polo',
          players: [
            {
              name: '0verHaul',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'vejer',
              points: 5,
            },
            {
              name: 'Sassyboy',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Lets Be Friends',
          players: [
            {
              name: 'The New Normal',
              points: 10,
            },
            {
              name: 'Mr buggins',
              points: 7,
            },
            {
              name: 'Sassyboy',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Chaos★Myth',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Reverse Evolve',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: '0verHaul',
              points: 7,
            },
            {
              name: 'The New Normal',
              points: 5,
            },
            {
              name: 'Mr buggins',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Evolution',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'Fortress',
              points: 7,
            },
            {
              name: 'Ruque',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: '0verHaul',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'The New Normal',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Chaos★Myth',
              points: 3,
            },
            {
              name: 'Sassyboy',
              points: 1,
            },
          ],
        },
        // 1
        {
          mode: 'Reverse Evolve',
          players: [
            {
              name: 'Mr buggins',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: '0verHaul',
              points: 5,
            },
            {
              name: 'Chaos★Myth',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
      ],
    },

    {
      name: 'Rune Royale: Battle for the Mage Isles',
      winner: 'Chaos★Myth',
      server: 'North America',
      prize: '100 BUSD',
      format: 'Standard',
      date: 'August 28, 2022',
      rounds: [
        // 1
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: '0verHaul',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: '0verHaul',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Iqbalomen',
              points: 1,
            },
          ],
        },
        {
          mode: 'Orb Master',
          players: [
            {
              name: 'sassyboy',
              points: 10,
            },
            {
              name: 'The New Normal',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'Fortress',
              points: 3,
            },
            {
              name: 'Iqbalomen',
              points: 1,
            },
          ],
        },
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'sassyboy',
              points: 10,
            },
            {
              name: 'Chaos★Myth',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Dazai',
              points: 1,
            },
          ],
        },
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: '0verHaul',
              points: 7,
            },
            {
              name: 'Fortress',
              points: 5,
            },
            {
              name: 'Ruque',
              points: 3,
            },
            {
              name: 'Chaos★Myth',
              points: 1,
            },
          ],
        },
        {
          mode: 'Orb Master',
          players: [
            {
              name: 'Chaos★Myth',
              points: 10,
            },
            {
              name: 'The New Normal',
              points: 7,
            },
            {
              name: '0verHaul',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        {
          mode: 'Friendly Reverse',
          players: [
            {
              name: 'Fortress',
              points: 10,
            },
            {
              name: 'Dazai',
              points: 7,
            },
            {
              name: 'Chaos★Myth',
              points: 5,
            },
            {
              name: '0verHaul',
              points: 3,
            },
            {
              name: 'The New Normal',
              points: 1,
            },
          ],
        },
        {
          mode: 'Marco Polo',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: 'The New Normal',
              points: 7,
            },
            {
              name: 'Chaos★Myth',
              points: 5,
            },
            {
              name: 'sassyboy',
              points: 3,
            },
            {
              name: 'Ruque',
              points: 1,
            },
          ],
        },
        {
          mode: 'Bird Eye',
          players: [
            {
              name: 'Dazai',
              points: 10,
            },
            {
              name: '0verHaul',
              points: 7,
            },
            {
              name: 'Chaos★Myth',
              points: 5,
            },
            {
              name: 'Iqbalomen',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        {
          mode: 'Indiana Jones',
          players: [
            {
              name: 'sassyboy',
              points: 10,
            },
            {
              name: 'Chaos★Myth',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'Ruque',
              points: 3,
            },
            {
              name: '0verHaul',
              points: 1,
            },
          ],
        },
        {
          mode: 'Fast Drake',
          players: [
            {
              name: 'The New Normal',
              points: 10,
            },
            {
              name: 'LordGly',
              points: 7,
            },
            {
              name: 'Chaos★Myth',
              points: 5,
            },
            {
              name: 'Dazai',
              points: 3,
            },
            {
              name: 'Fortress',
              points: 1,
            },
          ],
        },
        {
          mode: 'Deathmatch',
          players: [
            {
              name: 'sassyboy',
              points: 10,
            },
            {
              name: 'Chaos★Myth',
              points: 7,
            },
            {
              name: 'Dazai',
              points: 5,
            },
            {
              name: 'The New Normal',
              points: 3,
            },
            {
              name: 'Ruque',
              points: 1,
            },
          ],
        },
      ],
    },
  ];

  const winnerStandings = {};

  for (const tournament of tournaments) {
    if (!winnerStandings[tournament.winner]) winnerStandings[tournament.winner] = [];

    winnerStandings[tournament.winner].push({
      name: tournament.name,
    });
  }

  const gameModeStandings = {};
  const gameModeTotals = {};

  for (const tournament of tournaments) {
    const allPlayers = {};

    for (const round of tournament.rounds) {
      for (const player of round.players) {
        allPlayers[player.name] = true;
      }
    }

    for (const round of tournament.rounds) {
      if (!gameModeStandings[round.mode]) gameModeStandings[round.mode] = [];
      if (!gameModeTotals[round.mode]) gameModeTotals[round.mode] = 0;

      gameModeTotals[round.mode]++;

      const roundPlayers = {};

      for (const player of round.players) {
        roundPlayers[player.name] = true;
      }

      for (const playerName of Object.keys(allPlayers)) {
        if (!roundPlayers[playerName]) {
          const p2 = gameModeStandings[round.mode].find((p) => p.name === playerName);

          if (!p2) {
            gameModeStandings[round.mode].push({
              name: playerName,
              average: 10,
              placements: [10],
            });
          } else {
            p2.placements.push(10);
            p2.average = parseFloat(average(p2.placements).toFixed(2));
          }
        }
      }

      for (const player of round.players) {
        const p2 = gameModeStandings[round.mode].find((p) => p.name === player.name);

        if (!p2) {
          gameModeStandings[round.mode].push({
            name: player.name,
            average: placements[player.points],
            placements: [placements[player.points]],
          });
        } else {
          p2.placements.push(placements[player.points]);
          p2.average = parseFloat(average(p2.placements).toFixed(2));
        }

        gameModeStandings[round.mode] = gameModeStandings[round.mode].sort((a, b) => a.average - b.average);
      }
    }
  }

  for (const mode of Object.keys(gameModeStandings)) {
    gameModeStandings[mode] = gameModeStandings[mode].filter((p) => p.placements.length >= 2 && p.average <= 8);
  }

  const serverStandings = {};
  const serverTotals = {};

  for (const tournament of tournaments) {
    if (!serverStandings[tournament.server]) serverStandings[tournament.server] = [];
    if (!serverTotals[tournament.server]) serverTotals[tournament.server] = 0;

    const allPlayers = {};

    for (const round of tournament.rounds) {
      for (const player of round.players) {
        allPlayers[player.name] = true;
      }
    }

    for (const round of tournament.rounds) {
      serverTotals[tournament.server]++;

      const roundPlayers = {};

      for (const player of round.players) {
        roundPlayers[player.name] = true;
      }

      for (const playerName of Object.keys(allPlayers)) {
        if (!roundPlayers[playerName]) {
          const p2 = serverStandings[tournament.server].find((p) => p.name === playerName);

          if (!p2) {
            serverStandings[tournament.server].push({
              name: playerName,
              average: 10,
              placements: [10],
            });
          } else {
            p2.placements.push(10);
            p2.average = parseFloat(average(p2.placements).toFixed(2));
          }
        }
      }

      for (const player of round.players) {
        const p2 = serverStandings[tournament.server].find((p) => p.name === player.name);

        if (!p2) {
          serverStandings[tournament.server].push({
            name: player.name,
            average: placements[player.points],
            placements: [placements[player.points]],
          });
        } else {
          p2.placements.push(placements[player.points]);
          p2.average = parseFloat(average(p2.placements).toFixed(2));
        }

        serverStandings[tournament.server] = serverStandings[tournament.server].sort((a, b) => a.average - b.average);
      }
    }
  }

  for (const server of Object.keys(serverStandings)) {
    serverStandings[server] = serverStandings[server].filter((p) => p.placements.length >= 5 && p.average <= 8);
  }

  return (
    <>
      <Cards>
        <Card style={{ width: '100%' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Tournaments')}
          </Heading>
          <hr />
          <CardBody>
            <p>
              Rune often hosts tournaments. These are usually weekly and monthly. Our monthly tournament is called Rune
              Royale.
            </p>
            <br />
            <p>
              <strong>Current Format:</strong>
              <br />
              Standard. See below for details.
              <br />
              <br />
              <strong>Prize:</strong>
              <br />
              The prize will be announced with the tournament. The prize will be divided among the top 5 players, with
              half going to first place!
              <br />
              <br />
              <strong>Entry Fee:</strong>
              <br />
              If there's an entry fee, it will be announced with the tournament. Some are free for all, some aren't.
              <br />
              <br />
              <strong>Venue:</strong>
              <br />
              Tournaments are usually hosed on Twitch at{' '}
              <a href="https://twitch.tv/ArkenRealms">twitch.tv/ArkenRealms</a>
              <br />
              <br />
              <strong>Rules:</strong>
              <br />
              Players are free to join and leave as they see fit but obviously the more games they play the more points
              they will earn.
              <br />
              <br />
              No cheating - standard Evolution Isles rules apply.
              <br />
              <br />
              In the event of any bugs and/or issues please tune into{' '}
              <a href="https://twitch.tv/arkenrealms">twitch.tv/ArkenRealms</a> or the #evolution channel in{' '}
              <a href="https://discord.gg/rune">discord.gg/Rune</a>
            </p>
            <br />
            <br />
            <br />
            <br />
            <div
              css={css`
                border: 1px solid #bb955e;
                padding: 10px;
                margin-bottom: 20px;
                font-size: 0.9rem;
              `}>
              <h3 style={{ fontSize: '1.2rem' }}>Standard Format</h3>
              <br />
              <p>
                6 games of Evolution Isles, 10 minute break, 6 more games of Evolution Isles (12 games total)
                <br />
                <br />
                The FIRST and SEVENTH games will be the same (to be announced with the tournament). All others will be
                RNG.
                <br />
                <br />
                <strong>Points Distribution:</strong>
                <br />
                1st - 10 points
                <br />
                2nd - 7 points
                <br />
                3rd - 5 points
                <br />
                4th - 3 points
                <br />
                5th - 1 point
                <br />
              </p>
            </div>
          </CardBody>
        </Card>
        <Card style={{ width: '100%' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Top Players')}
          </Heading>
          <hr />
          <CardBody>
            <p>Here are the tournament winners:</p>
            <br />
            {Object.keys(winnerStandings).map((mode) => (
              <div
                css={css`
                  border: 1px solid #bb955e;
                  padding: 10px;
                  margin-bottom: 20px;
                  font-size: 0.9rem;
                `}>
                <h3 style={{ fontSize: '1.2rem' }}>{mode}</h3>
                <ul>
                  {winnerStandings[mode].map((p) => (
                    <li style={{ paddingRight: 5 }}>{p.name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardBody>
        </Card>
      </Cards>
      <Cards>
        <Card style={{ width: '100%' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Game Mode')}
          </Heading>
          <hr />
          <CardBody>
            <p>Here are the game mode standings (must have placed 2+ times):</p>
            <br />
            {Object.keys(gameModeStandings).map((mode) => (
              <div
                css={css`
                  border: 1px solid #bb955e;
                  padding: 10px;
                  margin-bottom: 20px;
                  font-size: 0.9rem;
                `}>
                <h3 style={{ fontSize: '1.2rem' }}>
                  {mode} <span style={{ opacity: 0.5, fontFamily: 'inherit' }}>({gameModeTotals[mode]} rounds)</span>
                </h3>
                <ul>
                  {gameModeStandings[mode].map((p) => (
                    <li style={{ paddingRight: 5 }}>
                      {p.name} ({p.average})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card style={{ width: '100%' }}>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Server')}
          </Heading>
          <hr />
          <CardBody>
            <p>Here are the server standings (must have placed 5+ times):</p>
            <br />
            {Object.keys(serverStandings).map((mode) => (
              <div
                css={css`
                  border: 1px solid #bb955e;
                  padding: 10px;
                  margin-bottom: 20px;
                  font-size: 0.9rem;
                `}>
                <h3 style={{ fontSize: '1.2rem' }}>
                  {mode} <span style={{ opacity: 0.5, fontFamily: 'inherit' }}>({serverTotals[mode]} rounds)</span>
                </h3>
                <ul>
                  {serverStandings[mode].map((p) => (
                    <li style={{ paddingRight: 5 }}>
                      {p.name} ({p.average})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardBody>
        </Card>
      </Cards>
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('History')}
        </Heading>
        <hr />
        <CardBody>
          <p>Here is the list of previous tournaments, the top standings, including their points and the game mode.</p>
          <br />
          {tournaments.map((result) => (
            <TournamentResult key={result.name} result={result} />
          ))}
        </CardBody>
      </Card>
    </>
  );
};

export default Tournament;
