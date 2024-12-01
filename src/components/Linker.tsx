import areas from '@arken/node/data/generated/areas.json';
import characterClasses from '@arken/node/data/generated/characterClasses.json';
import characterFactions from '@arken/node/data/generated/characterFactions.json';
import characterRaces from '@arken/node/data/generated/characterRaces.json';
import eras from '@arken/node/data/generated/eras.json';
import games from '@arken/node/data/generated/games.json';
import npcs from '@arken/node/data/generated/npcs.json';
import { itemData, ItemRarity, RuneNames } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';
import { decodeItem, normalizeItem } from '@arken/node/util/decoder';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowContainer, Popover } from 'react-tiny-popover';
import styled, { css } from 'styled-components';
import EvolutionIcon from '~/assets/images/icons/evolution-desktop.png';
import GuardiansIcon from '~/assets/images/icons/guardians-desktop.png';
import InfiniteIcon from '~/assets/images/icons/infinite-desktop.png';
import RaidIcon from '~/assets/images/icons/raid-desktop.png';
import SanctuaryIcon from '~/assets/images/icons/sanctuary-desktop.png';
import AreaPreview from '~/components/AreaPreview';
import CharacterClassPreview from '~/components/CharacterClassPreview';
import CharacterFactionPreview from '~/components/CharacterFactionPreview';
import CharacterRacePreview from '~/components/CharacterRacePreview';
import EraPreview from '~/components/EraPreview';
import Item from '~/components/Item';
import NpcPreview from '~/components/NpcPreview';
import ItemsContext from '~/contexts/ItemsContext';
import history from '~/routerHistory';

const zzz = styled.div``;

const gameInfo = {
  'Runic Raids': {
    ...games.find((g) => g.name === 'Runic Raids'),
    icon: RaidIcon,
    color: '#b59494', //'#c4504c'
  },
  'Infinite Arena': {
    ...games.find((g) => g.name === 'Infinite Arena'),
    icon: InfiniteIcon,
    color: '#b59494', //'#32b2df'
  },
  'Evolution Isles': {
    ...games.find((g) => g.name === 'Evolution Isles'),
    icon: EvolutionIcon,
    color: '#b59494', //'#0fc1ff'
  },
  'Heart of the Oasis': {
    ...games.find((g) => g.name === 'Heart of the Oasis'),
    icon: SanctuaryIcon,
    color: '#b59494', //'#d6a542'
  },
  'Guardians Unleashed': {
    ...games.find((g) => g.name === 'Guardians Unleashed'),
    icon: GuardiansIcon,
    color: '#b59494', //'#2fff0f'
  },
};

const gameNames = ['Evolution Isles', 'Infinite Arena', 'Heart of the Oasis', 'Guardians Unleashed', 'Runic Raids'];

const stringReplacements = {
  '0xA9B91...': 'Market contract',
  '0x85C07...': 'Raid contract',
  '0x602a2...': 'Vault',
  '0x2C4AA...': 'Deployer',
  '0xEC8e4...': 'Reward contract',
  '0x5fE24...': 'Barracks contract',
  '0x2C51b...': 'Profile contract',
  '0xdAE69...': 'Old market contract',
};

const stringLinks = {
  Market: '/market',
};

