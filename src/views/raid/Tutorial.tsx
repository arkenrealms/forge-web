import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  Heading,
  Text,
  BaseLayout,
  AutoRenewIcon,
  Button,
  Card,
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
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import Cookies from 'js-cookie'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import history from '~/routerHistory'
import { Link as RouterLink, NavLink } from 'react-router-dom'
import Page from '~/components/layout/Page'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from '~/hooks/useTokenBalance'
import { useProfile } from '~/state/hooks'
import { useRunePrice } from '~/state/hooks'
import PageWindow from '~/components/PageWindow'
import CardHeader from '~/components/account/CardHeader'
import useGetWalletNfts from '~/hooks/useGetWalletNfts'
import { getNativeAddress, getRuneAddress } from '~/utils/addressHelpers'
import { itemData } from 'rune-backend-sdk/build/data/items'
import CardValueUnstyled from '~/components/raid/CardValueUnstyled'
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type'
import { RecipeInfo } from '~/components/RecipeInfo'
import { ProfileInfo } from '~/components/ProfileInfo'
import { PurchaseModal } from '~/components/PurchaseModal'
import NftList from '~/components/characters/NftList'
import useStats from '~/hooks/useStats'
import useCache from '~/hooks/useCache'

const GuideContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(2, 1fr);
  }
`

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
`

const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`

const LogoImg = styled.img`
  max-width: 200px;
`

const BoxHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 16px;
`

const HeadingSilver = styled.div`
  background-image: -webkit-linear-gradient(
    top,
    #bcbcbc 0%,
    #bcbcbc 17.5%,
    #cecece 33.75%,
    #f0f0f0 50%,
    #cecece 63.75%,
    #bcbcbc 77.5%,
    #bcbcbc 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`

const HeadingPlain = styled.div`
  color: #cecece;
  text-transform: uppercase;
  line-height: 1rem;
  font-family: 'webfontexl', 'Palatino Linotype', 'Times', serif;
  font-size: 85px;
  font-weight: normal;
  // filter: sepia(1) saturate(5) hue-rotate(-25deg);
  // sepia(1) saturate(5) hue-rotate(-25deg) grayscale(1) drop-shadow(0px 0px 10px #000) invert(1)
  filter: drop-shadow(0 0 5px rgba(0, 0, 0, 1));
`

const ProfileContainer = styled.div`
  background: #000;
  background-size: 400px;
`

const BigCard = styled.div`
  color: ${({ theme }) => theme.colors.text};
  position: relative;

  border-width: 10px 10px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 140 repeat;
  border-image-width: 80px;
  box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  // background-color: rgba(0,0,0,0.4);
  line-height: 1.6rem;
  font-size: 1rem;
  text-shadow: 1px 1px 1px #000;
  p,
  a {
    font-family: 'Alegreya Sans', sans-serif, monospace;
    text-transform: none;
    color: #ddd;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    border-width: 40px 40px;
  }
`

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
`

const BulletPoints = styled.div``

const BulletPoint = styled.div`
  line-height: 2rem;
  color: #fff;
  // color: #7576df;
  font-size: 1rem;
  position: relative;
  padding-left: 12px;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    content: '•';
  }
`

const HeadingWrapper = styled.div`
  position: relative;
  height: 50px;
  padding-top: 0px;
  background: url(/images/pop_up_window_A2.png) no-repeat 50% 0;
  background-size: 200%;
  // filter: contrast(1.5) saturate(1.7) drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px)
  //   drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px) hue-rotate(10deg);
  width: calc(100% + 40px);
  margin-left: -20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 50px;
    padding-top: 10px;
    background-size: 100%;
    overflow: hidden;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const ItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: repeat(3, 1fr);
  }
