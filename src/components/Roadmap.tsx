import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPauseBtnFill } from 'react-icons/bs';
import { CgTimelapse } from 'react-icons/cg';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';
import { MdCancelPresentation } from 'react-icons/md';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { AutoColumn } from '~/components/Column';
import { AutoRow, RowBetween } from '~/components/Row';
import { Button, Card, CardBody, Heading, Text } from '~/ui';

const Shortcut = styled.div`
  text-align: center;
  height: 90px;
  width: 134px;
  // padding: 0 20px 20px;
  cursor: pointer;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.2rem;

  p {
    margin-top: 5px;
    font-family: 'webfontexl', sans-serif !important;
    color: #fff;
  }

  img {
    width: auto;
    height: 50px;
    image-rendering: pixelated;
  }

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;
    filter: drop-shadow(0 0 5px rgba(255 255 255/70%)); // drop-shadow(0 0 8px rgba(187 149 94/100%));
    zoom: 1.5;
  }

  zoom: 1.5;

  transition: zoom 0.2 ease-in-out;

  ${({ theme }) => theme.mediaQueries.sm} {
    zoom: 1;
  }
`;

const Container = styled.div`
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
`;

const CardCustom = styled(Card)`
  border-width: 8px;
  margin-top: 30px;
`;

const Tag = styled.span`
  background: #113657;
  border-radius: 3px;
  padding: 3px 4px 2px;
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
`;
const UXTag = styled(Tag)`
  background: #573e11;
`;
const UX = () => <UXTag>UX</UXTag>;

const CoreTag = styled(Tag)`
  background: #113657;
`;
const Core = () => <CoreTag>Core</CoreTag>;

const MarketingTag = styled(Tag)`
  background: #1c5711;
`;
const Marketing = () => <MarketingTag>Marketing</MarketingTag>;

const IdeaTag = styled(Tag)`
  background: #573e11;
`;
const Idea = () => <IdeaTag>Idea</IdeaTag>;

const BonusTag = styled(Tag)`
  background: #573e11;
`;
const Bonus = () => <BonusTag>Bonus</BonusTag>;

// const MechanicsTag = styled(Tag)`
//   background: #571111;
// `
// const Mechanics = () => <MechanicsTag>Mechanics</MechanicsTag>

// const FeesTag = styled(Tag)`
//   background: #571141;
// `
// const Fees = () => <FeesTag>Fees</FeesTag>
// ffffff1a