const glossary = {
  Play4Rewards: {
    key: 'Play4Rewards',
    info: (
      <>
        Play4Rewards is an improved version of Play2Earn. Most implementations of P2E aren't sustainable, but with the
        Rune Tokenomics we've developed, players are rewarded with items in a sustainable way.
      </>
    ),
  },
  'Evolving NFTs': {
    key: 'EvolvingNFTs',
    info: (
      <>
        Evolving NFTs use smart item contracts to allow games to use &amp; extend items that players already own. This
        means that a Pokemon Surf game could use a Pikachu from Pokemon Red, teach it Surf, and allow the original game
        or other games to support that Surf ability.
      </>
    ),
  },
  P2E: {
    key: 'P2E',
    info: (
      <>
        P2E means Play2Earn, allowing players to earn while playing. Arken Realms adopts an improved version called P4R
        (Player4Rewards). P4R is P2E with sustainable tokenomics.
      </>
    ),
  },
  'The Shardening': {
    key: 'TheShardening',
    info: (
      <>
        The Shardening was an event that took place November 2021, splitting every RUNE into 10,000 Arken Realm Shards.
      </>
    ),
    to: '/shards',
  },
  $RUNE: {
    key: 'RUNE',
    info: <>$RUNE is the old protocol token, which was split into 10,000 $RXS per $RUNE during The Shardening event.</>,
    to: '/about',
  },
  $RXS: {
    key: 'RXS',
    info: <>$RXS is the protocol token, powering most actions within the Arken Realms.</>,
    to: '/about',
  },
  'BEP-20': {
    key: 'BEP-20',
    info: (
      <>
        BEP-20 is the contract standard used for cryptocurrency tokens on the Binance Smart Chain, and is equivalent to
        ERC-20 from Ethereum.
      </>
    ),
  },
  'Rune Vault': {
    key: 'RuneVault',
    info: (
      <>
        The Rune Vault is where fees from the protocol are sent, eg. character fees, transfer fees, market fees, etc.
        These funds are then used for proposals approved in the Arken Council.
      </>
    ),
    to: '/tokenomics',
  },
};

function setItemToRarity(item) {
  item.attributes = item.branches[1].attributes;
  for (const key in item.attributes) {
    if (!item.branches[1].perfection?.[key]) continue;

    item.attributes[key].value = item.branches[1].presets?.[item.rarity.id]?.[key]
      ? item.branches[1].presets[item.rarity.id][key]
      : item.branches[1].perfection[key];
  }

  item.mods = [{}, {}, {}, {}, {}, {}, {}, {}];

  return item;
}

