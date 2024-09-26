import React, { useEffect, useRef, useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Flex, Card, Heading, CardBody, Link, BaseLayout, OpenNewIcon, LinkExternal, Text } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { ImCheckboxChecked } from 'react-icons/im';
import { ImCheckboxUnchecked } from 'react-icons/im';
import { CgTimelapse } from 'react-icons/cg';
import { BsPauseBtnFill } from 'react-icons/bs';
import { MdCancelPresentation } from 'react-icons/md';
import Linker from '~/components/Linker';
import Page from '~/components/layout/Page';
import { PurchaseModal } from '~/components/PurchaseModal';
import PageWindow from '~/components/PageWindow';
import i18n from '~/config/i18n';
import useCache from '~/hooks/useCache';
import SimpleLineChart from '~/components/SimpleLineChart';
import { safeRuneList } from '~/config';

const Image = styled.img`
  border-radius: 7px;
`;

const ImageBlock = ({ url }) => <Image src={url} />;

const CustomCard2 = styled(Card)`
  @media (min-width: 768px) {
    width: 55%;
  }
`;

const RiccardoContainer = styled.div`
  @media (min-width: 768px) {
    // min-width: 400px;
    width: 45%;
  }

  margin-left: 20px;

  // .subnav-list {
  //   position: relative;
  //   padding: 44px 0px 0px;
  //   border-right: 1px solid rgba(0, 0, 0, 0.7);
  //   border-left: 1px solid hsla(0, 0%, 100%, 0.05);
  // }

  // .subnav-list:hover {
  //   background-color: rgba(2, 2, 2, 0.22);
  // }

  // .subnav-list.first {
  //   border-left-color: hsla(0, 0%, 100%, 0.1);
  // }

  // .subnavlink {
  //   align-items: start;
  //   // font-weight: bold;
  // }

  // .subnavlink.selected {
  //   margin-top: -1px;
  //   margin-bottom: -1px;
  //   margin-left: 0px;
  //   border-top: 1px solid hsla(0, 0%, 100%, 0.09);
  //   border-bottom: 1px solid hsla(0, 0%, 100%, 0.09);
  //   border-left: 1px none hsla(0, 0%, 100%, 0.1);
  //   background-image: linear-gradient(90deg, rgba(240, 201, 128, 0.15), rgba(213, 177, 109, 0.03));
  //   box-shadow: -1px 0 0 0 hsla(0, 0%, 100%, 0.2), -2px 0 0 0 rgba(0, 0, 0, 0.1);
  // }

  // .grid-subnav-list {
  //   position: relative;
  //   z-index: 1;
  //   margin-top: 1px;
  //   grid-auto-flow: row;
  //   grid-auto-columns: -webkit-max-content;
  //   grid-auto-columns: max-content;
  //   grid-column-gap: 32px;
  //   grid-row-gap: 0px;
  //   -ms-grid-columns: 1fr;
  //   grid-template-columns: 1fr;
  //   -ms-grid-rows: auto;
  //   grid-template-rows: auto;
  // }

  // .grid-subnav-list.twocols {
  //   position: relative;
  //   z-index: 1;
  //   grid-column-gap: 24px;
  //   -ms-grid-columns: 1fr 1fr;
  //   grid-template-columns: 1fr 1fr;
  // }

  // .subnavcolshadow {
  //   position: absolute;
  //   left: 0%;
  //   top: 42px;
  //   right: 0%;
  //   bottom: 0%;
  //   // border-top: 1px solid hsla(0, 0%, 100%, 0.15);
  //   // background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.36)), to(transparent));
  //   background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.36), transparent);
  // }

  // .container {
  //   position: relative;
  //   z-index: 10;
  //   margin-top: 0px;
  //   padding-right: 0px;
  //   padding-left: 0px;
  //   -o-object-fit: none;
  //   object-fit: none;
  // }

  // .container.navcontainer {
  //   display: -webkit-box;
  //   display: -webkit-flex;
  //   display: -ms-flexbox;
  //   display: flex;
  //   -webkit-box-pack: start;
  //   -webkit-justify-content: flex-start;
  //   -ms-flex-pack: start;
  //   justify-content: flex-start;
  //   -webkit-box-align: center;
  //   -webkit-align-items: center;
  //   -ms-flex-align: center;
  //   align-items: center;
  // }
  // .sitenav-main {
  //   position: relative;
  //   z-index: 11;
  //   border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
  //   background-image: url('/images/bg-brighter.jpg');
  //   background-position: 0px 0px;
  //   background-size: 400px;
  //   box-shadow: 0 0 32px 0 rgba(0, 0, 0, 0.39);
  //   color: #fff;
  // }

  // .sitenav-sub {
  //   position: relative;
  //   grid-auto-columns: 1fr;
  //   -ms-grid-columns: 1fr 1fr;
  //   grid-template-columns: 1fr 1fr;
  //   -ms-grid-rows: auto auto;
  //   grid-template-rows: auto auto;
  //   border-bottom: 1px solid hsla(0, 0%, 100%, 0.18);
  //   background-image: -webkit-gradient(
  //       linear,
  //       left top,
  //       left bottom,
  //       from(rgba(0, 0, 0, 0.4)),
  //       color-stop(13%, transparent)
  //     ),
  //     url('/images/619b09aec0d05b6e97f00ebf_bg-normal.jpg');
  //   background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.4), transparent 13%),
  //     url('/images/619b09aec0d05b6e97f00ebf_bg-normal.jpg');
  //   background-position: 0px 0px, 0px 0px;
  //   background-size: auto, 400px;
  //   box-shadow: 0 0 64px 5px #000;
  // }

  // .sitenav {
  // }

  // .subnavlink {
  //   padding: 3px 16px;
  // }
`;
const Tag = styled.span`
  background: #113657;
  border-radius: 3px;
  padding: 3px 4px 2px;
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
  margin-left: 4px;
`;
const OutflowTag = styled(Tag)`
  background: #571141;
`;
const Outflow = () => <OutflowTag>Outflow</OutflowTag>;
const InflowTag = styled(Tag)`
  background: #1c5711;
`;
const Inflow = () => <InflowTag>Inflow</InflowTag>;
const BurnTag = styled(Tag)`
  background: #113657;
`;
const Burn = () => <BurnTag>Burn</BurnTag>;

