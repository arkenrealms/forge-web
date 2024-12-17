import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
  Card2,
  Card3,
  CardBody,
  Skeleton,
  CheckmarkCircleIcon,
  Flex,
  Tag,
  PrizeIcon,
  OpenNewIcon,
  LinkExternal,
  Link,
  BlockIcon,
} from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import Cookies from 'js-cookie';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import history from '~/routerHistory';
import { Link as RouterLink, NavLink } from 'react-router-dom';
import Page from '~/components/layout/Page';
import { getBalanceNumber } from '~/utils/formatBalance';
import { useTotalSupply, useBurnedBalance } from '~/hooks/useTokenBalance';
import { useProfile } from '~/state/hooks';
import { useRunePrice } from '~/state/hooks';
import PageWindow from '~/components/PageWindow';
import CardHeader from '~/components/account/CardHeader';
import useGetWalletNfts from '~/hooks/useGetWalletNfts';
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers';
import { itemData } from '@arken/node/legacy/data/items';
import CardValueUnstyled from '~/components/raid/CardValueUnstyled';
import { ItemsMainCategoriesType } from '@arken/node/legacy/data/items.type';
import { RecipeInfo } from '~/components/RecipeInfo';
import { ProfileInfo } from '~/components/ProfileInfo';
import { PurchaseModal } from '~/components/PurchaseModal';
import NftList from '~/components/characters/NftList';
import useStats from '~/hooks/useStats';
import useCache from '~/hooks/useCache';

const GuideContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Partners = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(5, 1fr);
  }

  a {
    line-height: 60px;

    img {
      margin: auto;
      vertical-align: middle;
      display: inline-block;
    }
  }
`;

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

const LogoImg = styled.img`
  max-width: 200px;
`;

const BoxHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 16px;
`;

const BigCard = styled(Card)`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  // background-color: rgba(0,0,0,0.4);
  line-height: 1.6rem;
  font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  margin-bottom: 20px;
  p,
  a {
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ddd;
  }
`;

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CharacterContainer = styled.div`
  zoom: 0.5;

  display: grid;
  grid-gap: 10px;
  grid-template-columns: 2fr;
  grid-template-columns: repeat(2, 1fr);
  padding-bottom: 24px;
  padding-top: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-template-columns: repeat(7, 1fr);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(7, 1fr);
  }

  @media (min-width: 1980px) {
    grid-template-columns: repeat(7, 1fr);
  }
`;

const ItemCard = styled(Card3)`
  position: relative;
  overflow: hidden;
  font-weight: bold;
  zoom: 0.7;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  filter: contrast(1.08);
  padding: 20px 30px;
  text-align: center;

  & > div {
    position: relative;
    z-index: 2;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
  }
`;

const HelpText = styled.p``;

const HelpLinks = styled.div`
  text-align: left;
  width: 100%;
  margin-top: 20px;
  line-height: 1.3rem;

  &,
  div,
  span,
  a {
    color: #bb955e;
    line-height: 1.5rem;
  }
`;

const PurchaseLink = styled.div`
  font-family: 'Alegreya Sans', sans-serif, monospace;
  text-transform: none;
  color: #ddd;
`;