const Linker = function ({
  id,
  children,
  username = null,
  username2 = null,
  itemName = null,
  tokenId = null,
  replaceItems = true,
  replaceItemAttributes = true,
  replaceCharacterClasses = true,
  replaceAreas = true,
  replaceEras = true,
  replaceCharacterFactions = true,
  replaceCharacterRaces = true,
  replaceNpcs = true,
  replaceStringLinks = true,
  replaceGameNames = true,
  replaceGlossary = true,
  replaceRuneNames = true,
  defaultItemBranch = undefined,
}) {
  const message = children;

  const { itemPreviewed, setItemPreviewed } = useContext(ItemsContext);

  // if (typeof message !== 'string') {
  //   message.readOnly = false
  // }

  const fragments = typeof message === 'string' ? [message] : [...message];

  const matchedItemReplacements = itemData[ItemsMainCategoriesType.OTHER]
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  if (replaceItems && matchedItemReplacements.length > 0) {
    for (const matchedItemReplacement of matchedItemReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedItemReplacement) !== -1) {
            const split = fragment.split(matchedItemReplacement);

            const rawItem = itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === matchedItemReplacement);
            const item = normalizeItem(
              setItemToRarity({ ...JSON.parse(JSON.stringify(rawItem)), rarity: ItemRarity.Mythic })
            );

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-item-${id}-${item.tokenId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span
                  onClick={() => history.push(`/item/${item.slug?.toLowerCase().replace("'", '')}`)}
                  css={css`
                    display: inline-block;
                    text-decoration: none;
                    border: 0 none;
                    margin-left: 2px;
                    margin-right: 2px;

                    & > div {
                      position: relative;
                      width: auto;
                      height: auto;
                      // border: 1px solid #fff;
                      background: rgb(73 74 128 / 10%);
                      border-radius: 5px;
                      padding: 0 2px 2px;
                      min-height: 37px;

                      &:hover {
                        background: rgb(73 74 128 / 20%);
                      }
                    }

                    & > div > div:first-child {
                      display: inline;
                      margin-right: 30px;
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
                    item={item}
                    // bonus={rune.bonus}
                    itemIndex={previewId}
                    showDropdown
                    hideMetadata
                    showActions={false}
                    isDisabled={false}
                    background={false}
                    showQuantity={false}
                    hideRoll={false}
                    defaultBranch={defaultItemBranch}
                    containerCss={css`
                      // display: inline-block;
                      // margin-bottom: -15px;
                      // width: 2rem;
                      // height: 2rem;
                      border-width: 1px;

                      position: unset !important;
                    `}
                    innerCss={css`
                      position: relative;
                    `}>
                    <span style={{ borderBottom: '1px solid transparent', marginRight: '4px' }}>{itemName}</span>
                  </Item>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedCharacterFactionReplacements = characterFactions
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  if (replaceCharacterFactions && matchedCharacterFactionReplacements.length > 0) {
    for (const matchedCharacterFactionReplacement of matchedCharacterFactionReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedCharacterFactionReplacement) !== -1) {
            const split = fragment.split(matchedCharacterFactionReplacement);

            const characterFaction = characterFactions.find((r) => r.name === matchedCharacterFactionReplacement);
            const factionId = characterFaction.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-faction-${id}-${factionId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/faction/${factionId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<CharacterFactionPreview id={factionId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #fff;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {characterFaction.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedCharacterRaceReplacements = [
    ...characterRaces.map((r) => r.name),
    // ...characterRaces.map((r) => r.name?.toLowerCase()),
  ].filter((v) => {
    if (!v) return false;
    return !!fragments.filter((f) => {
      if (typeof f !== 'string') return false;
      return f.includes(v);
    });
  });
  if (replaceCharacterRaces && matchedCharacterRaceReplacements.length > 0) {
    for (const matchedCharacterRaceReplacement of matchedCharacterRaceReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedCharacterRaceReplacement) !== -1) {
            const split = fragment.split(matchedCharacterRaceReplacement);

            const characterRace = characterRaces.find(
              (r) => r.name.toLowerCase() === matchedCharacterRaceReplacement.toLowerCase()
            );
            const raceId = characterRace.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-race-${id}-${raceId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/race/${raceId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<CharacterRacePreview id={raceId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #fff;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {characterRace.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedNpcReplacements = npcs
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  if (replaceNpcs && matchedNpcReplacements.length > 0) {
    for (const matchedNpcReplacement of matchedNpcReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedNpcReplacement) !== -1) {
            const split = fragment.split(matchedNpcReplacement);

            const npc = npcs.find((r) => r.name === matchedNpcReplacement);
            const npcId = npc.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-npc-${id}-${npcId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/npc/${npcId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<NpcPreview id={npcId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #fff;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {npc.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedAreaReplacements = areas
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  // console.log(9999, message, matchedAreaReplacements)
  if (replaceAreas && matchedAreaReplacements.length > 0) {
    for (const matchedAreaReplacement of matchedAreaReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedAreaReplacement) !== -1) {
            const split = fragment.split(matchedAreaReplacement);

            const area = areas.find((r) => r.name === matchedAreaReplacement);
            const areaId = area.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-area-${id}-${areaId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/area/${areaId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<AreaPreview id={areaId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #fff;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {area.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedEraReplacements = eras
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  // console.log(9999, message, matchedEraReplacements)
  if (replaceEras && matchedEraReplacements.length > 0) {
    for (const matchedEraReplacement of matchedEraReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedEraReplacement) !== -1) {
            const split = fragment.split(matchedEraReplacement);

            const era = eras.find((r) => r.name === matchedEraReplacement);
            const eraId = era.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-era-${id}-${eraId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/era/${eraId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<EraPreview id={eraId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #fff;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {era.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedCharacterClassReplacements = characterClasses
    .map((r) => r.name)
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v);
      });
    });
  if (replaceCharacterClasses && matchedCharacterClassReplacements.length > 0) {
    for (const matchedCharacterClassReplacement of matchedCharacterClassReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedCharacterClassReplacement) !== -1) {
            const split = fragment.split(matchedCharacterClassReplacement);

            const characterClass = characterClasses.find((r) => r.name === matchedCharacterClassReplacement);
            const classId = characterClass.name?.toLowerCase().replace("'", '').replace(' ', '-');

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `linker-class-${id}-${classId}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span onClick={() => history.push(`/class/${classId}`)} css={css``}>
                  <Popover
                    isOpen={itemPreviewed === previewId}
                    align="start"
                    padding={20}
                    positions={['right', 'left', 'top', 'bottom']} // preferred positions by priority
                    content={<CharacterClassPreview id={classId} />}>
                    <span
                      css={css`
                        border-bottom: 1px solid #e4d4be;
                        cursor: url('/images/cursor3.png'), pointer;
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {characterClass.name}
                    </span>
                  </Popover>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  if (username) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(username) !== -1) {
          const split = fragment.split(username);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <span
              css={css`
                color: #ddd;
                cursor: url('/images/cursor3.png'), pointer;
              `}
              onClick={() => history.push(`/user/${username}`)}>
              {username}
            </span>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  if (username2) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(username2) !== -1) {
          const split = fragment.split(username2);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <span
              css={css`
                color: #ddd;
                cursor: url('/images/cursor3.png'), pointer;
              `}
              onClick={() => history.push(`/user/${username2}`)}>
              {username2}
            </span>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  if (itemName) {
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];

      if (typeof fragment === 'string') {
        if (fragment.indexOf(itemName) !== -1) {
          const split = fragment.replace('found', 'crafted').replace('!', '').split(itemName);

          fragments.splice(i, 1);
          fragments.splice(i, 0, split[0]);
          fragments.splice(
            i + 1,
            0,
            <span
              onClick={() => history.push(`/token/${tokenId}`)}
              css={css`
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
                item={decodeItem(tokenId)}
                // bonus={rune.bonus}
                itemIndex={'live' + tokenId + id}
                showDropdown
                hideMetadata
                showActions={false}
                isDisabled={false}
                background={false}
                showQuantity={false}
                hideRoll={false}
                containerCss={css`
                  // display: inline-block;
                  // margin-bottom: -15px;
                  // width: 2rem;
                  // height: 2rem;
                  border-width: 1px;

                  position: unset !important;
                `}
                innerCss={css`
                  position: relative;
                `}>
                <span style={{ borderBottom: '1px solid transparent', marginRight: '4px' }}>{itemName}</span>
              </Item>
            </span>
          );
          fragments.splice(i + 2, 0, split[1]);
        }
      }
    }
  }

  const matchedGameNameReplacements = gameNames.filter((v) => {
    return !!fragments.filter((f) => {
      if (typeof f !== 'string') return false;
      return f.includes(v);
    });
  });
  if (replaceGameNames && matchedGameNameReplacements.length > 0) {
    for (const matchedGameNameReplacement of matchedGameNameReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedGameNameReplacement) !== -1) {
            const gameKey = matchedGameNameReplacement.replace('Rune ', '');
            const split = fragment.split(matchedGameNameReplacement);

            fragments.splice(i, 1);

            for (let j = 0; j < split.length - 1; j++) {
              const previewId = `linker-game-${id}-${gameKey}-${i}-${j}`;
              console.log(333222, gameKey);
              fragments.splice(i + j, 0, split[j]);
              fragments.splice(
                i + j + 1,
                0,
                <Popover
                  isOpen={itemPreviewed === previewId}
                  align="start"
                  padding={20}
                  positions={['top', 'bottom', 'right', 'left']} // preferred positions by priority
                  content={({ position, childRect, popoverRect }) => (
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor={'#ddd'}
                      arrowSize={10}
                      arrowStyle={{ opacity: 1 }}
                      className="popover-arrow-container"
                      arrowClassName="popover-arrow">
                      <div
                        css={css`
                          background-color: #000;
                          border: 2px solid #ddd;
                          color: #ddd;
                          border-radius: 7px;
                          max-width: 400px;
                          padding: 20px;
                          opacity: 1;
                        `}
                        onClick={() => setItemPreviewed(null)}>
                        {gameInfo[gameKey].description}
                      </div>
                    </ArrowContainer>
                  )}>
                  <RouterLink
                    to={`/${gameKey.toLowerCase()}`}
                    onMouseEnter={() => setItemPreviewed(previewId)}
                    onMouseLeave={() => setItemPreviewed(null)}
                    css={css`
                      padding: 0 2px 0 4px;
                      color: #ddd;
                      cursor: url('/images/cursor3.png'), pointer !important;
                      border: 1px solid transparent !important;
                      border-radius: 0 5px 5px;
                      height: 24px !important;

                      background: rgb(70 70 70 / 50%) url(${gameInfo[gameKey].icon}) no-repeat 0 0;
                      background-size: 24px;
                      background-position: 1px 1px;
                      padding: 0 5px 0 32px !important;

                      color: ${gameInfo[gameKey].color};
                      // border-color: ${gameInfo[gameKey].color};

                      &:hover {
                        border-radius: 5px;
                        background-color: rgb(70 70 70 / 80%);
                        cursor: url('/images/cursor3.png'), pointer;
                      }
                    `}>
                    {matchedGameNameReplacement}
                  </RouterLink>
                </Popover>
              );
            }
            fragments.splice(i + split.length, 0, split[split.length - 1]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedGlossaryReplacements = Object.keys(glossary).filter((v) => {
    return !!fragments.filter((f) => {
      if (typeof f !== 'string') return false;
      return f.includes(v);
    });
  });
  if (replaceGlossary && matchedGlossaryReplacements.length > 0) {
    for (const matchedGlossaryReplacement of matchedGlossaryReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedGlossaryReplacement) !== -1) {
            const glossaryItem = glossary[matchedGlossaryReplacement];
            const split = fragment.split(matchedGlossaryReplacement);

            fragments.splice(i, 1);

            for (let j = 0; j < split.length - 1; j++) {
              const previewId = `linker-glossary-${id}-${glossaryItem.key}-${i}-${j}`;
              // console.log(9999, previewId, glossaryItem.info)
              fragments.splice(i + j, 0, split[j]);
              fragments.splice(
                i + j + 1,
                0,
                <Popover
                  isOpen={itemPreviewed === previewId}
                  align="start"
                  padding={20}
                  positions={['top', 'bottom', 'right', 'left']} // preferred positions by priority
                  content={({ position, childRect, popoverRect }) => (
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor={'#ddd'}
                      arrowSize={10}
                      arrowStyle={{ opacity: 1 }}
                      className="popover-arrow-container"
                      arrowClassName="popover-arrow">
                      <div
                        css={css`
                          cursor: url('/images/cursor3.png'), pointer;
                          background-color: #000;
                          border: 2px solid #ddd;
                          color: #ddd;
                          border-radius: 7px;
                          max-width: 400px;
                          padding: 20px;
                          opacity: 1;
                        `}
                        onClick={() => setItemPreviewed(null)}>
                        {glossaryItem.info}
                      </div>
                    </ArrowContainer>
                  )}>
                  {glossaryItem.to ? (
                    <RouterLink
                      to={glossaryItem.to}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {matchedGlossaryReplacement}
                    </RouterLink>
                  ) : (
                    <span
                      css={css`
                        text-shadow: none;
                        &:after {
                          font-size: 90%;
                          line-height: 50%;
                          font-weight: bold;
                          vertical-align: super;
                          content: '*';
                        }
                        &:hover {
                          cursor: url('/images/cursor3.png'), pointer;
                        }
                      `}
                      onMouseEnter={() => setItemPreviewed(previewId)}
                      onMouseLeave={() => setItemPreviewed(null)}>
                      {matchedGlossaryReplacement}
                    </span>
                  )}
                </Popover>
              );
            }
            fragments.splice(i + split.length, 0, split[split.length - 1]);

            i = -1;
          }
        }
      }
    }
  }

  const matchedStringReplacements = Object.keys(stringReplacements).filter((v) => {
    return !!fragments.filter((f) => {
      if (typeof f !== 'string') return false;
      return f.includes(v);
    });
  });
  if (matchedStringReplacements.length) {
    for (const matchedStringReplacement of matchedStringReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedStringReplacement) !== -1) {
            const split = fragment.split(matchedStringReplacement);

            fragments.splice(i, 1);
            fragments.splice(i, 0, split[0]);
            fragments.splice(i + 1, 0, stringReplacements[matchedStringReplacement]);
            fragments.splice(i + 2, 0, split[1]);
          }
        }
      }
    }
  }

  const newMessage = fragments.join('');

  const matchedStringLinks = Object.keys(stringLinks).filter((v) => newMessage.includes(v));
  if (replaceStringLinks && !!matchedStringLinks.length) {
    for (const matchedStringLink of matchedStringLinks) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedStringLink) !== -1) {
            const split = fragment.split(matchedStringLink);

            fragments.splice(i, 1);
            fragments.splice(i, 0, split[0]);
            fragments.splice(
              i + 1,
              0,
              <span
                onClick={() => history.push(stringLinks[matchedStringLink])}
                css={css`
                  padding: 0 2px 0 4px;
                  color: #ddd;
                  cursor: url('/images/cursor3.png'), pointer;
                `}>
                {matchedStringLink}
              </span>
            );
            fragments.splice(i + 2, 0, split[1]);
          }
        }
      }
    }
  }

  // const pageName = pageNames.find((v) => {
  //   return !!fragments.filter(f => {
  //     if (typeof f !== 'string') return false
  //     return f.includes(v)
  //   })
  // })
  // if (pageName) {
  //   for (let i = 0; i < fragments.length; i++) {
  //     const fragment = fragments[i]

  //     if (typeof fragment === 'string') {
  //       if (fragment.indexOf(pageName) !== -1) {
  //         const split = fragment.replace('!', '').split(pageName)

  //         fragments.splice(i, 1)
  //         fragments.splice(i, 0, split[0])
  //         fragments.splice(
  //           i + 1,
  //           0,
  //           <span
  //             onClick={() => history.push(`/${pageName.toLowerCase()}`}
  //             css={css`
  //               padding: 0 2px 0 4px;
  //             `}
  //           >
  //             {pageName}
  //           </span>,
  //         )
  //         fragments.splice(i + 2, 0, split[1])
  //       }
  //     }
  //   }
  // }

  const matchedRuneNameReplacements = Object.values(RuneNames)
    .sort((a: any, b: any) => (a.length > b.length ? -1 : 1))
    .filter((v) => {
      return !!fragments.filter((f) => {
        if (typeof f !== 'string') return false;
        return f.includes(v as any);
      });
    }) as any;
  if (replaceRuneNames && matchedRuneNameReplacements.length > 0) {
    for (const matchedRuneNameReplacement of matchedRuneNameReplacements) {
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];

        if (typeof fragment === 'string') {
          if (fragment.indexOf(matchedRuneNameReplacement) !== -1) {
            const split = fragment.split(matchedRuneNameReplacement);

            fragments.splice(i, 1);

            for (let j = split.length - 1; j > 0; j--) {
              const previewId = `live-${id}-${matchedRuneNameReplacement}-${i}-${j}`;

              fragments.splice(i, 0, split[j]);
              fragments.splice(
                i,
                0,
                <span
                  onClick={() => history.push(`/runes/${matchedRuneNameReplacement.toLowerCase()}`)}
                  css={css`
                    position: relative;
                    display: inline-block;
                    text-decoration: none;
                    border: 0 none;
                    // margin-left: 2px;
                    // margin-right: 2px;

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
                      margin-right: 31px;
                    }

                    & > div > div:first-child > div:first-child {
                      top: 4px;
                      left: 4px;
                      width: 24px;
                      height: 24px;
                    }

                    & > div > div:first-child > div:nth-child(2) {
                      top: 4px;
                      left: 4px;
                      width: 24px;
                      height: 24px;
                    }
                  `}>
                  <Item
                    item={
                      itemData[ItemsMainCategoriesType.RUNES].find(
                        (item) => item.details.Symbol === matchedRuneNameReplacement
                      ) as any
                    }
                    // bonus={rune.bonus}
                    itemIndex={previewId}
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
                    <span
                      css={css`
                        color: #ddd;
                        cursor: url('/images/cursor3.png'), pointer;
                        border-bottom: 1px solid transparent;
                      `}>
                      {matchedRuneNameReplacement}
                    </span>
                  </Item>
                </span>
              );
            }
            fragments.splice(i, 0, split[0]);

            i = -1;
          }
        }
      }
    }
  }

  return (
    <>
      {fragments.map((f, index) => (
        <span key={index}>{f} </span>
      ))}
    </>
  );
};

export default Linker;