`

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
`

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }
`

const ItemCard = styled(Card)`
  position: relative;
  overflow: hidden;
  font-weight: bold;
  zoom: 0.7;
  border-width: 18px 6px;
  border-style: solid;
  border-color: transparent;
  border-image-source: url(/images/puzzle_bars.png);
  border-image-slice: 25% fill;
  border-image-width: 100px 100px;
  background: none;
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
`

const BuyLink = styled.a`
  color: #fff;
  padding: 3px 15px;
  margin-top: 20px;
  text-align: center;
  font-family: unset;

  &:hover {
    color: #bb955e;
  }
`

const HelpText = styled.p``

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
`

const PurchaseLink = styled.div`
  font-family: 'Alegreya Sans', sans-serif, monospace;
  text-transform: none;
  color: #ddd;
`

const Guide: React.FC = () => {
  const { t } = useTranslation()
  const cache = useCache()
  const [tabIndex, setTabIndex] = useState(0)

  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />)

  const { totalRunes, totalRunewords } = cache.stats

  const referer = Cookies.get(`referer`)

  return (
    <Page>
      <BigCard>
        {referer ? (
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
                  window.scrollTo(0, 0)
                }}>
                View {referer}'s Profile
                <OpenNewIcon color="white" ml="4px" />
              </Button>
            </Flex>
          </CardBody>
        ) : null}
        <CardBody>
          <BoxHeading as="h2" size="xl">
            {t('Evolution Tutorial')}
          </BoxHeading>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Card>
              <ButtonMenu activeIndex={tabIndex} scale="md" onItemClick={(index) => setTabIndex(index)}>
                <ButtonMenuItem>General</ButtonMenuItem>
                <ButtonMenuItem>Objects</ButtonMenuItem>
                <ButtonMenuItem>Game Modes</ButtonMenuItem>
              </ButtonMenu>
            </Card>
            <br />
            <br />
          </Flex>
          {tabIndex === 0 ? (
            <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
              {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
                How To Play
                </Heading> */}
              <Heading color="contrast" size="lg" style={{ textAlign: 'left', marginTop: 20 }}>
                1. Explore and avoid other players
              </Heading>
              <br />
              <HelpText>
                You'll start as a dragonling, that can fly around the islands and consume sprite to get stronger.
                <br />
                But watch out for other players, or they might kill you!
              </HelpText>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ textAlign: 'left', marginTop: 20 }}>
                2. Consume sprites to gain energy
                {/* <br />
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span> */}
              </Heading>
              <br />
              <HelpText>
                When you consume a sprite, you gain some energy. When your energy bar is full, you evolve.
                <br />
                <br />
                Dragonling -&gt; Whelp -&gt; Drake
                <br />
                <br />
                When your energy is depleted, you unevolve.
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ textAlign: 'left', marginTop: 20 }}>
                3. Find rewards
                {/* <br />
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span> */}
              </Heading>
              <br />
              <HelpText>
                If you are more evolved than another player, you can kill them. If they are more evolved than you, they
                kill you. If you die, you lose some of your points, which are spawned as an orb where you died (10
                seconds later). You have 5 seconds of immunity.
                <br />
                <br />
                Kills = +X points per evolve level
                <br />
                Items = +X points each
                <br />
                Evolves = +X points each
                <br />
                Sprites = +X points each
                <br />
                <br />
                The round restarts every 5 minutes, and the points per kill/item/evolve/sprite changes. The leader wins
                the main prize (shown at top). The top 10 get a consolidation amount.
                <br />
                <br />
                1st = 100%
                <br />
                2nd = 25%
                <br />
                3rd = 15%
                <br />
                4th-10th = 5%
                <br />
                <br />
                Additionally, random rune and runeword items spawn around the map every ~10 seconds.
                <br />
                <br />
                The amount of the rewards changes each round, and is based on the # of legitimate players in the game.
              </HelpText>
              <br />
              <br />
              <Button
                onClick={() => {
                  window.scrollTo(0, 0)
                  setTabIndex(1)
                }}>
                Learn About Objects
              </Button>
            </Flex>
          ) : null}
          {tabIndex === 2 ? (
            <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
              {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
                How To Play
                </Heading> */}
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                What Are Game Modes?
              </Heading>
              <br />
              <HelpText>
                Every round, the game mode changes randomly. Each game mode has a different configuration, giving
                different types of players a chance to win if they learn the mechanics.
              </HelpText>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Standard
              </Heading>
              <br />
              <HelpText>
                The default experience.
                <br />
                <br />
                Points Per Evolve: 1
                <br />
                Points Per Powerup: 1
                <br />
                Points Per Kill: 20
                <br />
                Points Per Reward: 5
              </HelpText>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Let's Be Friends
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is NOT to kill anybody. And that means avoiding other players while
                collecting points. Death Orbs do not spawn.
                <br />
                <br />
                Points Per Kill: -200
                <br />
                Orb Delay Seconds: 9999 (Death Orbs do not spawn)
                <br />
                Orb On Death Percent: 0
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/Kyhhoz9kIok"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Deathmatch
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to get as many kills as possible. Death Orbs do not spawn. Everything
                else is worth minimal points. Each kill is worth 300 points <strong>per evolution level</strong>. So if
                the player was a Whelp, then they would be worth 600 points, versus a Dragonling being worth 300.
                <br />
                <br />
                Points Per Kill: 300
                <br />
                Orb On Death Percent: 0
                <br />
                Orb Delay Seconds: 9999 (Death Orbs do not spawn)
                <br />
                Points Per Evolve: 0
                <br />
                Points Per Powerup: 1
                <br />
                Points Per Reward: 0
                <br />
                Base Speed: 4
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/E72vmZY5YVQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Orb Master
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to get as many Death Orbs as possible. Try to kill players and get their
                orbs, or sneak up on somebody elses kill, perhaps.
                <br />
                <br />
                Orb On Death Percent: 25
                <br />
                Orb Delay Seconds: 3
                <br />
                Points Per Orb: 200
                <br />
                Points Per Evolve: 0
                <br />
                Points Per Reward: 0
                <br />
                Points Per Kill: 0
                <br />
                Orb Cut off Seconds: 0 (Death Orbs spawn all the way until round ends. Normally don't spawn last
                minute.)
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/ZKIFgZxFxXw"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Sprite Leader
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to consume as many sprites as possible. Death Orbs do not spawn.
                <br />
                <br />
                Sprites Per Player Count: 20
                <br />
                Decay Power: 7
                <br />
                Points Per Evolve: 0
                <br />
                Points Per Powerup: 1
                <br />
                Points Per Reward: 0
                <br />
                Points Per Kill: 0
                <br />
                Orb Delay Seconds: 9999 (Death Orbs do not spawn)
                <br />
                Orb On Death Percent: 0
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/pC3Da-E3LIg"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Fast Drake
              </Heading>
              <br />
              <HelpText>
                The point of this to get the final evolution: Drake. It's difficult because life decays quickly, but if
                you do it you'll blaze through opponents. Death Orbs do not spawn.
                <br />
                <br />
                Avatar Speed Multiplier Drake: 1.5
                <br />
                Decay Power: 4
                <br />
                Immunity Seconds: 20 (Initial immunity bubble lasts longer.)
                <br />
                Orb On Death Percent: 0
                <br />
                Orb Timeout Seconds: 9999 (Death Orbs do not spawn)
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/r-3wR-h2CoI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Bird Eye
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to enjoy a different point of view, the Bird's Eye view.
                <br />
                <br />
                Camera Size: 6
                <br />
                Base Speed: 4
                <br />
                Decay Power: 2.8
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Evolution
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to evolve as much as possible.
                <br />
                <br />
                Points Per Evolve: 10
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/B8T3D-phXcE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Friendly Reverse
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to not kill other players, but you automatically gain life, making that
                difficult, so watch out!
                <br />
                <br />
                Points Per Kill: -200
                <br />
                Orb Timeout Seconds: 9999 (Death Orbs do not spawn)
                <br />
                Orb On Death Percent: 0
                <br />
                Points Per Evolve: 25
                <br />
                Decay Power: -3 (Life gained automatically)
                <br />
                Avatar Decay Power (Dragonling): 4
                <br />
                Avatar Decay Power (Whelp): 3
                <br />
                Avatar Decay Power (Drake): 2
                <br />
                Sprite Life Multiplier: -1
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Reverse Evolve
              </Heading>
              <br />
              <HelpText>
                In this game mode you start in the last evolution: Drake. You're slow, and it would be nice to devolve
                into faster forms so you can get more points.
                <br />
                <br />
                Start Avatar: 2
                <br />
                Decay Power: -3 (Life gained automatically)
                <br />
                Avatar Decay Power (Dragonling): 4
                <br />
                Avatar Decay Power (Whelp): 3
                <br />
                Avatar Decay Power (Drake): 2
                <br />
                Sprite Life Multiplier: -1 (sprites take life instead)
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Marco Polo
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to take a step back and enjoy the mystery of who's around you. You're
                zoomed in, and everybody moves the same speed.
                <br />
                <br />
                Camera Size: 2
                <br />
                Base Speed: 2.5
                <br />
                Decay Power: 1.4
                <br />
                Avatar Decay Power (Dragonling): 1
                <br />
                Avatar Decay Power (Whelp): 1
                <br />
                Avatar Decay Power (Drake): 1
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Dynamic Decay
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to increase the life decay when there's more players that have evolved
                into Drakes. That way only the best will be able to keep the Drake form.
                <br />
                <br />
                Points Per Evolve: 1
                <br />
                Points Per Powerup: 1
                <br />
                Points Per Kill: 20
                <br />
                Points Per Reward: 5
                <br />
                Dynamic Decay Power: true
                <br />
                Decay Power Per Max Evolved Players: 1
              </HelpText>
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Leadercap
              </Heading>
              <br />
              <HelpText>
                The point of this game mode is to kill the player who won the last round. He's slower and he's worth
                more points.
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/iDqBYnn4DQE"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Lazy Mode
              </Heading>
              <br />
              <HelpText>This game mode is Standard, but the first 2 evolutions are same speed.</HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/6CyVlVwKigI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Mixed Modes
              </Heading>
              <br />
              <HelpText>These are mixed modes that we're experimenting with using as the new standard.</HelpText>
            </Flex>
          ) : null}
          {tabIndex === 1 ? (
            <Flex flexDirection="column" alignItems="left" mb="8px" justifyContent="start">
              {/* <Heading as="h2" size="xl" color="#fff" mb="24px">
                How To Play
                </Heading> */}
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Sprites
              </Heading>
              <br />
              <HelpText>
                Picking these up will increase your life. Except in these modes: Friendly Reverse, Reverse Evolve
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/-GFyZrGsOUI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Death Orbs
              </Heading>
              <br />
              <HelpText>
                These red orbs drop a few seconds after a player dies, and is worth 25% of their points. In most mosts,
                it appears 10 seconds later. In some modes it doesn't appear at all, or it appears quicker.
              </HelpText>
              <br />
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/edN16psYXnY"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>
              <br />
              <br />
              <br />
              <br />
              <Heading color="contrast" size="lg" style={{ marginTop: 20 }}>
                Runes
              </Heading>
              <br />
              <HelpText>
                Picking these up is worth a certain amount of rune rewards. These rewards accumulate and will be sent to
                your wallet when you have more than 1 (sent weekly) or more than 5 (sent daily).
              </HelpText>
              <br />
              <br />
              <Button
                onClick={() => {
                  window.scrollTo(0, 0)
                  setTabIndex(2)
                }}>
                Learn About Game Modes
              </Button>
            </Flex>
          ) : null}
        </CardBody>
      </BigCard>
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
  )
}

export default Guide
