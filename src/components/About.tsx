import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BottomCTA from '~/components/BottomCTA';
import Linker from '~/components/Linker';
import { useModal } from '~/components/Modal';
import { PurchaseModal } from '~/components/PurchaseModal';
import { Card, Card2, CardBody, Heading } from '~/ui';
import { trpc, trpcClient, queryClient } from '~/utils/trpc';

const Image = styled.img`
  border-radius: 7px;
`;

const BoxHeading = styled(Heading)`
  margin-bottom: 16px;
`;
const PitchCard = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    display: flex;
    flex: 1;
    flex-direction: row;

    & > div:first-child {
      flex-grow: 0;
      flex-shrink: 0;
    }

    & > div {
    }
  }
`;

// const PollingExample = () => {
//   const { data, refetch } = trpc.someQuery.useQuery(undefined, {
//     refetchInterval: 1000, // Poll every 1 second
//   });

//   return <div>Data: {JSON.stringify(data)}</div>;
// };

const Rules = () => {
  const { t } = useTranslation();
  const [showVision, setShowVision] = useState(false);
  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  return (
    <>
      <Card2 style={{ maxWidth: 1200, margin: '0 auto 30px auto', width: '100%' }}>
        <Card>
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
            {t('About')}
          </Heading>
          <hr />
          <CardBody>
            <p>Arken was launched March 28, 2021. It has evolved and will continue to evolve over the years.</p>
            <br />
            <br />

            <PitchCard>
              <div style={{ width: '280px', marginTop: '-20px' }}>
                <img src="/images/character-classes/sorceress.png" alt="Omniverse"></img>
              </div>
              <div>
                <BoxHeading as="h2" size="xl">
                  {t('Omniverse')}
                </BoxHeading>
                <br />
                <p>
                  <Linker id="about-1">
                    Explore the depths of the Arken Realms. Immerse yourself in our fantasy games, winning tokens and
                    NFTs, trade them on our NFT Marketplace and participate in NFT farms and pools.
                    <br />
                    <br />
                    We build fun games, and incorporate blockchain gaming so you own your character and items for life,
                    can bring them from game to game, and monetize on your hard work.
                    <br />
                    <br />
                    Each game we build, we use everything we learn to develop the future of blockchain gaming
                    peice-by-piece in an agile way. Each game will inform us on the best balance between traditional and
                    blockchain, allowing us to deliver the power of ownership/transparency/modularity, while maintaining
                    a high integrity for fun factor.
                    <br />
                    <br />
                    Components of Arken architecture include:
                    <br />
                    <ul>
                      <li>NFT Service (token IDs + metadata)</li>
                      <li>P2E Service (secure rewards)</li>
                      <li>RNG Service (transparency)</li>
                      <li>Lend Service (boost + consume items)</li>
                      <li>Gear Service (access to multiple character inventory)</li>
                      <li>Game Service (Unity game server for logic)</li>
                      <li>Cache Service (compiles &amp; distributes web3 cache)</li>
                    </ul>
                  </Linker>
                </p>
              </div>
            </PitchCard>
            <br />
            <br />
            <PitchCard>
              <div style={{ width: '280px', marginTop: '-20px' }}>
                <img src="/images/dragons.png" alt="Ownership"></img>
              </div>
              <div>
                <BoxHeading as="h2" size="xl">
                  {t('Ownership')}
                </BoxHeading>
                <br />
                <p>
                  <Linker id="about-2">
                    Imagine a digital world where you are your own boss. You have developed your skill &amp; knowledge,
                    and are now rewarded for your effort. Our goal is to provide an income for at least 1% of our most
                    talented/hard working players.
                    <br />
                    <br />
                    We don't believe it is viable to pay everybody a full income to play a game. However, players should
                    still own what they pwn. In addition to that, we've designed the economy in a way that it rewards
                    the most talented players.
                    <br />
                    <br />
                    Each of our 33 runes have utility built into them, and can also be used for crafting. When rune
                    tokens are used for crafting, they are redistributed to players winning games or finding them
                    randomly in the game.
                    <br />
                    <br />
                    This is balanced to support economic inflows and outflows. For example, disenchanting an item will
                    give you LENI runes, and upgrading items will require LENI runes based on the global disenchant
                    rate. There's a ying and yang to each economy within the Arken Realms.
                  </Linker>
                </p>
              </div>
            </PitchCard>
            <br />
            <br />
            <PitchCard>
              <div style={{ width: '275px', marginRight: '10px' }}>
                <Image src="/images/cube-preview.png" />
              </div>
              <div>
                <BoxHeading as="h2" size="xl">
                  {t('Evolving NFTs')}
                </BoxHeading>
                <br />
                <p>
                  <Linker id="about-3">
                    Arken tokens are needed to craft <strong>Runeform Items</strong> (NFTs), unique and powerful weapons
                    and armor used to enhance your Runic Raids farm rewards, or buff your Infinite Arena hero. <br />
                    <br />
                    The mechanics of these NFTs are built directly into the Token ID itself, and come with advanced meta
                    data to be used in multiple games (even games not published by us). We call these Evolving NFTs.
                    <br />
                    <br />
                    In the future, we will build a micro-licensing system into these NFTs so that third-party developers
                    can build extensions of the game and receive/pay royalties legally.
                    <br />
                    <br />
                    These developers can buy land within Heart of the Oasis and build their world/quests there. Players
                    will be able to access their world from a portal in The End of Time.
                    <br />
                    <br />
                    Our eventual goal is to build unstoppable distributed &amp; modular games. Arken Realms, the games
                    &amp; mods will exist within a distributed network and architecture around that allowing to play
                    securely without risk of hacks or compromise.
                  </Linker>
                </p>
              </div>
            </PitchCard>
            <br />
            <br />
            <PitchCard>
              <div style={{ width: '275px', marginRight: '10px' }}></div>
              <div>
                <BoxHeading as="h2" size="xl">
                  {t('Efforts')}
                </BoxHeading>
                <br />
                <p>All of this tentative, and these are goals not guarantees.</p>
                <br />
                <br />
                <BoxHeading as="h3" size="lg">
                  <span className="mw-headline" id="Competitions">
                    Competitions
                  </span>
                </BoxHeading>
                <ol>
                  <li>Riddle Competitions - Can you solve the riddle?</li>
                  <li>Crafting Competitions - Craft and win.</li>
                  <li>
                    Sunday Quiz - Runes are distributed to true raiders, and the truest of raiders will show up and
                    participate in the Sunday quiz.
                  </li>
                  <li>
                    Arken Ultimate Tournament - Arken may host a few competitions where they give away runes to the
                    winning teams
                  </li>
                </ol>
                <br />
                <br />
                <BoxHeading as="h3" size="lg">
                  <span className="mw-headline" id="Growth_Efforts">
                    Growth Efforts
                  </span>
                </BoxHeading>
                <ol>
                  <li>
                    Fundraisers - The Arken Council will have multiple fundraisers to raise money for marketing and
                    eventually a studio. 1) Pets 2) Guild Tokens 3) Nostalgic Items 4) NPCs. Most will be used toward
                    high quality marketing efforts.
                  </li>
                  <li>
                    Community Driven Development - The team loves to get constant feedback from the community, so they
                    are always working towards better more refined products. Right now they do this through various
                    polls and private group discussions.
                  </li>
                  <li>
                    Community Management - Each region has their own community where they can discuss Arken in their own
                    language, and meet fellow local raiders. Region Community Managers are rewarded with a unique
                    trinket for their contribution. CMs also receive a portion of the vault earnings each month.
                  </li>
                  <li>
                    Community Moderation - Mods are rewarded with a unique trinket for their contribution. Mods also
                    receive a portion of the vault earnings each month.
                  </li>
                </ol>
                <br />
                <br />
                <BoxHeading as="h3" size="lg">
                  <span className="mw-headline" id="Misc">
                    Misc
                  </span>
                </BoxHeading>
                <ol>
                  <li>Character Cost - The cost of creating a new character is around $25-30 USD paid in $RXS</li>
                  <li>
                    Item Perfection - Item attributes are random. Perfect items should be quite rare, and so Runeforms
                    are retired frequently.
                  </li>
                  <li>
                    Guild Scrolls - The Arken Council is working on tokenizing the guild membership into guild scrolls,
                    so it won't be open per se, but can be transferred, so maybe some of us have honorary ones to give
                    away.
                  </li>
                  <li>
                    Class Goals - Each class will have specific play styles and goals. The gameplay is being tweaked
                    development continues.
                  </li>
                  <li>
                    Unique Items - Arken is building thousands of items with unique images/stats that can be found very
                    rarely and randomly while farming, depending on your Magic Find.
                  </li>
                </ol>
                <br />
                <br />
                <BoxHeading as="h3" size="lg">
                  <span className="mw-headline" id="Philosophy">
                    Philosophy
                  </span>
                </BoxHeading>
                <ol>
                  <li>
                    Immortalize Winners - The Arken Council is going to try to immortalize competition winners by
                    integrating them into the Arcane game lore, items, or NPCs{' '}
                    <a rel="nofollow" className="external free" href="https://t.me/Arken_Council/5252">
                      https://t.me/Arken_Council/5252
                    </a>
                  </li>
                  <li>
                    Agile Development - Make constant small improvements and get constant feedback, rather than trying
                    to take large bites of work.
                  </li>
                  <li>
                    Reward Early Adopters - The team is always thinking about how they can reward early adopters who
                    stick around, and the best way is probably though items + runewords.
                  </li>
                  <li>
                    Congruency - The Arken Council want to build the best game that can be built for the ARPG genre. For
                    that reason, Arken will not have bunny skins or snowman pets. The team wants to take that genre to
                    the next level, not be everything to everybody.
                  </li>
                  <li>
                    Whats Done Is Done - Our goal is to catch and stop minting overpowered items as soon as possible,
                    but not nerf already minted items. Unless it was a bug, item attributes shouldn't be manipulated on
                    our end. This philosophy will help design better items, and not piss off early adopters, who are the
                    ones that will be rewarded the most anyway.
                  </li>
                </ol>
              </div>
            </PitchCard>
          </CardBody>
        </Card>
      </Card2>
      <BottomCTA />
    </>
  );
};

export default Rules;