const ProgressIcon = ({ status }) => (
  <div
    css={css`
      vertical-align: top;
      padding: 3px;
    `}>
    {status === 'done' ? (
      <ImCheckboxChecked width="18px" style={{ marginRight: 10 }} />
    ) : status === 'pending' ? (
      <ImCheckboxUnchecked width="18px" style={{ marginRight: 10 }} />
    ) : status === 'working' ? (
      <CgTimelapse width="18px" style={{ marginRight: 10 }} />
    ) : status === 'postponed' ? (
      <BsPauseBtnFill width="18px" style={{ marginRight: 10 }} />
    ) : status === 'canceled' ? (
      <MdCancelPresentation width="18px" style={{ marginRight: 10 }} />
    ) : null}
  </div>
);
const CardCustom = styled(Card)`
  border-width: 8px;
`;
const isLocal = process.env.REACT_APP_RUNE_ENV === 'local';

const Rules = () => {
  const { t } = useTranslation();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(0);
  const [oracle, setOracle] = useState(null);

  useEffect(function () {
    if (!window) return;

    const coeff = 1000 * 60 * 5;
    const date = new Date(); //or use any other date
    const rand = new Date(Math.round(date.getTime() / coeff) * coeff).getTime();

    async function init() {
      const data = (await (
        await fetch((isLocal ? 'http://localhost:6001' : 'https://s1.envoy.arken.asi.sh') + '/oracle.json?' + rand)
      ).json()) as any;

      setOracle(data);
    }

    init();
  }, []);

  if (!oracle) return <></>;

  const roadmap = {
    phases: [],
  };

  const inflows = ['crafting', 'fundraisers', 'investments', 'characterFees', 'marketFees'];
  const outflows = ['salaries', 'evolutionRewards', 'infiniteRewards', 'affiliates', 'giveaways'];
  const burns = ['raidMechanics'];

  const TypeKeyToName = {
    crafting: 'Crafting',
    fundraisers: 'Fundraisers',
    investments: 'Investments',
    evolutionRewards: 'Evolution Rewards',
    infiniteRewards: 'Infinite Rewards',
    salaries: 'Salaries',
    characterFees: 'Character Fees',
    marketFees: 'Market Fees',
    affiliates: 'Affiliates',
    giveaways: 'Giveaways',
    raidMechanics: 'Raid Mechanics',
    daoVoting: 'DAO Voting',
  };

  const PeriodKeyToName = {
    week: 'Last 7 Days',
    month: 'Last 30 Days',
    year: 'Last 365 Days',
  };

  const types = { ...oracle.inflow, ...oracle.outflow };
  for (const typeKey in types) {
    const phase = {
      content: (
        <>
          <strong>{TypeKeyToName[typeKey]}</strong>{' '}
          {burns.includes(typeKey) ? <Burn /> : inflows.includes(typeKey) ? <Inflow /> : <Outflow />}
        </>
      ),
      status: 'pending',
      goals: [],
    };

    for (const periodKey in types[typeKey].tokens) {
      const tokens = [];

      let sortedTokens = [];
      for (const tokenKey in types[typeKey].tokens[periodKey]) {
        const value = types[typeKey].tokens[periodKey][tokenKey];

        sortedTokens.push({
          key: tokenKey.toUpperCase(),
          value,
        });
      }

      sortedTokens = sortedTokens.sort(function (a, b) {
        return b.value > a.value ? 1 : -1;
      });

      for (const token of sortedTokens) {
        const value = (token.value || 0).toFixed(0);

        if (value === '0') continue;

        tokens.push(
          <>
            <strong>{token.key}:</strong> {value}
          </>
        );
      }

      phase.goals.push({
        content: (
          <>
            <strong>{PeriodKeyToName[periodKey]}</strong>
          </>
        ),
        status: 'pending',
        notes: tokens,
      });
    }

    roadmap.phases.push(phase);
  }

  const totalInflow = {
    runes: 0,
    rxs: 0,
    usd: 0,
  };

  const totalOutflow = {
    runes: 0,
    rxs: 0,
    usd: 0,
  };

  for (const typeKey in oracle.inflow) {
    for (const periodKey in types[typeKey].tokens) {
      for (const tokenKey in types[typeKey].tokens[periodKey]) {
        const value = types[typeKey].tokens[periodKey][tokenKey];

        if (tokenKey === 'usd') {
          totalInflow.usd += value;
        } else if (tokenKey === 'rxs') {
          totalInflow.rxs += value;
        } else if (tokenKey === 'rune') {
          totalInflow.rxs += value * 10000;
        } else {
          totalInflow.runes += value;
        }
      }
    }
  }

  for (const typeKey in oracle.outflow) {
    for (const periodKey in types[typeKey].tokens) {
      for (const tokenKey in types[typeKey].tokens[periodKey]) {
        const value = types[typeKey].tokens[periodKey][tokenKey];

        if (tokenKey === 'usd') {
          totalOutflow.usd += value;
        } else if (tokenKey === 'rxs') {
          totalOutflow.rxs += value;
        } else if (tokenKey === 'rune') {
          totalOutflow.rxs += value * 10000;
        } else {
          totalOutflow.runes += value;
        }
      }
    }
  }

  return (
    <>
      <Flex alignItems={['start', null, 'start']} flexDirection={['column', null, 'row']}>
        <CustomCard2>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('Tokenomics')}
          </Heading>
          <hr />
          <CardBody>
            <p>
              Arken Realm Shards (<strong>$RXS</strong>) are the protocol and governance tokens for the Arken ecosystem.
              <br />
              <br />
              <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
                {t('Use Cases')}
              </Heading>
              <hr />
              {/* <br />
              <p>
                Players will be able to acquire <strong>$RXS</strong> when they play various games within the Rune
                Metaverse and through community-generated content initiatives. Alternative, players can swap for them.
              </p> */}
              <br />
              <ul>
                <li>
                  <strong>$RXS</strong> has a transfer fee that goes to Rune Vault, to be used to promote the use of the
                  Arken ecosystem.
                </li>
                <li>
                  <strong>$RXS</strong> is required as the character fee (required to earn rewards in Arken games).
                </li>
                <li>
                  <strong>$RXS</strong> is one of the primary pools &amp; liquidity farms in the Arken: Runic Raids
                  game.
                </li>
                <li>
                  <strong>$RXS</strong> is integrated into the protocol as a fee token for Marketplace trades,
                  lending/borrowing, item upgrading/disenchanting and more.
                </li>
                <li>
                  <strong>$RXS</strong> will be used as an optional boost to charge boss battles, lended items, etc. as
                  an alternative to unlocking those through gameplay.
                </li>
                <li>
                  <strong>$RXS</strong> holders will be able to claim rewards generated in the ecosystem if they stake
                  or participate in governance votes.
                </li>
              </ul>
            </p>
            <br />

            <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
              Currencies/NFTs
            </Heading>
            <hr />
            <br />
            <h4> Arken Realm Shards </h4>
            <ul>
              <strong>Utility</strong>
              <ul>
                <li> Primary in-game and marketplace currency </li>
                <li> Fuel for in-game mechanics </li>
                <li> Used to purchase license </li>
                <li> Primary liquidity pool/farm </li>
                <li> DAO Governance </li>
                <li> (Planned) Rewards active holders </li>
              </ul>
              <strong>How to Acquire</strong>
              <ul>
                <li> In-game Rewards </li>
                <li>
                  <a href="https://arken.gg/swap">Runeswap</a> or{' '}
                  <a href="https://pancakeswap.finance/swap?inputCurrency=0x2098fef7eeae592038f4f3c4b008515fed0d5886">
                    Pancakeswap
                  </a>
                </li>
              </ul>
            </ul>
            <h4> Runes </h4>
            <ul>
              <strong>Utility</strong>
              <ul>
                <li> Required to create NFTs with crafting recipes </li>
                <li> Conditionally required to harvest in Raid </li>
                <li> (Planned) Unlock specific purposes in each game, such as more characters or inventory spaces </li>
                <li> (Planned) Required for specific mechanics such as item upgrading </li>
              </ul>
              <strong>How to Acquire</strong>
              <ul>
                <li> In-game Rewards </li>
                <li>
                  <a href="https://arken.gg/swap">Runeswap</a> or{' '}
                  <a href="https://pancakeswap.finance/swap">Pancakeswap</a>
                </li>
              </ul>
            </ul>
            <h4> Runeforms </h4>
            <ul>
              <strong>Utility</strong>
              <ul>
                <li> Modify gameplay attributes </li>
                <li> (Planned) Unlock in-game skills </li>
                <li> Increase in-game rewards </li>
              </ul>
              <strong> How to Acquire </strong>
              <ul>
                <li> In-game Rewards </li>
                <li>
                  <a href="https://arken.gg/transmute">Transmutation</a>
                </li>
              </ul>
            </ul>
          </CardBody>
        </CustomCard2>

        <RiccardoContainer>
          <CardCustom>
            <CardBody>
              <Heading as="h2" size="lg">
                {t('Total Inflow')}
              </Heading>
              <hr />
              <h2>{totalInflow.runes.toFixed(0)} RUNES</h2>
              <h2>{totalInflow.rxs.toFixed(0)} RXS</h2>
              <h2>{totalInflow.usd.toFixed(0)} USD</h2>
              <br />
              <br />
              <Heading as="h2" size="lg">
                {t('Total Outflow')}
              </Heading>
              <hr />
              <h2>{totalOutflow.runes.toFixed(0)} RUNES</h2>
              <h2>{totalOutflow.rxs.toFixed(0)} RXS</h2>
              <h2>{totalOutflow.usd.toFixed(0)} USD</h2>
              <br />
              <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>Tracking started August 10, 2022</div>
            </CardBody>
          </CardCustom>
          <br />
          <br />
          <CardCustom className="lore-container">
            <div className="sitenav-sub" style={{ width: '100%' }}>
              <div className="container w-container">
                <div className="w-layout-grid grid-3">
                  <div className="subnav-list first">
                    <div className="text-block-3">Avenue</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases.map((phase, index) => (
                        <div
                          className={`subnavlink w-inline-block ${index === selectedPhase ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedPhase(index);
                            setSelectedGoal(0);
                          }}>
                          {/* <ProgressIcon status={phase.status} /> */}
                          <div style={{ minWidth: 200 }}>{phase.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                  <div className="subnav-list">
                    <div className="text-block-3">Period</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases[selectedPhase].goals.map((goal, index) => (
                        <div
                          className={`subnavlink w-inline-block ${index === selectedGoal ? 'selected' : ''}`}
                          onClick={() => setSelectedGoal(index)}>
                          <div>{goal.content}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                  <div className="subnav-list">
                    <div className="text-block-3">Token</div>
                    <div className="w-layout-grid grid-subnav-list">
                      {roadmap.phases[selectedPhase].goals[selectedGoal].notes.map((note, index) => (
                        <div className="subnavlink w-inline-block">
                          <div>{note}</div>
                        </div>
                      ))}
                    </div>
                    <div className="subnavcolshadow"></div>
                  </div>
                </div>
              </div>
              <div className="div-block-23"></div>
            </div>
          </CardCustom>
        </RiccardoContainer>
      </Flex>
      <br />
      <br />
      <Card>
        <CardBody>
          <div
            css={css`
              position: relative;
              max-width: 900px;
              height: 700px;
              margin: 0 auto;
            `}>
            <div
              css={css`
                overflow: hidden;
                position: absolute;
                top: 23%;
                left: 20%;
                width: 60%;
                height: 60%;
                background: transparent url(/images/blackhole-7.png) no-repeat scroll 50% 50%;
                background-size: contain;
                filter: contrast(1.5);
                animation-name: spin;
                animation-duration: 80000ms;
                animation-iteration-count: infinite;
                animation-timing-function: linear;
              `}></div>
            <div
              css={css`
                overflow: hidden;
                position: absolute;
                top: 0%;
                left: 0;
                bottom: 0;
                right: 0;
                background: transparent url(/images/charts/vault.png) no-repeat 50% 50%;
                background-size: contain;
              `}></div>
          </div>
          <div
            css={css`
              position: relative;
              max-width: 900px;
              height: 500px;
              margin: 0 auto;
            `}>
            <div
              css={css`
                overflow: hidden;
                position: absolute;
                top: 0%;
                left: 0;
                bottom: 0;
                right: 0;
                background: transparent url(/images/charts/player.png) no-repeat 50% 50%;
                background-size: contain;
              `}></div>
          </div>
        </CardBody>
      </Card>
      <br />
      <br />
      <Flex alignItems={['start', null, 'start']} flexDirection={['column', null, 'row']}>
        <CustomCard2>
          <CardBody>
            <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
              {t('Distribution')}
            </Heading>
            <hr />
            <br />
            <p>
              <Linker id="tokenomics-1">
                Distribution of the original BEP-20 tokens were to liquidity providers on Binance Smart Chain. It was a
                100% fair launch with an announced time and no pre-mine or allocations. A maximum supply of 22,530 $RUNE
                tokens were minted, and 3,230 tokens were burned, leaving a total circulating supply of 19,300 tokens.
                Those were then split 1:10,000 into $RXS tokens in The Shardening which happened on November, 2021. When
                you shard 1 $RUNE token on Binance Smart Chain you will receive 10,000 $RXS tokens, to be used as in
                game currency and rewards in games throughout the Arken Realms.
              </Linker>
            </p>
            <br />
            {/* <p>
            Our goal is to align the incentives between players and developers in novel and exciting ways. The
            mechanisms described above have two primary goals:
          </p>
          <ul>
            <li>
              To reward players for interacting with the Arken ecosystem while simultaneously incentivizing them to hold
              on to their tokens so they can claim additional rewards.
            </li>
            <li>To decentralize the ownership and governance of the Arken ecosystem.</li>
          </ul>
          <br />
          <br /> */}
            {/* <p>
            The <strong>$RUNE</strong> token was initially launched on Binance Smart Chain (BSC) as an experiment to
            bootstrap the ecosystem and create a community dedicated to changing the fundamental nature of gaming for
            the better. To facilitate the use of Rune as a rewards and payments token and connect the games within the
            Arken Realms the <strong>$RUNE</strong> token has been split into Arken Realm Shards ( <strong>$RXS</strong>) at
            a 1:10000 ratio, where 1 <strong>$RUNE</strong> = 10,000 <strong>$RXS</strong>.{' '}
            <RouterLink to="/shards">The Shardening</RouterLink> happened on November, 2021. When you shard 1{' '}
            <strong>$RUNE</strong> token on Binance Smart Chain you will receive 10,000 <strong>$RXS</strong> tokens, to
            be used as in game currency and rewards in games throughout the Arken Realms.{' '}
          </p>
          <br />
          <br />
          <p>
            There is a 1% transfer fee for the $RXS token and runes. The vault fee is used to fund marketing,
            development, and community building events. The bot fee only applies if we've identified a vampire bot or
            exploitative wallet and need to recover tokens.
          </p> */}
            <p>
              <strong>Current Fees:</strong>
              <br />
              Vault - 0.25%
              <br />
              Charity - 0.1%
              <br />
              Dev - 0.1%
            </p>
            <br />
            <p>
              <strong>Fee Limits:</strong>
              <br />
              Vault - 10%
              <br />
              Charity - 0.5%
              <br />
              Dev - 0.5%
              <br />
            </p>
            <br />
          </CardBody>
        </CustomCard2>
        <CustomCard2 style={{ marginLeft: 20 }}>
          <CardBody>
            <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
              {t('$EL-$ZOD')}
            </Heading>
            <hr />
            <br />
            <p>
              <Linker id="tokenomics-2">
                Within the Arken ecosystem are also the 33 runes from EL as #1 to ZOD as #33. There will never be more
                runes minted. Each of these has a 1% transfer fee going to the Rune Vault. Most of them are minted as
                rewards for liquidity staking in the Arken: Runic Raids farms. Some are special and have been minted for
                specific purposes, for example:
                <br />
                <br />
                ELD - Airdropped on the first ~1000 characters created.
                <br />
                LEM - Given for disenchanting items, and required to upgrade items.
                <br />
                ZOD - Given as reward for winning game matches. Burned as a tournament entry fee.
                <br />
                VEX - Given as a reward for referring a friend.
              </Linker>
            </p>
            <br />
            <br />
            <p>
              <strong>Utility:</strong>
              <ul>
                <li>Required to create NFTs with crafting recipes.</li>
                <li>
                  Required in Arken: Runic Raids based on equiped items during harvesting and other mechanics (such as
                  burn).
                </li>
                <li>Unlock specific purposes in each game, such as more characters or inventory spaces.</li>
                <li>Required for specific mechanics such as item upgrading.</li>
                <li>Required for tournaments and events, then burned.</li>
              </ul>
              <br />
              To see the utility for each rune, visit the runes page for details.
            </p>
            {/* <br />
          <br />
          <Heading as="h2" size="lg" style={{ marginTop: 15 }}>
            {t('Vault Income')}
          </Heading>
          <br /><br />
           */}
            <br />
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Button
                as={RouterLink}
                to="/runes"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}>
                View Runes
              </Button>
            </Flex>
          </CardBody>
        </CustomCard2>
      </Flex>
    </>
  );
};

export default Rules;
