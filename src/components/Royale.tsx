import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { itemData, RuneNames } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { decodeItem } from '@arken/node/util/decoder';
import shortId from 'shortid';
import io from 'socket.io-client';
import styled, { css } from 'styled-components';
import EvolutionIcon from '~/assets/images/icons/evolution-desktop.png';
import GuardiansIcon from '~/assets/images/icons/guardians-desktop.png';
import InfiniteIcon from '~/assets/images/icons/infinite-desktop.png';
import RaidIcon from '~/assets/images/icons/raid-desktop.png';
import SanctuaryIcon from '~/assets/images/icons/sanctuary-desktop.png';
import Item from '~/components/Item';
import Page from '~/components/layout/Page';
import useFetch from '~/hooks/useFetch';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { BaseLayout, Card, CardBody, Heading, Skeleton, Text } from '~/ui';
//import '~swiper/swiper.min.css'
//import '~swiper/modules/navigation/navigation.min.css' // Navigation module
//import '~swiper/modules/pagination/pagination.min.css' // Pagination module
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const gameIcons = {
  Raid: RaidIcon,
  Infinite: InfiniteIcon,
  Evolution: EvolutionIcon,
  Sanctuary: SanctuaryIcon,
  Guardians: GuardiansIcon,
};

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const gameNames = ['Evolution', 'Infinite', 'Sanctuary', 'Guardians', 'Raid'];

const pageNames = ['Market'];

const ViewControls = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: left;
  width: 100%;
  margin-bottom: 15px;
  padding: 10px;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;
  }
`;

// <Tooltip content={t(explanation)} style={{ textShadow: 'none' }}>
//   {attr}
// </Tooltip>

const PlayerAction = function ({ action }) {
  if (!action) return <></>;

  const fragments = [action.message];

  if (action.username) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(action.username) !== -1) {
          const split = fragment.split(action.username);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(i + 1, 0, <RouterLink to={`/user/${action.username}`}>{action.username}</RouterLink>);
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  if (action.username2) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(action.username2) !== -1) {
          const split = fragment.split(action.username2);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(i + 1, 0, <RouterLink to={`/user/${action.username2}`}>{action.username2}</RouterLink>);
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  if (action.itemName) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(action.itemName) !== -1) {
          const split = fragment.replace('found', 'crafted').replace('!', '').split(action.itemName);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <RouterLink
              to={`/token/${action.tokenId}`}
              css={css`
                position: relative;
                display: inline-block;
                text-decoration: none;
                border: 0 none;
                margin-left: 5px;
                margin-right: 5px;

                & > div {
                  position: relative;
                  width: auto;
                  height: auto;
                  // border: 1px solid #fff;
                  background: rgb(73 74 128 / 10%);
                  border-radius: 5px;
                  padding: 0 2px 2px;

                  &:hover {
                    background: rgb(73 74 128 / 20%);
                  }
                }

                & > div > div:first-child {
                  display: inline;
                  margin-right: 35px;
                }

                & > div > div:first-child > div:first-child {
                  top: 2px;
                  left: 4px;
                  width: 26px;
                  height: 26px;
                }

                & > div > div:first-child > div:nth-child(2) {
                  top: 2px;
                  left: 4px;
                  width: 26px;
                  height: 26px;
                }
              `}>
              <Item
                item={decodeItem(action.tokenId)}
                // bonus={rune.bonus}
                itemIndex={'royale' + action.tokenId}
                showDropdown
                hideMetadata
                showActions={false}
                isDisabled={false}
                background={false}
                showQuantity={false}
                containerCss={css`
                  // display: inline-block;
                  // margin-bottom: -15px;
                  // width: 2rem;
                  // height: 2rem;
                  border-width: 1px;
                `}>
                <span style={{ borderBottom: '1px solid transparent', marginRight: '4px' }}>{action.itemName}</span>
              </Item>
            </RouterLink>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  const gameName = gameNames.find((v) => action.message.includes(v));
  if (gameName) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(gameName) !== -1) {
          const split = fragment.split(gameName);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <RouterLink
              to={`/${gameName.toLowerCase()}`}
              css={css`
                padding: 0 2px 0 4px;
              `}>
              <img
                src={gameIcons[gameName]}
                css={css`
                  width: 28px;
                  height: 28px;
                  margin-bottom: -7px;
                  margin-right: 3px;
                `}
              />{' '}
              {gameName}
            </RouterLink>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  const pageName = pageNames.find((v) => action.message.includes(v));
  if (pageName) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(pageName) !== -1) {
          const split = fragment.replace('!', '').split(pageName);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <RouterLink
              to={`/${pageName.toLowerCase()}`}
              css={css`
                padding: 0 2px 0 4px;
              `}>
              {pageName}
            </RouterLink>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  const runeName: any = Object.values(RuneNames).find((v) => action.message.includes(v));
  if (runeName) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(runeName) !== -1) {
          const split = fragment.split(runeName);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <RouterLink
              to={`/runes/${runeName.toLowerCase()}`}
              css={css`
                position: relative;
                display: inline-block;
                text-decoration: none;
                border: 0 none;
                margin-left: 5px;
                margin-right: 5px;

                & > div {
                  position: relative;
                  width: auto;
                  height: auto;
                  // border: 1px solid #fff;
                  background: rgb(73 74 128 / 10%);
                  border-radius: 5px;
                  padding: 0 2px 2px;

                  &:hover {
                    background: rgb(73 74 128 / 20%);
                  }
                }

                & > div > div:first-child {
                  display: inline;
                  margin-right: 35px;
                }

                & > div > div:first-child > div:first-child {
                  top: 2px;
                  left: 4px;
                  width: 26px;
                  height: 26px;
                }

                & > div > div:first-child > div:nth-child(2) {
                  top: 2px;
                  left: 4px;
                  width: 26px;
                  height: 26px;
                }
              `}>
              <Item
                item={itemData[ItemsMainCategoriesType.RUNES].find((item) => item.details.Symbol === runeName) as any}
                // bonus={rune.bonus}
                itemIndex={'royale' + runeName}
                showDropdown
                hideMetadata
                showActions={false}
                isDisabled={false}
                background={false}
                showQuantity={false}
                containerCss={css`
                  // display: inline-block;
                  // margin-bottom: -15px;
                  // width: 2rem;
                  // height: 2rem;
                `}>
                <span style={{ borderBottom: '1px solid transparent' }}>{runeName}</span>
              </Item>
            </RouterLink>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  return (
    <div
      css={css`
        display: block;
        padding: 3px 0 3px;
      `}>
      {fragments.map((f, index) => (
        <span key={index}>{f}</span>
      ))}
    </div>
  );
};

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 200px;

  ${Text} {
    margin-left: 8px;
  }
`;