const Guide: React.FC<any> = () => {
  const { t } = useTranslation();
  const cache = useCache();

  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);

  const { totalRunes, totalRunewords } = cache.stats;

  const referer = Cookies.get(`referer`);

  return (
    <Page>
      {referer ? (
        <Card2>
          <BigCard>
            <CardBody>
              <BoxHeading as="h2" size="xl">
                {t(`You've been referred by`) + ' ' + referer}
              </BoxHeading>
              <p>
                You've been chosen to be among the elite. If you join us, you'll receive a 20% refund on your account
                creation cost after signing up.
              </p>
              <br />
              <br />
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Button
                  as={RouterLink}
                  to={'/user/' + referer}
                  style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}>
                  View {referer}'s Profile
                  <OpenNewIcon color="white" ml="4px" />
                </Button>
              </Flex>
            </CardBody>
          </BigCard>
        </Card2>
      ) : null}
      <Card2>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('What is Runic Raids?')}
            </BoxHeading>
            <p>
              <strong>RUNIC RAIDS</strong> is the first game launched in the Arken Realms, consider it our Big Bang.
              Several runes (BEP20 tokens) can only be earned by providing liquidity and raiding yield farms.
            </p>
            <br />
            <p>
              Runes are magical stones used to craft Runeforms (NFTs), unique weapons and gear that make your character
              more powerful. There are 33 different runes, distributed over two years throughout the Arken Realms. Each
              rune is a <strong>BEP20</strong> token with a limited supply. Most of the runes will be burned forever by
              minting Runeforms.
            </p>
            <br />
            <p>
              Several runes can only be earned by providing liquidity to the ecosystem, staking the Liquidity Pool (LP)
              tokens in farms, and then raiding them!
            </p>
            <br />
            <p>
              We have implemented fluid farming, so you do not need to unstakes and retake for new farms. The unique
              mechanics introduced by Rune make Runic Raids the first ever NFT Hyperfarm!
            </p>
            <br />
            <p>
              It was{' '}
              <a href="/faq#q-fair-launch" rel="noreferrer noopener" target="_blank">
                launched fairly with no investors, no presale, and no premine
              </a>
              .
            </p>
            {/* <br />
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              variant="text"
              as={Link}
              href="https://youtu.be/Nb0kXeLQKQE"
              target="_blank"
              style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
            >
              {t('Introduction Video #1')}
              <OpenNewIcon ml="4px" />
            </Button>
          </Flex>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              variant="text"
              as={Link}
              href="https://youtu.be/_H_SUbZw5Sc"
              target="_blank"
              style={{ color: '#bb955e', padding: '6px 20px', textAlign: 'center' }}
            >
              {t('Introduction Video #2')}
              <OpenNewIcon ml="4px" />
            </Button>
          </Flex> */}
          </CardBody>
        </BigCard>
      </Card2>
      <Card3>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('How To Play')}
            </BoxHeading>
            <GuideContainer>
              <div>
                <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                  1. Join the Raid
                </Heading>
                <br />
                <HelpText>
                  Raiding is the act of pillaging a pool or farm for newly minted runes.
                  <br />
                  <br />
                  To raid, you must acquire the $RXS token or any of the runes. You can acquire the runes through games
                  such as Evolution Isles or buy them from Arken Swap. You can either stake the tokens in a Pool or
                  provide liquidity to acquire Liquidity Pool (LP) tokens. Stake the LP token into a Farm, and start
                  watching your yield grow. Collect the harvest by raiding the farm and pool.
                </HelpText>
                <HelpLinks>
                  &bull;{' '}
                  <PurchaseLink style={{ display: 'inline-block' }} onClick={onPresentPurchaseModal}>
                    Purchase $RXS
                  </PurchaseLink>
                  <br />
                  &bull;{' '}
                  <a href="https://arken.gg/swap/" rel="noreferrer noopener" target="_blank">
                    Create LPs on Arken Swap
                  </a>
                  <br />
                  &bull; <RouterLink to="/pools">Join Pool Raid</RouterLink>
                  <br />
                  &bull; <RouterLink to="/farms">Join Farm Raid</RouterLink>
                  <br />
                </HelpLinks>
              </div>
              <div>
                <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                  2. Create a Character
                  <br />
                  <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
                </Heading>
                <br />
                <HelpText>
                  Create a hero if you want to equip them with strong weapons and armor (Runeforms) and take them into
                  other Arken games. Some of these Runeforms can even be used to optimise your yield farming game.
                </HelpText>
                <HelpLinks>
                  &bull; <RouterLink to="/account">Create Character</RouterLink>
                </HelpLinks>
              </div>
              <div>
                <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                  3. Craft or Trade Runeforms
                  <br />
                  <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
                </Heading>
                <br />
                <HelpText>
                  Use runes to craft Runeforms, unique and powerful NFTs for your hero. To craft Runeforms, you need to
                  know the correct rune combination, called a recipe.
                </HelpText>
                <HelpLinks>
                  &bull; <RouterLink to="/craft">View Runeform Recipes</RouterLink>
                  <br />
                  &bull; <RouterLink to="/transmute">Start Crafting</RouterLink>
                </HelpLinks>
              </div>
              <div>
                <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                  4. Equip Items
                  <br />
                  <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
                </Heading>
                <br />
                <HelpText>
                  You can equip your hero with Runeforms once you have acquired them from crafting or the trading in the
                  marketplace. Visit your inventory see your Runeforms and hero.
                </HelpText>
                <HelpLinks>
                  &bull; <RouterLink to="/account/inventory">View Inventory</RouterLink>
                </HelpLinks>
              </div>
            </GuideContainer>
          </CardBody>
        </BigCard>
      </Card3>
      <Card3>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('Recommended Wallets')}
            </BoxHeading>
            <p>
              <strong>Desktop:</strong> MetaMask.
            </p>
            <p>
              <strong>Mobile:</strong> TrustWallet, SafePal, or EzDeFi.
            </p>
          </CardBody>
        </BigCard>
      </Card3>
      <Card3>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('Characters')}
            </BoxHeading>
            <p>
              Choose from seven classes of heroes. Each class has its own unique weapons and power. Develop your raiding
              strategy by equipping your character with Runeforms that give unique raiding yield bonuses.
            </p>
            <br />
            <p>
              Early adopters will have an opportunity to get some of the rarest <strong>NFT</strong>s either through
              airdrops, fundraising, or farming.
            </p>
            <br />
            <br />
            <CharacterContainer>
              <NftList autoShowDescription showCard={false} />
            </CharacterContainer>
          </CardBody>
        </BigCard>
      </Card3>
      <Card3>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('Runeforms')}
            </BoxHeading>

            <p>
              Runeforms are unique weapons and armor used to equip your hero. Each Runeform is different with varying
              attributes suitable for a specific hero class or style of play. Equip your hero with Runeforms to make
              them more powerful in battle, increase magic find, or improve farming and merchant abilities. Runeforms
              can be taken between games in the Arken ecosystem, collected, shared, and traded in the Arken Market. Soon
              you'll be able to lend your Runeforms to guild members or through the Marketplace.
            </p>
            <br />
            <p>
              These items can be used in our upcoming games, because they are{' '}
              <a href="/news/ready-player-one" rel="noreferrer noopener" target="_blank">
                <strong>Evolving NFTs</strong>
              </a>{' '}
              that have branching attributes.
            </p>
            <br />
            <ItemContainer>
              <ItemCard>
                <RecipeInfo
                  item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Titan')}
                  // showCraftButton
                  // showMarketButton
                />
              </ItemCard>
              <ItemCard>
                <RecipeInfo
                  item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Fury')}
                  // showCraftButton
                  // showMarketButton
                />
              </ItemCard>
              <ItemCard>
                <RecipeInfo
                  item={itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === 'Pledge')}
                  // showCraftButton
                  // showMarketButton
                />
              </ItemCard>
            </ItemContainer>
          </CardBody>
        </BigCard>
      </Card3>
      <Card3>
        <BigCard>
          <CardBody>
            <BoxHeading as="h2" size="xl">
              {t('Runes')}
            </BoxHeading>
            <p>
              Runes are small stones inscribed with magical glyphs. Runes will be distributed to players through the
              Arken ecosystem over time. There are currently {totalRunes} released. Each rune builds on the last,
              expanding the universe with new storylines, games, and unique collectibles that make your heroes stronger.
              Players can earn runes in games by competing against other players, guilds, and AI, raiding, and community
              participation.
            </p>
            {/* <p className="paragraph-2">Attribute mechanics in Runic Raids are executed on the blockchain within the farms. Attributes from your equipped items are added together, and then processed. <br />‍ <br />Final Harvest is computed based on the following steps: <br />*&nbsp;Fee - Calc fee based on harvest <br />*&nbsp;Early Unstake No Reward - Check, if so then set harvest to <br />*&nbsp;Burn - Apply burn to harvest <br />*&nbsp;Swap - Swap % of harvest <br />*&nbsp;Fee - Take fee *if theres any harvest left* <br />*&nbsp;Hidden Pool - Check if sending to hidden pool, if so then set harvest to <br />*&nbsp;Bonus Yield - Give bonus based on harvest if anything left <br />
            <br />
            <strong>Note:&nbsp;these are under development &amp;&nbsp;more are coming soon.</strong>
            <br />
          </p> */}
            {/* <br />
          <p>
            Planned runes: EL, ELD, TIR...{' '}
            <a href="https://arken.gg/docs/tokenomics/rune-list" rel="noreferrer noopener" target="_blank">
              See Full List
            </a>
            .
          </p>
          <br />
          <p>After all runes are distributed, they&apos;ll be used in the upcoming games and marketplace.</p>
          <br />
          <br />
          <br />
          <br /> */}
            {/* <BoxHeading as="h2" size="xl">
            {t('Why Rune?')}
          </BoxHeading>
          <p>
            <strong>$RUNE</strong> is the protocol of the ecosystem. There was only 20,000 minted and are frequently
            burned. It is required to do certain actions such as create characters. In the future it can be staked for
            Arcane Dust ($ARC), which recieve dividends from other systems. Such planned systems are Random Chests, Item
            Gambling, and Mystery Trades.
          </p>
          <br />
          <p>
            Arken is built by a dedicated team who are passionate about RPGs and the DeFi space, and have the experience
            to bring it to a broad market. Like Bitcoin, the creator is anonymous (for the time being).
          </p>
          <br />
          <br />
          <br />
          <br />
          <BoxHeading as="h2" size="xl">
            {t('FAQ')}
          </BoxHeading>
          <p>Q. Can I stake the same LPs? A. Yes! No LP left behind.</p>
          <br />
          <p>
            Q. There&apos;s so much to do. What do I do? A. That&apos;s part of the fun of the game. Most get started
            buying some old runes, for example EL + TIR, adding liquidity on Arken Swap, and staking them in farms.
          </p>
          <br />
          <p>
            If you&apos;d like to know more in detail,{' '}
            <a href="/faq" rel="noreferrer noopener" target="_blank">
              <strong>visit our FAQ</strong>
            </a>{' '}
            or{' '}
            <a href="https://telegram.arken.gg" rel="noreferrer noopener" target="_blank">
              <strong>join our telegram</strong>
            </a>
            .
          </p>
          <br />
          <br />
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Button
              as={Link}
              href="/faq"
              style={{ padding: '6px 20px', textAlign: 'center' }}
            >
              {t('Frequently Asked Questions')}
              <OpenNewIcon color="white" ml="4px" />
            </Button>
          </Flex>
          <br /> */}
          </CardBody>
        </BigCard>
      </Card3>
      <br />
      <br />
      <br />
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Button
          as={RouterLink}
          to="/farms"
          style={{ zoom: 1.3, padding: '6px 20px', textAlign: 'center' }}
          onClick={() => {
            window.scrollTo(0, 0);
          }}>
          Raid Farms
        </Button>
        <br />
        <Button
          as={RouterLink}
          to="/pools"
          style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
          onClick={() => {
            window.scrollTo(0, 0);
          }}>
          Raid Pools
        </Button>
      </Flex>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      {/* <Card style={{ overflow: 'visible' }}>
          <CardHeader style={{ paddingBottom: 70 }}>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <Content>
                Ssssss
              </Content>
            </Flex>
            <Status>
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Paused')}
                </Tag>
            </Status>
          </CardHeader>
          <CardBody style={{ marginTop: -70 }}>
            <Section>
              <BoxHeading as="h4" size="md">
                {t('Achievements')}
              </BoxHeading>
            </Section>
            <Section>
              <BoxHeading as="h4" size="md" mb="0px">
                {t('Characters')}
              </BoxHeading>
              <Flex justifyContent="center">
                <Button as={Link} to="/characters" style={{ textAlign: 'center' }}>
                  Create Character
                </Button>
              </Flex>
            </Section>
          </CardBody>
        </Card> */}
      {/* </PageWindow> */}
    </Page>
  );
};

export default Guide;