const BugTag = styled(Tag)`
  background: #571141;
`;
const Bug = () => <BugTag>Bug</BugTag>;

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
const Roadmap = () => {
  const { t } = useTranslation();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedGoal, setSelectedGoal] = useState(0);

  const cacheKey = `RoadmapAgreement`;

  const [understandChecked, setUnderstandChecked] = useState(() => {
    if (!window.localStorage) return false;

    return window.localStorage.getItem(cacheKey) === 'yes';
  });
  const [isAgreed, _setIsAgreed] = useState(() => {
    if (!window.localStorage) return false;

    return window.localStorage.getItem(cacheKey) === 'yes';
  });

  const setIsAgreed = (val) => {
    _setIsAgreed(val);
    window.localStorage.setItem(cacheKey, val ? 'yes' : 'no');
  };

  const roadmap = {
    phases: [
      {
        content: (
          <>
            <strong>Q4 2020</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Rune conceptualized</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q1 2021</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Rune website launched</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.1</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Launch native token</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Rune token, farm, and pools</>,
              <>
                Link to <RouterLink to="/farms">Farms</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/pools">Pools</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>NFT smart contracts</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Rune character (NFT) creation</>,
              <>
                Link to <RouterLink to="/characters">Characters</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q2 2021</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Launch more runes</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>New: EL ELD TIR NEF ITH TAL RAL ORT THUL AMN SOL SHAEL DOL HEL</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Release Rune Swap</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                {' '}
                for trading <strong>$RUNE</strong> and runes Character inventory system
              </>,
              <>
                Link to <RouterLink to="/swap">Rune Swap</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Character inventory system</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Manage all Arken NFTs in one easy-to-use inventory</>,
              <>
                Link to <RouterLink to="/swap">Rune Swap</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Release Runewords (NFTs)</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Craft weapons and armor for your character</>,
              <>
                Link to <RouterLink to="/catalog">Runewords</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Guild System</strong> setup <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/guilds">Guilds</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Discord integration</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Guild verification, evolution stats, etc.</>,
              <>
                Link to <a href="https://discord.gg/rune">Discord</a>
              </>,
            ],
          },
          {
            content: (
              <>
                Leaderboard + achievements + points <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/leaderboard">Leaderboard</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.2</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.3</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                Marketplace 1.0 <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Decentralized NFT exchange</>,
              <>
                Link to <RouterLink to="/market">Market</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Marketing Fundraiser (pets) <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/market">Market</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Fluid Farming</strong>
              </>
            ),
            status: 'done',
            notes: [
              <>Stake once, yield multiple rewards</>,
              <>
                Link to <RouterLink to="/farms">Farms</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q3 2021</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Launch more runes</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>New: IO LUM KO FAL LO ZOD</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles launch</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Casual play to earn game</>,
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.4</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Affiliate System:</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Unique distribution for VEX (affiliate referrals)</>,
              <>
                Link to <RouterLink to="/refer">Referral System</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Rune Lore Development</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [<>Story, world development, and concept art started</>],
          },
          {
            content: (
              <>
                <strong>Rune Translations:</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [<>Basic site localization</>],
          },
          {
            content: (
              <>
                Upgrade NFT smart contracts <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                Secondary Marketplaces
                <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Arken NFTs on third-parties</>,
              <>
                Link to{' '}
                <a href="https://www.binance.com/en/nft/profile/rune-7a727bcfb6d429fda32f2af9bb513f64">Binance NFT</a>
              </>,
              <>
                Link to{' '}
                <a href="https://app.mochi.market/collection/56/0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40?ViewAll=true">
                  Mochi.Market
                </a>
              </>,
              <>
                Link to{' '}
                <a href="https://treasureland.market/assets?contract=0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40&chain_id=56">
                  Treasureland
                </a>
              </>,
              <>
                Link to{' '}
                <a href="https://app.alturanft.com/user/0xa987f487639920a3c2efe58c8fbdedb96253ed9b?view=collections">
                  Altura
                </a>
              </>,
              <>
                Link to <a href="https://app.babylons.io/rune">Babylons</a>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles</strong> desktop app <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Development of Arken: Infinite Arena begins <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q4 2021</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Launch more runes</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>New: LEM VEX PUL UM MAL</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken Realm Shards launched</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Audit and launch</>,
              <>
                Link to <a href="https://bscscan.com/token/0x2098fef7eeae592038f4f3c4b008515fed0d5886">RXS Contract</a>
              </>,
              <>
                Link to <a href="https://www.certik.com/projects/rune">CertiK Audit</a>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles v1.6:</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Launcher + better sign in</>,
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/updates">Patch Notes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles v1.7:</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Graphic + UI overhaul</>,
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/updates">Patch Notes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Arken: Infinite Arena previews <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Exclusive Partnerships <Bonus />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles Mobile</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Launched on mobile (Android)</>,
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.5</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Branding</strong> improvements <Bonus />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Rune Lore</strong> previews <Bonus />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Arken: Infinite Arena Private Beta</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q1 2022</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Arken: Heart of the Oasis</strong> development started <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>Reward system overhaul</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>Instant payouts</>,
              <>
                Link to <RouterLink to="/account/rewards">Rewards Centre</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Rune Nexus release</strong> <UX />
              </>
            ),
            status: 'done',
            notes: [
              <>Lore concept explainers and replaces wiki + docs</>,
              <>
                Link to <RouterLink to="/lore">Nexus</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Tournament + Weekly Stream <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Started the monthly Rune Royale tournament, live streamed on Twitch.</>,
              <>Started the weekly stream on Twitch, where players can play with and chat with the Rune team.</>,
              <>
                Link to <a href="https://www.twitch.tv/arkenrealms">Rune on Twitch</a>
              </>,
            ],
          },
          {
            content: (
              <>
                Evolution Marketing <Marketing />
              </>
            ),
            status: 'done',
            notes: [<>Evolution trailer, preview videos, banners, etc.</>],
          },
          {
            content: (
              <>
                Game Backend Architecture <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.6</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [],
          },
          {
            content: (
              <>
                Game item graphical updates <UX />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <a href="https://t.me/ArkenRealms/533">Announcement</a>
              </>,
            ],
          },
          {
            content: (
              <>
                Upgrade market
                <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>$RXS as native token</>,
              <>
                Link to <RouterLink to="/market">Market</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q2 2022</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Launch more runes</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>New: IST GUL</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>
                  arken.gg v1.7 <Core />
                </strong>
              </>
            ),
            status: 'done',
            notes: [<>Overhaul messaging + design</>, <>Performance improvements</>],
          },
          {
            content: (
              <>
                <strong>Arken: Infinite Arena Earliest Access</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Governance voting <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <a href="https://vote.arken.gg/">Rune Governance</a>
              </>,
            ],
          },
          {
            content: (
              <>
                General Marketing <Marketing />
              </>
            ),
            status: 'done',
            notes: [
              <>Art contests, partnerships, etc</>,
              <>Arken: Heart of the Oasis music videos</>,
              <>
                Link to{' '}
                <a href="https://www.youtube.com/watch?v=e0w60rW6xqM&list=PLtQV3vQDJxarq_X0WsAT4goj9mf-3wmGg&ab_channel=ArkenRealms">
                  Rune on YouTube
                </a>
              </>,
              <>
                Link to <a href="https://tofunft.com/collection/rune-arcane-items/items">TofuNFT</a>
              </>,
              <>
                Link to <a href="https://app.teaparty.life/p/arkenrealms">TeaParty</a>
              </>,
              <>
                Link to <a href="https://www.ikonic.gg">Ikonic</a>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Infinite Arena</strong> v0.6 <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/updates">Patch Notes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles</strong> v1.8 <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/updates">Patch Notes</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Q3 2022</strong>
          </>
        ),
        status: 'done',
        goals: [
          {
            content: (
              <>
                <strong>Homage Fundraiser</strong> started <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Link to <a href="https://t.me/ArkenRealms/598">Announcement</a>
              </>,
              <>
                Link to <RouterLink to="/market">Market</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles Season 1</strong> <Bonus />
              </>
            ),
            status: 'done',
            notes: [
              <>Live leaderboard competition to be the top player</>,
              <>
                Link to <RouterLink to="/evolution">Evolution</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/leaderboard">Leaderboard</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>arken.gg v1.7.1</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [<>Major UI improvements</>],
          },
          {
            content: (
              <>
                <strong>DAO Phase 1</strong> <Core />
              </>
            ),
            status: 'done',
            notes: [
              <>
                Launched first phase of DAO:{' '}
                <a
                  href="https://arkenrealms.medium.com/rune-metaverse-dao-1a90f6e1cd18"
                  target="_blank"
                  rel="noreferrer noopener">
                  https://arkenrealms.medium.com/rune-metaverse-dao-1a90f6e1cd18
                </a>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Near Future</strong>
          </>
        ),
        status: 'pending',
        goals: [
          {
            content: (
              <>
                arken.gg v2.0 <UX />
              </>
            ),
            status: 'working',
            notes: [
              <p>Overhaul architecture</p>,
              <p>Greatly improve UX</p>,
              <p>Support free2play</p>,
              <p>Support non-crypto players</p>,
              <p>Multi-chain wallet connect</p>,
            ],
          },
          {
            content: (
              <>
                Runeword disenchanting <Core />
              </>
            ),
            status: 'working',
            notes: [
              <>Runewords will be disenchantable for LEM runes using the Transmute Cube</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Runeword upgrading <Core />
              </>
            ),
            status: 'working',
            notes: [
              <>Runewords will be upgradeable using LEM runes + worldstone shards using the Transmute Cube</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Rune Launcher</strong> <Bonus />
              </>
            ),
            status: 'working',
            notes: [<>All games in one easy-to-use app</>],
          },
          {
            content: (
              <>
                <strong>Arken: Infinite Arena</strong> <Core />
              </>
            ),
            status: 'pending',
            notes: [<>Free-to-play early access</>],
          },
          {
            content: (
              <>
                Infinite Marketing <Marketing />
              </>
            ),
            status: 'pending',
            notes: [
              <>Infinite trailer, social campaigns, competitions</>,
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Mid Future</strong>
          </>
        ),
        status: 'pending',
        goals: [
          {
            content: (
              <>
                Polygon bridge <Bonus />
              </>
            ),
            status: 'postponed',
            notes: [
              <>
                Paused: Bridge has been built, but due to time constraints, market timing, and there have been various
                high-profile bridges exploited.
              </>,
            ],
          },
          {
            content: (
              <>
                Ethereum bridge <Bonus />
              </>
            ),
            status: 'postponed',
            notes: [
              <>
                Paused: Bridge has been built, but due to time constraints, market timing, and there have been various
                high-profile bridges exploited.
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Launch final runes</strong> <Core />
              </>
            ),
            status: 'working',
            notes: [
              <>New: SUR BER JAH CHAM ETH</>,
              <>
                Link to <RouterLink to="/runes">Runes</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Runic Raids 2.0:</strong>
                <Core />
              </>
            ),
            status: 'working',
            notes: [
              <>Deeper gameplay + item mechanics</>,
              <>
                Link to <RouterLink to="/raid">Arken: Runic Raids</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Arken: Evolution Isles 2.0:</strong>
                <Core />
              </>
            ),
            status: 'working',
            notes: [
              <>Guardian integration + Gear-enabled servers</>,
              <>
                Link to <RouterLink to="/evolution">Arken: Evolution Isles</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Nintendo Switch</strong> releases
                <Core />
              </>
            ),
            status: 'pending',
            notes: [
              <>Release of Evolution + Infinite</>,
              <>
                Link to <RouterLink to="/evolution">Arken: Evolution Isles</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Steam</strong> releases
                <Core />
              </>
            ),
            status: 'pending',
            notes: [
              <>Release of Evolution + Infinite</>,
              <>
                Link to <RouterLink to="/evolution">Arken: Evolution Isles</RouterLink>
              </>,
              <>
                Link to <RouterLink to="/infinite">Infinite</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Market 2.0:</strong> <Bonus />
              </>
            ),
            status: 'pending',
            notes: [
              <>Advanced filters + navigation</>,
              <>
                Link to <RouterLink to="/evolution">Arken: Evolution Isles</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                <strong>Guild NFTs</strong> <Bonus />
              </>
            ),
            status: 'pending',
            notes: [<>Player-owned guilds with benefits</>],
          },
        ],
      },
      {
        content: (
          <>
            <strong>Far Future</strong>
          </>
        ),
        status: 'pending',
        goals: [
          {
            content: (
              <>
                <strong>Early Adopter Airdrops</strong> <Idea />
              </>
            ),
            status: 'pending',
            notes: [
              <>Airdrops targeted at the different levels of early adopters, especially the ones who stuck around</>,
            ],
          },
          {
            content: (
              <>
                <strong>Rune Lending</strong>
                <Idea />
              </>
            ),
            status: 'pending',
            notes: [<>Lend your NFTs </>],
          },
          {
            content: (
              <>
                <strong>Growth Hacking</strong> <Marketing />
              </>
            ),
            status: 'pending',
            notes: [<>Polish and grow revenue for Arken games</>],
          },
          {
            content: (
              <>
                Rune Ultimate Tournament <Idea />
              </>
            ),
            status: 'pending',
            notes: [],
          },
          {
            content: (
              <>
                Launch <strong>Arken: Heart of the Oasis</strong> <Core />
              </>
            ),
            status: 'pending',
            notes: [
              <>
                Link to <RouterLink to="/sanctuary">Arken: Heart of the Oasis</RouterLink>
              </>,
            ],
          },
          {
            content: (
              <>
                Launch <strong>Arken Realms</strong> <Core />
              </>
            ),
            status: 'pending',
            notes: [],
          },
          // {
          //   content: <><strong>Ready Rune One</strong> on the blockchain</>,
          //   status: 'pending',
          //   notes: [
          //   ]
          // },
        ],
      },
    ],
  };

  return (
    <>
      <Container>
        <Card>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            Roadmap
          </Heading>
          <hr />
          <CardBody>
            {/* {!confirmedUnderstood ? ( */}
            <AutoColumn gap="lg">
              <AutoRow gap="6px">
                <p style={{ color: '#bb955e' }}>
                  I understand that the roadmap is <strong>TENTATIVE</strong>, and that means the objectives and
                  timelines could be changed anytime by the <RouterLink to="/team">Rune team</RouterLink> as they feel
                  needed (we will do our best to communicate changes). I also understand that in the future the
                  objectives and timelines could be changed entirely, as they would be determined by the token holders
                  through direct or delegated voting in a DAO (Decentralized Autonomous Organization).
                </p>
              </AutoRow>
              <RowBetween>
                <div
                  css={css`
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    padding: 13px 15px;
                  `}>
                  <label htmlFor="understand-checkbox" style={{ cursor: 'pointer', userSelect: 'none' }}>
                    <input
                      id="understand-checkbox"
                      type="checkbox"
                      className="understand-checkbox"
                      checked={understandChecked}
                      onChange={() => {
                        setUnderstandChecked(!understandChecked);

                        if (understandChecked) {
                          setIsAgreed(false);
                        }
                      }}
                      style={{ marginRight: 4 }}
                    />{' '}
                    <Text as="span">I understand</Text>
                  </label>
                </div>
                <Button
                  disabled={!understandChecked || isAgreed}
                  style={{ width: '140px' }}
                  onClick={() => {
                    setIsAgreed(true);
                  }}>
                  Continue
                </Button>
              </RowBetween>
            </AutoColumn>
            {/* // ) : null} */}
          </CardBody>
        </Card>

        {isAgreed ? (
          <>
            <CardCustom className="lore-container">
              <div className="sitenav-sub" style={{ width: '100%' }}>
                <div>
                  <div className="w-layout-grid grid-3">
                    <div className="subnav-list first">
                      <div className="text-block-3">Phase</div>
                      <div className="w-layout-grid grid-subnav-list">
                        {roadmap.phases.map((phase, index) => (
                          <div
                            className={`subnavlink w-inline-block ${index === selectedPhase ? 'selected' : ''}`}
                            onClick={() => {
                              setSelectedPhase(index);
                              setSelectedGoal(0);
                            }}>
                            <ProgressIcon status={phase.status} />
                            <div>{phase.content}</div>
                          </div>
                        ))}
                      </div>
                      <div className="subnavcolshadow"></div>
                    </div>
                    <div className="subnav-list">
                      <div className="text-block-3">Goals</div>
                      <div className="w-layout-grid grid-subnav-list">
                        {roadmap.phases[selectedPhase].goals.map((goal, index) => (
                          <div
                            className={`subnavlink w-inline-block ${index === selectedGoal ? 'selected' : ''}`}
                            onClick={() => setSelectedGoal(index)}>
                            <ProgressIcon status={goal.status} />
                            <div>{goal.content}</div>
                          </div>
                        ))}
                      </div>
                      <div className="subnavcolshadow"></div>
                    </div>
                    <div className="subnav-list">
                      <div className="text-block-3">Notes</div>
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
            <Card style={{ marginTop: 30 }}>
              <CardBody>
                <Core /> - This is considered a core feature/offering of the platform and is higher priority than other
                goals.
                <br />
                <br />
                <Bonus /> - This is considered a bonus feature/offering and is lower priority than other goals, so it
                may be more easily paused or pushed back.
                <br />
                <br />
                <Marketing /> - This is a marketing goal, which means we will attempt it in parallel to development
                tasks, and it is dependent on market &amp; funding.
                <br />
                <br />
                <UX /> - This is considered an improvement to the existing experience, which is important to onboard new
                players effectively, but not highest priority.
              </CardBody>
            </Card>
          </>
        ) : null}
        {/* {isAgreed ? (
            <CardCustom>
              <Flex
                flexDirection={['column', null, 'row']}
                alignItems="center"
                justifyContent="center"
                mt="30px"
                mb="30px"
                css={css`
                  min-height: 135px;
                `}
              >
                <Shortcut
                  onClick={() => {
                    history.push('/raid')
                  }}
                >
                  <img src={RaidIcon} />
                  <p>RAID</p>
                </Shortcut>
                <Shortcut onClick={() => history.push('/evolution')}>
                  <img src={EvolutionIcon} />
                  <p>EVOLUTION</p>
                </Shortcut>
                <Shortcut onClick={() => history.push('/infinite')}>
                  <img src={InfiniteIcon} />
                  <p>INFINITE</p>
                </Shortcut>
                <Shortcut onClick={() => history.push('/sanctuary')}>
                  <img src={SanctuaryIcon} />
                  <p>SANCTUARY</p>
                </Shortcut>
                <Shortcut onClick={() => history.push('/guardians')}>
                  <img src={GuardiansIcon} />
                  <p>GUARDIANS</p>
                </Shortcut>
              </Flex>
            </CardCustom>
          ) : null} */}
      </Container>
    </>
  );
};

export default Roadmap;