const getSocket = (endpoint) => {
  console.log('Connecting to', endpoint);
  return io(endpoint, {
    transports: ['websocket'],
    upgrade: false,
    // extraHeaders: {
    //   "my-custom-header": "1234"
    // }
  });
};

const databaserEndpoint = 'envoy.arken.gg:8443';

const url = `https://envoy.arken.gg/notices.json`;
let timeout;
let reloadTimeout;
let socket;

const ignoredUsers = ['QuizMaster', 'Botter', 'Sdadasd', 'Pandamonium'];

const defaultFilters = [
  'market-buy',
  'evolution',
  'evolution1',
  'evolution1-winner',
  'evolution2',
  'infinite',
  'infinite1',
  'raid',
  'raid1',
  'raid1-equipped',
  'raid1-unequipped',
  'raid1-burn',
  'raid1-bonus',
  'raid1-hidden-pool',
  'raid1-fee',
  'raid2',
  'guardians',
  'guardians1',
  'sanctuary',
  'sanctuary1',
  'moderator-action',
  'character-create',
  'character-transfer',
  'achievement',
  'item-craft',
  'item-transfer',
  'item-transmute',
  'item-disenchant',
  'guild-join',
  'reward-claim',
  'market-list',
  'player-active',
  'player-inactive',
];

const runeRoyalePlacementMap = {
  1: 10,
  2: 7,
  3: 5,
  4: 3,
  5: 1,
};

