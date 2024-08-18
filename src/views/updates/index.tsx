import React from 'react';
import queryString from 'query-string';
import { useCallback, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Page from '~/components/layout/Page';
import { ButtonMenu, ButtonMenuItem, Card, CardBody, Heading } from '~/ui';

const Container = styled.div``;

const Cards = styled.div`
  margin-bottom: 32px;
  background: #000;
  width: 100%;
`;

const PatchNote = styled.div`
  margin-bottom: 60px;

  li,
  em {
    line-height: 1.4rem;
    font-size: 0.9rem;
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
    text-transform: none;
  }
`;

const Tag = styled.span`
  background: #113657;
  border-radius: 3px;
  padding: 3px 4px 2px;
  color: #fff;
  font-weight: bold;
  font-size: 0.8rem;
`;
const BugTag = styled(Tag)`
  background: #571141;
`;
const UXTag = styled(Tag)`
  background: #1c5711;
`;
const UX = () => <UXTag>UX</UXTag>;
const Bug = () => <BugTag>Bug</BugTag>;
const PerformanceTag = styled(Tag)`
  background: #573e11;
`;
const Performance = () => <PerformanceTag>Performance</PerformanceTag>;

const GameTag = styled(Tag)`
  background: #113657;
`;
const Game = () => <GameTag>Game</GameTag>;

const MechanicsTag = styled(Tag)`
  background: #571111;
`;
const Mechanics = () => <MechanicsTag>Mechanics</MechanicsTag>;

const FeesTag = styled(Tag)`
  background: #571141;
`;
const Fees = () => <FeesTag>Fees</FeesTag>;
// ffffff1a

const Date = styled.span`
  opacity: 0.5;
  color: #fff;
  font-size: 1rem;
`;

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};
const Updates = () => {
  const location = useLocation();
  const match = parseMatch(location);
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(match?.params?.game ? parseInt(match?.params?.game + '') : 0);

  const updateHistory = useCallback(
    (key, val) => {
      setTimeout(() => {
        try {
          navigate({
            pathname: '/updates',
            search:
              '?' +
              new URLSearchParams({
                game: tabIndex.toString(),
                [key]: val,
              }).toString(),
          });
        } catch (e) {
          console.log(e);
        }
      }, 500);
    },
    [history, tabIndex]
  );
  const updateTab = (val) => {
    updateHistory('game', val);
    setTabIndex(val);
  };
  return (
    <Page>
      <Container>
        <Cards>
          <Card>
            <CardBody>
              <ButtonMenu activeIndex={tabIndex} scale="md" onItemClick={(index) => updateTab(index)}>
                <ButtonMenuItem>arken.gg</ButtonMenuItem>
                <ButtonMenuItem>Raid</ButtonMenuItem>
                <ButtonMenuItem>Evolution</ButtonMenuItem>
                <ButtonMenuItem>Infinite</ButtonMenuItem>
                <ButtonMenuItem>Guardians</ButtonMenuItem>
                <ButtonMenuItem>Sanctuary</ButtonMenuItem>
              </ButtonMenu>

              {tabIndex === 0 /* arken.gg */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      Upcoming <Date>(tentative!)</Date>
                    </Heading>
                    <em>These changes are planned, and may or may not have already happened, but are not finalized.</em>
                    <br />
                    <br />
                    <ol>
                      <li>Overhaul architecture</li>
                      <li>Greatly improve UX</li>
                      <li>Support free2play</li>
                      <li>Support non-crypto players</li>
                      <li>Multi-chain wallet connect</li>
                      {/* <li>
                        Swap should notify to use round numbers when swapping (otherwise there could be an error).{' '}
                        <Bug />
                      </li> */}
                      {/* <li>
                        Market should have pagination so it's quicker and easier to navigate. <Performance /> <UX />
                      </li>
                      <li>
                        Worldstone Shards should be given as a reward when harvesting. <Game />
                      </li>
                      <li>
                        Items can be destroyed for Arcane Dust (to be used for upgrading). <Game />
                      </li> */}
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <Heading size="xl" mb="24px">
                    Previous Builds
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.8.1 <Date>2022-09-11</Date>
                    </Heading>
                    <ol>
                      <li>
                        Bulk mode for listing, delisting, updating, and purchasing items <Game />
                      </li>
                      <li>
                        Improved live notification styles <UX />
                      </li>
                      <li>
                        Improved item hovers so they change position to always show <UX />
                      </li>
                      <li>
                        Improved market filter styles so easy to search &amp; not cut off <UX />
                      </li>
                      <li>
                        Evolution gear mechanics added to page info <UX />
                      </li>
                      <li>
                        Rune Live: added evo killstreaks, old market contract, and more <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.8.0 <Date>2022-09-02</Date>
                    </Heading>
                    <ol>
                      <li>
                        Live notifications + streams page <UX />
                      </li>
                      <li>
                        Evolution season info + countdown <UX />
                      </li>
                      <li>
                        Lore pages migrated &amp; updated <UX />
                      </li>
                      <li>
                        Consolidated guides page <UX />
                      </li>
                      <li>
                        Add rotating prompts to site header <UX />
                      </li>
                      <li>
                        Home now defaults to Evolution, then Live, then Vision, then infinite scroll other sections{' '}
                        <UX />
                      </li>
                      <li>
                        Market sold listings are now sorted properly <Bug />
                      </li>
                      <li>
                        Added character and achievement list to account landing page <UX />
                      </li>
                      <li>
                        Leaderboard now supports multiple season stats <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.7.1 <Date>2022-08-07</Date>
                    </Heading>
                    <ol>
                      <li>
                        Migrated roadmap from old docs to a dedicated page <UX />
                      </li>
                      <li>
                        Home page: scroll will infinite load pages from the site <UX />
                      </li>
                      <li>
                        Tokenomics page: updated and added stats <Game />
                      </li>
                      <li>
                        Account page: added quests (points coming soon) <Game />
                      </li>
                      <li>
                        Market page: moved filters and default to an inventory view <Performance /> <UX />
                      </li>
                      <li>
                        Trade page: show the token ID, show other items link, countdown if future trade <Game />
                      </li>
                      <li>
                        Added an option to set the market trade for the future <Game />
                      </li>
                      <li>
                        Item attribute min/max range displayed clearer <UX />
                      </li>
                      <li>
                        Attributes not implemented yet are indicated with a red star <Bug />
                      </li>
                      <li>
                        Reworked the site navigation <Bug />
                      </li>
                      <li>
                        Fixed the Evolution leaderboard (updated live) <Bug />
                      </li>
                      <li>
                        Improved Evolution: intro video, embedded ranking and countdown, round reward breakdown <UX />
                      </li>
                      <li>
                        Improved 404 page <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.7.0 <Date>2022-07-29</Date>
                    </Heading>
                    <ol>
                      <li>
                        Improved crafting experience, especially multi-crafting <UX />
                      </li>
                      <li>
                        Improved loading times <Performance /> <UX />
                      </li>
                      <li>
                        Swap built-in <UX />
                      </li>
                      <li>
                        Item hovering is less annoying <UX />
                      </li>
                      <li>
                        Item attributes updates (pulled from API) <UX />
                      </li>
                      <li>
                        Fixed user profile loading <Bug />
                      </li>
                      <li>
                        Zavox description shows possible crafts <UX />
                      </li>
                      <li>
                        Promoted items will show up in market if you're currently playing our games, limited to 2 per
                        player <UX />
                      </li>
                      <li>
                        Fixed some market bugs <Bug />
                      </li>
                      <li>
                        Added discord component to footer <UX />
                      </li>
                      <li>
                        Added tournament page <Game />
                      </li>
                      <li>
                        Added new game modes to Evolution tutorial <Bug />
                      </li>
                      <li>
                        Added skill list to Infinite tutorial <UX />
                      </li>
                      <li>
                        Properly hide secret items from the craft/catalog page <Bug />
                      </li>
                      <li>
                        Catalog item page: add rarity examples and inventory of existing items (needs improvement){' '}
                        <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.6.0 <Date>2022-03-09</Date>
                    </Heading>
                    <ol>
                      <li>
                        New navigation system <UX />
                      </li>
                      <li>
                        Embed Nexus within arken.gg <UX />
                      </li>
                      <li>
                        Added team page and listing on home page <UX />
                      </li>
                      <li>
                        Added a dedicated fundraiser page <UX />
                      </li>
                      <li>
                        Added twitch component to home page <UX />
                      </li>
                      <li>
                        Added a catalog page to view all existing items (unless secret) <UX />
                      </li>
                      <li>
                        Added helpful NPC guides to each page <UX />
                      </li>
                      <li>
                        Reorganized account-related pages <UX />
                      </li>
                      <li>
                        Moved rewards from Evolution page to Reward Centre <UX />
                      </li>
                      <li>
                        Performance improvements <Performance /> <UX />
                      </li>
                      <li>
                        Inventory data is now cached for large wallet performance <Performance /> <UX />
                      </li>
                      <li>
                        Add a full-screen option <UX />
                      </li>
                      <li>
                        Improve crafting cube interface <UX />
                      </li>
                      <li>
                        Add Zavox's Fortune: the first transmutable item into a random active runeform <Game />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.5.0 <Date>2021-10-28</Date>
                    </Heading>
                    <ol>
                      <li>
                        New clean landing page <UX />
                      </li>
                      <li>
                        Moved each game into their own respective pages <UX />
                      </li>
                      <li>
                        Performance improvements <Performance /> <UX />
                      </li>
                      <li>
                        Added embedded youtube video guides to some pages <UX />
                      </li>
                      <li>
                        Swap should automatically round numbers to avoid errors <UX />
                      </li>
                      <li>
                        Embed a buy button on home <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.4.0 <Date>2021-07-04</Date>
                    </Heading>
                    <ol>
                      <li>
                        Market items should only load 50 and then scroll infinitely. <Performance /> <UX />
                      </li>
                      <li>
                        Market filters for rarity and tab should persist on refresh/back. <UX />
                      </li>
                      <li>
                        Pets should have videos. <Game />
                      </li>
                      <li>
                        Item grid animations should be optimized. <Performance />
                      </li>
                      <li>
                        Price on homepage should not flash cached price. <Bug />
                      </li>
                      <li>
                        Item grid should loop end/start and work properly with keyboard. <Bug />
                      </li>
                      <li>Landing page should show more stats: amount raised for charity, market items sold.</li>
                      <li>
                        Fix a bug where item recipe Market was going to pets. <Bug />
                      </li>
                      <li>
                        Show a notice when not connected or connected to wrong network + buttons to switch or learn
                        more. <UX />
                      </li>
                      <li>
                        Integrate and release Arken: Evolution Isles beta. <Game />
                      </li>
                      <li>
                        Basic language localization (French, Spanish, German, Japanese, Chinese, Vietnamese, Swedish).{' '}
                        <UX />
                      </li>
                      <li>
                        Improved user profile info (points, achievements). <Game />
                      </li>
                      <li>
                        Live Player Leaderboard (currently Arken: Evolution Isles). <Game />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.3.0 <Date>2021-06-16</Date>
                    </Heading>
                    <ol>
                      <li>
                        New runeform for helm option: Pledge. <Game />
                      </li>
                      <li>
                        Lorekeeper no longer craftable. <Game />
                      </li>
                      <li>
                        Notice is shown when attempting to harvest with an invalid class item equipped. <UX />
                      </li>
                      <li>
                        Harvest all on dashboard should not show yield bonus as part of calculation (due to potential
                        confusion). <UX />
                      </li>
                      <li>
                        Frontend should not enable animations until a benchmark of 40+ FPS is passed. <Performance />
                      </li>
                      <li>
                        Should not fail to craft 40 sometimes (due to internal ID conflict). <Bug />
                      </li>
                      <li>
                        Inventory items should be fetched in a batch (saving on network calls). <Performance />
                      </li>
                      <li>
                        Inventory items should update automatically after trading, equipping, crafting, etc. <UX />
                      </li>
                      <li>
                        Inventory sorting &amp; filtering. <UX />
                      </li>
                      <li>
                        Inventory arrows should work when coming from landing page. <Bug />
                      </li>
                      <li>
                        Expert mode should always have latest farm. <UX />
                      </li>
                      <li>
                        Item perfection should be easier to see. <UX />
                      </li>
                      <li>
                        Fix various display issues in other browsers. <Bug />
                      </li>
                      <li>
                        Reference token as $RUNE not $XRUNE. <UX />
                      </li>
                      <li>
                        Leaderboard should be updated for Competition #2. <Game />
                      </li>
                      <li>
                        Runeform listing should show retired items with market button. <UX />
                      </li>
                      <li>
                        Market should be filterable by Runeform. <UX />
                      </li>
                      <li>
                        Market filters should be retained when navigating trades, and in URL history (doesnt work
                        perfectly yet). <UX />
                      </li>
                      <li>
                        Rune detail pages should have price history chart. <UX />
                      </li>
                      <li>
                        Release Runeform for Necromancer, Assassin, Paladin and Druid. <Game />
                      </li>
                      <li>
                        Items should have rarity (based on perfection). <Game />
                      </li>
                      <li>
                        First pets should be available on Market. <Game />
                      </li>
                      <li>
                        Fixed an issue being unable to load more than 4000 items in inventory. <Bug />
                      </li>
                      <li>
                        All runeforms should be visible and link to crafting or market. <UX />
                      </li>
                      <li>
                        New runeforms: Wrath and Elder. <Game />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.2.0 <Date>2021-06-02</Date>
                    </Heading>
                    <ol>
                      <li>
                        All equipment stats should be shown. Previously missing: shard chance, rune exchange, reduced
                        fees. <UX />
                      </li>
                      <li>
                        Reduced fee stat should be applied on frontend. <UX />
                      </li>
                      <li>
                        Smoke no longer be craftable. <Game />
                      </li>
                      <li>
                        Should be able to mass craft 10/40 runeforms at a time. <UX />
                      </li>
                      <li>
                        Leaderboard should be updated for June. <Game />
                      </li>
                      <li>
                        Yield bonus should not be shown in Harvest All or any Harvest calculation. <UX />
                      </li>
                      <li>
                        Stats for new runeforms should be on /stats page. <UX />
                      </li>
                      <li>
                        Crafting page should not prompt for unnecessary El approval. <Bug />
                      </li>
                      <li>
                        Should show a banner of latest promotion. <UX />
                      </li>
                      <li>
                        Equip modal should check user has character. <UX />
                      </li>
                      <li>
                        Item's specific type should be shown. <UX />
                      </li>
                      <li>
                        Raid contract should omit rune transfer fees. <Fees />
                      </li>
                      <li>
                        Perfect items glow like they should. <Game />
                      </li>
                    </ol>
                  </PatchNote>
                  <p>Older build notes are in Telegram announcements</p>
                </>
              ) : null}

              {tabIndex === 1 /* Raid */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      2.0.0 <Date>(Work In Progress)</Date>
                    </Heading>
                    <em>These changes are planned, and may or may not have already happened, but are not finalized.</em>
                    <br />
                    <br />
                    <ol>
                      <li>
                        Complete overhaul + gamification <Game />
                      </li>
                      <li>
                        Notice should be shown if unstake is locked (equipping Smoke within same raid). <UX />
                      </li>
                      <li>
                        Farms should be collapsed and expandable so they're easier to navigate. <UX />
                      </li>
                      <li>
                        Notification should be shown for: harvest going to hidden pool, harvest being burned, etc.{' '}
                        <UX />
                      </li>
                      <li>
                        Item calculations should be cached to lower gas fees. <Fees />
                      </li>
                      <li>
                        Raid page should show a Claim Shard button when a Worldstone Shard has been found. <Game />
                      </li>
                      <li>
                        How attributes are calculated/prioritized should be clarified with tooltips. Specifically hidden
                        pool vs lost harvest. <UX />
                      </li>
                      <li>
                        Hidden pool should not proc when depositing/withdrawing. <Mechanics />
                      </li>
                      <li>
                        Yield bonus should get added to hidden pool amount, not transferred to user. <Mechanics />
                      </li>
                      <li>
                        Harvest all in useHarvest needs to check old rune rewards. <UX />
                      </li>
                      <li>
                        Frontend data should be updated live, like a game. <Performance /> <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <p>Older build notes are in Telegram announcements</p>
                </>
              ) : null}

              {tabIndex === 2 /* Evolution */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>

                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.8.0 <Date>2022-07-06</Date>
                    </Heading>
                    <ol>
                      <li>
                        New launcher - fixes an issue where auto update wasn't working all the time. <UX />
                      </li>
                      <li>
                        New game mode: Hayai - You feel energy growing around you... <UX />
                      </li>
                      <li>
                        New game mode: Sprite Juice - 1st sprite = increase decay, 2nd sprite = decrease speed, 3rd
                        sprite = increase speed, 4th sprite = shield <UX />
                      </li>
                      <li>
                        Updated game mode: Marco Polo - 1st sprite = decrease camera size a lot, 2nd sprite = decrease
                        camera size a little, 3rd sprite = increase camera size a little, 4th sprite = increase camera
                        size a lot <UX />
                      </li>
                      <li>
                        Increase base speed and decay 10% <UX />
                      </li>
                      <li>
                        Picking up orbs is announced (with amount) <UX />
                      </li>
                      <li>
                        Battle Royale mode is announced with a countdown <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      Upcoming <Date>(tentative!)</Date>
                    </Heading>
                    <ol>
                      {/* <li>
                        Network performance improvements. <UX />
                      </li> */}
                      <li>
                        Show other player names if they are targeted. <UX />
                      </li>
                      <li>
                        Should be able to pass above wall while it's moving down. <UX />
                      </li>
                      <li>
                        Lobby area to choose which map you want to play. <UX />
                      </li>
                      <li>
                        Hell map, which a special guest. <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <Heading size="xl" mb="24px">
                    Previous Builds
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.6.7 <Date>2021-12-20</Date>
                    </Heading>
                    <ol>
                      <li>
                        Player shouldnt lose points while paused. <UX />
                      </li>
                      <li>
                        Fix UI issues: overlapping navbar, missing life bar after pausing, etc. <UX />
                      </li>
                      <li>
                        Fix bug with server kicking player after rejoining round. <UX />
                      </li>
                      <li>
                        Reduce chance of antifeed bubble from enabling. <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.6.6 <Date>2021-10-19</Date>
                    </Heading>
                    <ol>
                      <li>
                        Add a shadow to display actual network position. <UX />
                      </li>
                      <li>
                        Fix round reward display bug. <Bug />
                      </li>
                      <li>
                        Fix blood causing crash on webgl (potentially). <Bug />
                      </li>
                      <li>
                        Improve colorblind options. <UX />
                      </li>
                      <li>
                        Fix missing sprite color. <Bug />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.6.2 <Date>2021-09-30</Date>
                    </Heading>
                    <ol>
                      <li>
                        Remove other player names/health. <UX />
                      </li>
                      <li>
                        Fix disappearing islands bug. <Bug />
                      </li>
                      <li>
                        Fix the wall divider issue. <Bug />
                      </li>
                      <li>
                        Game mode info is back, by popular complaint. <UX />
                      </li>
                      <li>
                        WASD movement should be snappier. <UX />
                      </li>
                      <li>
                        Remove mouse dead spot. <UX />
                      </li>
                      <li>
                        Add back button to login screen. <UX />
                      </li>
                      <li>
                        Clear blood effects when round ends. <UX />
                      </li>
                      <li>
                        Various performance / bug fixes. <Performance /> <Bug />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      1.5.0 <Date>2021-09-28</Date>
                    </Heading>
                    <ol>
                      <li>Complete overhaul.</li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      0.1.0 <Date>2021-07-04</Date>
                    </Heading>
                    <ol>
                      <li>Initial release.</li>
                    </ol>
                  </PatchNote>
                </>
              ) : null}

              {tabIndex === 3 /* Infinite */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      0.7.0 <Date>2022-08-09</Date>
                    </Heading>
                    <ol>
                      <li>
                        Added a shop (prototype) <Game />
                      </li>
                      <li>
                        Added a basic inventory and enemy drops <Game />
                      </li>
                      <li>
                        Added a cosmetic system: skins, kill animations, death animations, banners <Game />
                      </li>
                      <li>
                        Added skill sound effects <Game />
                      </li>
                      <li>
                        Much improved camera rotation <UX />
                      </li>
                      <li>
                        Players will fade out when far away (helps with kiting) <Game />
                      </li>
                      <li>
                        Improve skill colliders <Bug />
                      </li>
                      <li>
                        Fix duplicate arcane orbs issue <Bug />
                      </li>
                      <li>
                        Server now disconnects old clients from connecting <Game />
                      </li>
                      <li>
                        Fix enemy sprite clipping <Bug />
                      </li>
                      <li>
                        Buffs/debuffs now reset when changing zones <Bug />
                      </li>
                      <li>
                        Remove unique skill selection requirement <UX />
                      </li>
                      <li>
                        Added windowed + resize window mode <UX />
                      </li>
                      <li>
                        Fix Xbox controllers <Bug />
                      </li>
                      <li>
                        Improve movement controls <UX />
                      </li>
                      <li>
                        Various visual bugfixes and improvements <Bug />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      Upcoming <Date>(tentative!)</Date>
                    </Heading>
                    <ol>
                      <li>
                        Network layer improvements <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <Heading size="xl" mb="24px">
                    Previous Builds
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      0.6.0 <Date>2022-06-19</Date>
                    </Heading>
                    <ol>
                      <li>
                        Skill Renames: Earthquake → Moonlight Wave / Fire Storm → Rain of Fire / Immolation Arrow →
                        Incineration Arrow / Multi Shot → Split Shot / Redemption → Grim Harvest Aura / Howl →
                        Intimidating Warcry / Charged Bolt → Discharge
                      </li>
                      <li>
                        No reassigning skills during combat <UX />
                      </li>
                      <li>
                        New skill bar UI layout <UX />
                      </li>
                      <li>
                        Hotkeys can be assigned <UX />
                      </li>
                      <li>
                        Basic gamepad support + indication <UX />
                      </li>
                      <li>
                        Multiple nameable custom gearsets should work <UX />
                      </li>
                      <li>
                        Skills should be searchable by name <UX />
                      </li>
                      <li>
                        Each skill should have mana in description <UX />
                      </li>
                      <li>
                        Show an indicator when a skill is "boosted" <UX />
                      </li>
                      <li>
                        Movement destination indicator <UX />
                      </li>
                      <li>
                        Switched doors to a forcefield <UX />
                      </li>
                      <li>
                        Fix stuck UI issues <Bug />
                      </li>
                      <li>
                        Remove opponent mana bar <UX />
                      </li>
                      <li>
                        Show different damage number colors for different players <UX />
                      </li>
                      <li>
                        Show skill damage/DPS on the match result screen <UX />
                      </li>
                      <li>
                        Force remove player from arena when battle ends <Bug />
                      </li>
                      <li>
                        Parallax space background behind the map <UX />
                      </li>
                      <li>
                        Should be able to cast while CC'd <Bug />
                      </li>
                      <li>
                        Fix issues with death animation <UX />
                      </li>
                      <li>
                        Mix some matchmatching issues <Bug />
                      </li>
                      <li>
                        Add an experimental camera rotation feature <UX />
                      </li>
                      <li>
                        Stay on same path after death <UX />
                      </li>
                      <li>
                        Fix issue where skill effects persisted after death <Bug />
                      </li>
                      <li>
                        Fix alt tab issue that was making input freeze <Bug />
                      </li>
                      <li>
                        Fix issue with skills being randomly disabled <Bug />
                      </li>
                      <li>
                        Leap improved positioning <Bug />
                      </li>
                      <li>
                        Fireball shouldnt shake screen unless nearby <UX />
                      </li>
                      <li>
                        Breath of fire burns multishot arrows <UX />
                      </li>
                      <li>
                        Heal is now over time <UX />
                      </li>
                      <li>
                        Lightning trap range reduced by 30% <UX />
                      </li>
                      <li>
                        Other misc skill balancing <UX />
                      </li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      0.5.1 <Date>2022-04-10</Date>
                    </Heading>
                    <ol>
                      <li>Remove pillars from path for now</li>
                      <li>Fix the lingering skill effects</li>
                      <li>Default matchmaking to quick match (only get +1 rank if beat equal or greater rank)</li>
                      <li>Fix clear slot</li>
                      <li>Fix immolation arrow</li>
                      <li>Pillars in arena are destroyable now</li>
                      <li>Update meteor DoT</li>
                      <li>Fix chain lightning</li>
                      <li>Fix movement under bridge</li>
                      <li>Start on correct floor when joining server now</li>
                      <li>Fix missing names issue</li>
                      <li>Notification when trying to cast skill with no energy</li>
                    </ol>
                  </PatchNote>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      0.5.0 <Date>2021-04-07</Date>
                    </Heading>
                    <ol>
                      <li>Initial launch.</li>
                    </ol>
                  </PatchNote>
                </>
              ) : null}

              {tabIndex === 4 /* Guardians */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      Upcoming <Date>(tentative!)</Date>
                    </Heading>
                    <ol>
                      <li>Everything.</li>
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <Heading size="xl" mb="24px">
                    Previous Builds
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      None
                    </Heading>
                  </PatchNote>
                </>
              ) : null}

              {tabIndex === 5 /* Sanctuary */ ? (
                <>
                  <Heading size="xl" mb="24px" mt="30px">
                    Current Build
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      Upcoming <Date>(tentative!)</Date>
                    </Heading>
                    <ol>
                      <li>Everything.</li>
                    </ol>
                  </PatchNote>
                  <hr />
                  <br />
                  <br />
                  <Heading size="xl" mb="24px">
                    Previous Builds
                  </Heading>
                  <PatchNote>
                    <Heading size="lg" mb="10px">
                      None
                    </Heading>
                  </PatchNote>
                </>
              ) : null}
            </CardBody>
          </Card>
        </Cards>
      </Container>
    </Page>
  );
};

export default Updates;
