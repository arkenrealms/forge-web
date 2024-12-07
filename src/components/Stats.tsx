import React, { useState, useCallback, useEffect } from 'react';
import { Heading, Card3, CardBody, Text, Link, BaseLayout, Skeleton } from '~/ui';
import Page from '~/components/layout/Page';
import PageWindow from '~/components/PageWindow';
import styled from 'styled-components';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import CardValue from '~/components/raid/CardValue';
import useCache from '~/hooks/useCache';
import SimpleLineChart from '~/components/SimpleLineChart';
import { safeRuneList } from '~/config';
import { trpc } from '~/utils/trpc';
import type * as Arken from '@arken/node';

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

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
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

// const ChartWrapper = styled.div`
//   // position: absolute;
//   // bottom: 0px;
//   // left: -20px;
//   width: 100%;
//   flex: 1;
//   // background: radial-gradient(#1d8a99, teal);
//   // padding: 1em;
//   // width: 540px;
//   height: 427px;
//   // pointer-events: none;
//   // z-index: 10;
//   // opacity: 0.5;
// `;

// const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const Stats = () => {
  const { t } = useTranslation();

  const { data: game } = trpc.seer.game.getGame.useQuery<Arken.Game.Types.Game>({
    where: {
      name: { equals: 'Runic Raids' },
    },
  });

  if (!game?.stat)
    return (
      <div style={{ padding: 10 }}>
        <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
      </div>
    );

  // const [evolutionHistorical, setEvolutionHistorical] = useState(null);

  // useEffect(function () {
  //   if (!window) return;

  //   const coeff = 1000 * 60 * 5;
  //   const date = new Date(); //or use any other date
  //   const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

  //   async function init() {
  //     const data = (await (
  //       await fetch(
  //         (isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/evolution/historical.json?' + rand
  //       )
  //     ).json()) as any;

  //     setEvolutionHistorical(data);
  //   }

  //   init();
  // }, []);

  const totalWarrior = game.stat.meta.characters[1].total;
  const totalMage = game.stat.meta.characters[2].total;
  const totalRanger = game.stat.meta.characters[3].total;
  const totalNecromancer = game.stat.meta.characters[4].total;
  const totalPaladin = game.stat.meta.characters[5].total;
  const totalAssassin = game.stat.meta.characters[6].total;
  const totalDruid = game.stat.meta.characters[7].total;
  const totalBards = game.stat.meta.characters[8]?.total || 0;
  const characterCount = game.stat.meta.totalCharacters;

  const totalSteel = game.stat.meta.items[1].total;
  const totalFury = game.stat.meta.items[2].total;
  const totalLorekeeper = game.stat.meta.items[3].total;
  const totalWorldstone = game.stat.meta.items[4].total;
  const totalFlash = game.stat.meta.items[5].total;
  const totalTitan = game.stat.meta.items[6].total;
  const totalSmoke = game.stat.meta.items[7].total;
  const totalGlory = game.stat.meta.items[10].total;
  const totalGrace = game.stat.meta.items[11].total;
  const totalGenesis = game.stat.meta.items[12].total;
  const totalDestiny = game.stat.meta.items[13].total;
  const totalWrath = game.stat.meta.items[14].total;
  const totalPledge = game.stat.meta.items[19].total;
  const totalInstinct = game.stat.meta.items[27]?.total || 0;
  const totalBeacon = game.stat.meta.items[28]?.total || 0;
  const totalGuidingLight = game.stat.meta.items[21]?.total || 0;
  const totalDragonlight = game.stat.meta.items[29]?.total || 0;
  const itemCount = game.stat.meta.totalItems;

  const runes =
    window?.location?.hostname === 'localhost' ? ['rxs', 'rune', ...safeRuneList] : ['rxs', 'rune', ...safeRuneList];
  let totalMarketCap = 0;

  return (
    <>
      <Cards>
        <Card3>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Token Stats')}
            </Heading>
            {runes.map((rune) => {
              const price = game.stat.meta.runes[rune].price || 0;
              const totalSupply = game.stat.meta.runes[rune].totalSupply || 0;
              const totalBurned = game.stat.meta.runes[rune].totalBurned || 0;
              const circulatingSupply = game.stat.meta.runes[rune].circulatingSupply || 0;
              const marketCap = price * circulatingSupply || 0;

              if (rune !== runes[runes.length - 1] && rune !== 'rune') {
                totalMarketCap += marketCap;
              }

              return (
                <div key={rune}>
                  <Row>
                    <br />
                  </Row>
                  <Row>
                    <Text fontSize="1rem">{t(`${rune.toUpperCase()} Price`)}</Text>
                    {price && (
                      <Text fontSize="1rem" bold>
                        ${price.toFixed(4)}
                      </Text>
                    )}
                  </Row>
                  <Row>
                    <Text fontSize="1rem">{t(`${rune.toUpperCase()} Market Cap`)}</Text>
                    {circulatingSupply && (
                      <Text fontSize="1rem" bold>
                        ${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Text>
                    )}
                  </Row>
                  <Row>
                    <Text fontSize="1rem">{t(`Max ${rune.toUpperCase()} Supply`)}</Text>
                    <Text fontSize="1rem" bold>
                      {circulatingSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Text>
                  </Row>
                  <Row>
                    <Text fontSize="1rem">
                      {totalSupply.toLocaleString(undefined, { maximumFractionDigits: 0 })} minted -{' '}
                      {totalBurned.toLocaleString(undefined, { maximumFractionDigits: 0 })} burned
                    </Text>
                  </Row>
                  <Row>
                    <br />
                  </Row>
                </div>
              );
            })}
            <Row>
              <Text fontSize="1rem" bold>
                {t('TOTAL MARKET CAP')}
              </Text>
              <Text fontSize="1rem" bold>
                ${totalMarketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </Text>
            </Row>
          </CardBody>
        </Card3>
        <Card3>
          <CardBody>
            <Heading size="xl" mb="24px">
              {t('Character Stats')}
            </Heading>
            <Row>
              <Text fontSize="1rem">{t('Warriors')}</Text>
              {totalWarrior && <CardValue fontSize="1rem" value={totalWarrior} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Mages')}</Text>
              {totalMage && <CardValue fontSize="1rem" value={totalMage} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Rangers')}</Text>
              {totalRanger && <CardValue fontSize="1rem" value={totalRanger} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Necromancers')}</Text>
              {totalNecromancer && <CardValue fontSize="1rem" value={totalNecromancer} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Paladins')}</Text>
              {totalPaladin && <CardValue fontSize="1rem" value={totalPaladin} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Assassins')}</Text>
              {totalAssassin && <CardValue fontSize="1rem" value={totalAssassin} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Druids')}</Text>
              {totalDruid && <CardValue fontSize="1rem" value={totalDruid} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Bards')}</Text>
              {totalBards && <CardValue fontSize="1rem" value={totalBards} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem" bold>
                {t('TOTAL')}
              </Text>
              {characterCount && <CardValue fontSize="1rem" bold value={characterCount} decimals={0} />}
            </Row>
            <br />
            <Heading size="xl" mb="24px">
              {t('Item Stats')}
            </Heading>
            <strong>Runeforms</strong>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem">{t('Steel (Retired)')}</Text>
              {totalSteel && <CardValue fontSize="1rem" value={totalSteel} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Fury (Retired)')}</Text>
              {totalFury && <CardValue fontSize="1rem" value={totalFury} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Lorekeeper (Retired)')}</Text>
              {totalLorekeeper && <CardValue fontSize="1rem" value={totalLorekeeper} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Flash (Retired)')}</Text>
              {totalFlash && <CardValue fontSize="1rem" value={totalFlash} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Titan (Retired)')}</Text>
              {totalTitan && <CardValue fontSize="1rem" value={totalTitan} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Smoke (Retired)')}</Text>
              {totalSmoke && <CardValue fontSize="1rem" value={totalSmoke} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Glory')}</Text>
              {totalGlory && <CardValue fontSize="1rem" value={totalGlory} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Grace (Retired)')}</Text>
              {totalGrace && <CardValue fontSize="1rem" value={totalGrace} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Destiny')}</Text>
              {totalDestiny && <CardValue fontSize="1rem" value={totalDestiny} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Pledge')}</Text>
              {totalPledge && <CardValue fontSize="1rem" value={totalPledge} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Genesis (Retired)')}</Text>
              {totalGenesis && <CardValue fontSize="1rem" value={totalGenesis} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Wrath (Retired)')}</Text>
              {totalWrath && <CardValue fontSize="1rem" value={totalWrath} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Fortress (Ultra Secret)')}</Text>
              {game.stat.meta.items[15]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[15]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Flow (Retired)')}</Text>
              {game.stat.meta.items[20]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[20]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Guiding Light (Retired)')}</Text>
              {totalGuidingLight && <CardValue fontSize="1rem" value={totalGuidingLight} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Lionheart (Ultra Secret Retired)')}</Text>
              {game.stat.meta.items[22]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[22]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Pressure (Retired)')}</Text>
              {game.stat.meta.items[23]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[23]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Zeal (Ultra Secret Retired)')}</Text>
              {game.stat.meta.items[24]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[24]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Balance (Retired)')}</Text>
              {game.stat.meta.items[25]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[25]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Eternity (Ultra Secret Retired)')}</Text>
              {game.stat.meta.items[26]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[26]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Instinct (Retired)')}</Text>
              {totalInstinct && <CardValue fontSize="1rem" value={totalInstinct} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Beacon (Retired)')}</Text>
              {totalBeacon && <CardValue fontSize="1rem" value={totalBeacon} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Haze (Ultra Secret Retired)')}</Text>
              {game.stat.meta.items[30]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[30]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Mercy (Ultra Secret Retired)')}</Text>
              {game.stat.meta.items[35]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[35]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Burial (Retired)')}</Text>
              {game.stat.meta.items[37]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[37]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Blur')}</Text>
              {game.stat.meta.items[34]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[34]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Reave (Retired)')}</Text>
              {game.stat.meta.items[55]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[55]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Exile')}</Text>
              {game.stat.meta.items[182]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[182]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Elder')}</Text>
              {game.stat.meta.items[16]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[16]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Hellfire')}</Text>
              {game.stat.meta.items[31]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[31]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Hellreaver')}</Text>
              {game.stat.meta.items[44]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[44]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Flare')}</Text>
              {game.stat.meta.items[56]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[56]?.total || 0} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Ignition (Secret)')}</Text>
              {game.stat.meta.items[46]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[46]?.total || 0} decimals={0} />
              )}
            </Row>
            <br />
            <strong>Items</strong>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem">{t('Worldstone Shard (Claimed)')}</Text>
              {totalWorldstone && <CardValue fontSize="1rem" value={totalWorldstone} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Dragonlight (Airdrop)')}</Text>
              {totalDragonlight && <CardValue fontSize="1rem" value={totalDragonlight} decimals={0} />}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Luminous Flywings (Airdrop)')}</Text>
              {game.stat.meta.items[32]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[32]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Black Drake Scale (P2E Reward)')}</Text>
              {game.stat.meta.items[1207]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1207]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Black Drake Talon (P2E Reward)')}</Text>
              {game.stat.meta.items[1208]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1208]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Glow Fly Powder (P2E Reward)')}</Text>
              {game.stat.meta.items[1209]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1209]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t("Founder's Cube (Fundraiser)")}</Text>
              {game.stat.meta.items[1205]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1205]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Crafting Competition Certificate (Competition)')}</Text>
              {game.stat.meta.items[1201]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1201]?.total} decimals={0} />
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Rune Royale Ticket')}</Text>
              {game.stat.meta.items[1211]?.total && (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1211]?.total} decimals={0} />
              )}
            </Row>
            <br />
            <strong>Homage Items</strong>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem">{t('Stone of Jordan (Fundraiser)')}</Text>
              {game.stat.meta.items[2001]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2001].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Vampire Gaze (Fundraiser)')}</Text>
              {game.stat.meta.items[2002]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2002].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Harlequin Crest (Fundraiser)')}</Text>
              {game.stat.meta.items[2003]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2003].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('The Oculus (Fundraiser)')}</Text>
              {game.stat.meta.items[2004]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2004].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('War Traveler (Fundraiser)')}</Text>
              {game.stat.meta.items[2005]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2005].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Lightsabre (Fundraiser)')}</Text>
              {game.stat.meta.items[2047]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2047].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Crown of Ages (Fundraiser)')}</Text>
              {game.stat.meta.items[2052]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[2052].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <br />
            <strong>Trinkets</strong>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem">{t("Scholar's Codex (Airdrop)")}</Text>
              {game.stat.meta.items[1200]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1200].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t("General's Medallion (Airdrop)")}</Text>
              {game.stat.meta.items[1201]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[1201].total} decimals={0} />
              ) : (
                0
              )}
            </Row>

            <br />
            <strong>Pets</strong>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem">{t('Golden Lion Cub (Fundraiser)')}</Text>
              {game.stat.meta.items[3000]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3000].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Blue-Eyes White Drake (Fundraiser)')}</Text>
              {game.stat.meta.items[3001]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3001].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Red-Eyes Black Drake (Fundraiser)')}</Text>
              {game.stat.meta.items[3002]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3002].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Fairy Drake (Fundraiser)')}</Text>
              {game.stat.meta.items[3003]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3003].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Goblin Drake (Fundraiser)')}</Text>
              {game.stat.meta.items[3004]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3004].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Hippogryph (Fundraiser)')}</Text>
              {game.stat.meta.items[3005]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3005].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Wyvern (Fundraiser)')}</Text>
              {game.stat.meta.items[3006]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3006].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Forest Turtle (Fundraiser)')}</Text>
              {game.stat.meta.items[3007]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3007].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <Row>
              <Text fontSize="1rem">{t('Skeleton Drake (Fundraiser)')}</Text>
              {game.stat.meta.items[3008]?.total ? (
                <CardValue fontSize="1rem" value={game.stat.meta.items[3008].total} decimals={0} />
              ) : (
                0
              )}
            </Row>
            <br />
            <br />
            <Row>
              <Text fontSize="1rem" bold>
                {t('TOTAL')}
              </Text>
              {itemCount && <CardValue fontSize="1rem" bold value={itemCount} decimals={0} />}
            </Row>
          </CardBody>
        </Card3>
        {/* {evolutionHistorical?.playerCount ? (
          <Card3>
            <CardBody>
              <Heading size="xl" mb="24px">
                {t('Evolution Players')}
              </Heading>
              <ChartWrapper>
                <SimpleLineChart
                  yLabel="Total"
                  xLabel="Days"
                  data={evolutionHistorical?.playerCount?.map((point, i) => ({
                    name: `${i + 1}`,
                    AVG: point[1],
                  }))}
                />
              </ChartWrapper>
            </CardBody>
          </Card3>
        ) : null} */}
      </Cards>
      <br />
    </>
  );
};

export default Stats;