const LiveInner = () => {
  const { t } = useTranslation();
  const { data, reload } = useFetch(url);
  const [notices, setNotices] = useState(data?.[url]);
  const [actions, setActions] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const actionsData = useRef([]);
  const [isRuneRoyale, setIsRuneRoyale] = useState(false);
  const isRuneRoyaleRef = useRef(false);
  const [isRuneRoyalePaused, setIsRuneRoyalePaused] = useState(false);
  const isRuneRoyalePausedRef = useRef(false);
  const [runeRoyaleData, setRuneRoyaleData] = useState({});
  const runeRoyaleDataRef = useRef(runeRoyaleData);
  const [runeRoyaleRealm, setRuneRoyaleRealm] = useState(null);
  const runeRoyaleRealmRef = useRef(runeRoyaleRealm);
  const filtersRef = useRef(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;

  const toggleFilter = function (filterKey) {
    let _filters;
    if (filters.includes(filterKey)) _filters = filters.filter((f) => f !== filterKey);
    else _filters = [...filters, filterKey];

    filtersRef.current = _filters;

    setFilters(_filters);
  };

  useEffect(function () {
    async function connect() {
      if (socket) socket.disconnect();

      socket = getSocket('https://' + databaserEndpoint);

      socket.on('connect', async function () {});

      socket.on('PlayerAction', async function (actionData) {
        console.log('Received player action', actionData);

        // if (ignoredUsers.includes(actionData.username)) return //  && window.location.hostname !== 'localhost'

        actionsData.current = [
          {
            id: shortId(),
            visible: true,
            data: actionData,
          },
          ...actionsData.current,
        ];

        if (!filtersRef.current.includes('evolution'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution') === -1);

        if (!filtersRef.current.includes('evolution1'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution1') === -1);

        if (!filtersRef.current.includes('evolution2'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('evolution2') === -1);

        if (!filtersRef.current.includes('raid'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid') === -1);

        if (!filtersRef.current.includes('raid2'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid2') === -1);

        if (!filtersRef.current.includes('raid1'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('raid1') === -1);

        if (!filtersRef.current.includes('infinite'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('infinite') === -1);

        if (!filtersRef.current.includes('infinite1'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('infinite1') === -1);

        if (!filtersRef.current.includes('guardians'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('guardians') === -1);

        if (!filtersRef.current.includes('guardians1'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('guardians1') === -1);

        if (!filtersRef.current.includes('sanctuary'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('sanctuary') === -1);

        if (!filtersRef.current.includes('sanctuary1'))
          actionsData.current = actionsData.current.filter((n) => n.data.key.indexOf('sanctuary1') === -1);

        actionsData.current = actionsData.current.filter((n) => filtersRef.current.includes(n.data.key));

        setActions(actionsData.current);

        if (actionData.key === 'moderator-action' && actionData.method === 'RS_StartRuneRoyaleRequest') {
          isRuneRoyaleRef.current = true;
          setIsRuneRoyale(isRuneRoyaleRef.current);

          // @ts-ignore
          runeRoyaleDataRef.current = {};
          setRuneRoyaleData(runeRoyaleDataRef.current);

          runeRoyaleRealmRef.current = actionData.realmKey;
          setRuneRoyaleRealm(runeRoyaleRealmRef.current);
        }

        if (actionData.key === 'moderator-action' && actionData.method === 'RS_PauseRuneRoyaleRequest') {
          isRuneRoyalePausedRef.current = true;
          setIsRuneRoyalePaused(isRuneRoyalePausedRef.current);
        }

        if (actionData.key === 'moderator-action' && actionData.method === 'RS_UnpauseRuneRoyaleRequest') {
          isRuneRoyalePausedRef.current = false;
          setIsRuneRoyalePaused(isRuneRoyalePausedRef.current);
        }

        if (actionData.key === 'moderator-action' && actionData.method === 'RS_StopRuneRoyaleRequest') {
          isRuneRoyaleRef.current = false;
          setIsRuneRoyale(isRuneRoyaleRef.current);
        }

        if (
          isRuneRoyaleRef.current &&
          !isRuneRoyalePausedRef.current &&
          runeRoyaleRealmRef.current === actionData.realmKey &&
          actionData.key === 'evolution1-winner'
        ) {
          if (!runeRoyaleDataRef.current[actionData.username]) runeRoyaleDataRef.current[actionData.username] = 0;

          runeRoyaleDataRef.current[actionData.username] += runeRoyalePlacementMap[actionData.placement] || 0;
          console.log(runeRoyaleDataRef.current);
          setRuneRoyaleData({ ...runeRoyaleDataRef.current });
        }
      });
    }

    connect();
  }, []);

  useEffect(
    function () {
      if (reloadTimeout) return;

      function reloadInterval() {
        reload(url);

        reloadTimeout = setTimeout(reloadInterval, 30 * 1000);
      }

      reloadTimeout = setTimeout(reloadInterval, 30 * 1000);

      return () => {
        clearTimeout(reloadTimeout);
        reloadTimeout = undefined;
      };
    },
    [reload]
  );

  useEffect(
    function () {
      // if (notices) return
      if (!data?.[url]) return;

      const lastVisibleId = notices?.find((n) => (n.visible ? true : false))?.id || data[url][data[url].length - 1].id;
      const lastVisibleIndex = !data[url][data[url].length - 1].visible
        ? 0
        : data[url].indexOf(data[url].find((d) => d.id === lastVisibleId)); // if the last item isn't visible, then its first load, make all visible

      for (let i = lastVisibleIndex; i < data[url].length; i++) {
        data[url][i].visible = true;
      }

      let _notices = data[url].filter((n) => filtersRef.current.includes(n.data.key));

      if (!filtersRef.current.includes('evolution'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution') === -1);

      if (!filtersRef.current.includes('evolution1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution1') === -1);

      if (!filtersRef.current.includes('evolution2'))
        _notices = _notices.filter((n) => n.data.key.indexOf('evolution2') === -1);

      if (!filtersRef.current.includes('raid')) _notices = _notices.filter((n) => n.data.key.indexOf('raid') === -1);

      if (!filtersRef.current.includes('raid1')) _notices = _notices.filter((n) => n.data.key.indexOf('raid1') === -1);

      if (!filtersRef.current.includes('raid2')) _notices = _notices.filter((n) => n.data.key.indexOf('raid2') === -1);

      if (!filtersRef.current.includes('infinite'))
        _notices = _notices.filter((n) => n.data.key.indexOf('infinite') === -1);

      if (!filtersRef.current.includes('infinite1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('infinite1') === -1);

      if (!filtersRef.current.includes('guardians'))
        _notices = _notices.filter((n) => n.data.key.indexOf('guardians') === -1);

      if (!filtersRef.current.includes('guardians1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('guardians1') === -1);

      if (!filtersRef.current.includes('sanctuary'))
        _notices = _notices.filter((n) => n.data.key.indexOf('sanctuary') === -1);

      if (!filtersRef.current.includes('sanctuary1'))
        _notices = _notices.filter((n) => n.data.key.indexOf('sanctuary1') === -1);

      if (window.location.hostname !== 'localhost')
        _notices = _notices.filter((n) => !ignoredUsers.includes(n.data.username));

      if (JSON.stringify(_notices) !== JSON.stringify(notices)) {
        console.log('Updating notices');
        setNotices(_notices);
      }
    },
    [data, notices]
  );

  useEffect(
    function () {
      if (!notices) return;
      if (timeout) return;

      function makeVisible() {
        const _notices = notices;
        for (let i = _notices.length - 1; i >= 0; i--) {
          const notice = _notices[i];

          if (!notice.visible) {
            notice.visible = true;
            setNotices([..._notices]);
            timeout = setTimeout(makeVisible, 3 * 1000);
            return;
          }
        }

        timeout = setTimeout(makeVisible, 3 * 1000);
      }

      timeout = setTimeout(makeVisible, 3 * 1000);

      return () => {
        clearTimeout(timeout);
        timeout = undefined;
      };
    },
    [notices, setNotices]
  );

  const filteredNotices = notices?.filter((n) => !!n.visible).slice(0, 30);

  const filteredActions = actions?.filter((n) => !!n.visible).slice(0, 30);

  let runeRoyaleStandings = [];

  for (const name of Object.keys(runeRoyaleData)) {
    runeRoyaleStandings.push({
      name,
      points: runeRoyaleData[name],
    });
  }

  runeRoyaleStandings = runeRoyaleStandings.sort((a, b) => b.points - a.points);

  return (
    <>
      <Page>
        <Cards>
          {isRuneRoyale ? (
            <Card style={{ width: '100%', overflow: 'visible' }}>
              <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                {t('Rune Royale')} {isRuneRoyalePaused ? 'PAUSED' : ''}
              </Heading>
              <hr />
              <CardBody>
                {!runeRoyaleStandings.length ? <Skeleton height="80px" mb="16px" /> : null}
                {runeRoyaleStandings.map((standing, index) => (
                  <div key={index} style={{ width: '100%', fontSize: '1.4rem', lineHeight: '2rem' }}>
                    {index + 1}. {standing.name} ({standing.points})
                  </div>
                ))}
              </CardBody>
            </Card>
          ) : null}
        </Cards>
      </Page>
    </>
  );
};

export default LiveInner;
