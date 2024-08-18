import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GiCog } from 'react-icons/gi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper'
import styled, { css } from 'styled-components'
import Page from '~/components/layout/Page'
import Loader from '~/components/Loader'
import PlayerAction from '~/components/PlayerAction'
import useLive from '~/hooks/useLive'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
//import '~swiper/swiper.min.css'
//import '~swiper/modules/navigation/navigation.min.css' // Navigation module
//import '~swiper/modules/pagination/pagination.min.css' // Pagination module
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints'
import { BaseLayout, Button, Card, CardBody, Heading, Skeleton, Text, Toggle } from '~/ui'

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div:first-child {
      grid-column: span 7;
    }
    & > div:last-child {
      grid-column: span 5;
      // zoom: 0.8;
    }
  }
`

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
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 200px;

  ${Text} {
    margin-left: 8px;
  }
`

const LiveInner = () => {
  const { t } = useTranslation()
  const {
    filters,
    toggleFilter,
    showSettings,
    setShowSettings,
    playerActions,
    playerNotices,
    isRuneRoyale,
    isRuneRoyalePaused,
    runeRoyaleStandings,
  } = useLive()
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints()
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl

  return (
    <>
      <Swiper
        // install Swiper modules
        // direction={"vertical"}
        modules={[Navigation, Pagination, Scrollbar]}
        spaceBetween={5}
        // slidesPerView={isMobile ? 1 : 2}
        navigation
        slidesPerView={'auto'}
        // mousewheel={{
        //   forceToAxis: true,
        // }}
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={() => console.log('slide change')}
        style={{ margin: '0 auto 30px auto' }}>
        <SwiperSlide key={'evolution-asia'} style={{ height: '100%', width: '1280px', position: 'relative' }}>
          <iframe
            key="twitch2"
            title="Twitch Streams"
            src="https://player.twitch.tv/?channel=binzymon&parent=arken.gg&parent=beta.arken.gg&parent=localhost"
            height="<height>"
            width="<width>"
            allowFullScreen
            style={{ width: '100%', height: '720px', margin: '0 auto 30px auto' }}></iframe>
        </SwiperSlide>
        <SwiperSlide key={'evolution-na'} style={{ height: '100%', width: '1280px', position: 'relative' }}>
          <iframe
            key="twitch1"
            title="Twitch Streams"
            src="https://player.twitch.tv/?channel=runeevolution&parent=arken.gg&parent=beta.arken.gg&parent=localhost"
            height="<height>"
            width="<width>"
            allowFullScreen
            style={{ width: '100%', height: '720px', margin: '0 auto 30px auto' }}></iframe>
        </SwiperSlide>
        <SwiperSlide key={'rune-live'} style={{ height: '100%', width: '1280px', position: 'relative' }}>
          <iframe
            key="twitch3"
            title="Twitch Streams"
            src="https://player.twitch.tv/?channel=arkenrealms&parent=arken.gg&parent=beta.arken.gg&parent=localhost"
            height="<height>"
            width="<width>"
            allowFullScreen
            style={{ width: '100%', height: '720px', margin: '0 auto 30px auto' }}></iframe>
        </SwiperSlide>
      </Swiper>
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
          <Card style={{ width: '100%', overflow: 'visible' }}>
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Rune Live')} <Loader size="24px" />
              <Button
                variant="text"
                scale="md"
                onClick={() => setShowSettings(!showSettings)}
                css={css`
                  position: absolute;
                  top: 0;
                  right: 0;
                `}>
                <GiCog
                  css={css`
                    width: 20px;
                    height: 20px;
                  `}
                />
              </Button>
            </Heading>
            {showSettings ? (
              <>
                <hr />
                <div
                  css={css`
                    padding: 15px;
                  `}>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('General')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('player-active')}
                        onChange={() => toggleFilter('player-active')}
                        scale="sm"
                      />
                      <Text> {t('Player Active')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('player-inactive')}
                        onChange={() => toggleFilter('player-inactive')}
                        scale="sm"
                      />
                      <Text> {t('Player Inactive')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('item-craft')}
                        onChange={() => toggleFilter('item-craft')}
                        scale="sm"
                      />
                      <Text> {t('Item Crafting')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('item-transfer')}
                        onChange={() => toggleFilter('item-transfer')}
                        scale="sm"
                      />
                      <Text> {t('Item Transfer')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('item-transmute')}
                        onChange={() => toggleFilter('item-transmute')}
                        scale="sm"
                      />
                      <Text> {t('Item Transmute')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('item-disenchant')}
                        onChange={() => toggleFilter('item-disenchant')}
                        scale="sm"
                      />
                      <Text> {t('Item Disenchant')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('character-create')}
                        onChange={() => toggleFilter('character-create')}
                        scale="sm"
                      />
                      <Text> {t('Character Creation')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('character-transfer')}
                        onChange={() => toggleFilter('character-transfer')}
                        scale="sm"
                      />
                      <Text> {t('Character Transfer')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('guild-join')}
                        onChange={() => toggleFilter('guild-join')}
                        scale="sm"
                      />
                      <Text> {t('Guild Joins')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('reward-claim')}
                        onChange={() => toggleFilter('reward-claim')}
                        scale="sm"
                      />
                      <Text> {t('Reward Claims')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('achievement')}
                        onChange={() => toggleFilter('achievement')}
                        scale="sm"
                      />
                      <Text> {t('Achievements')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Market')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('market-buy')}
                        onChange={() => toggleFilter('market-buy')}
                        scale="sm"
                      />
                      <Text> {t(' Buys')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('market-list')}
                        onChange={() => toggleFilter('market-list')}
                        scale="sm"
                      />
                      <Text> {t('Listings')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Arken: Evolution Isles')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('evolution')}
                        onChange={() => toggleFilter('evolution')}
                        scale="sm"
                      />
                      <Text> {t('1.0')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('evolution1-winner')}
                        onChange={() => toggleFilter('evolution1-winner')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Game Wins')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('evolution')}
                        onChange={() => toggleFilter('evolution')}
                        scale="sm"
                      />
                      <Text> {t('2.0')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Arken: Runic Raids')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle checked={filters.includes('raid1')} onChange={() => toggleFilter('raid')} scale="sm" />
                      <Text> {t('1.0')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-equipped')}
                        onChange={() => toggleFilter('raid1-equipped')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Equips')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-unequipped')}
                        onChange={() => toggleFilter('raid1-unequipped')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Unequips')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-burn')}
                        onChange={() => toggleFilter('raid1-burn')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Burns')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-bonus')}
                        onChange={() => toggleFilter('raid1-bonus')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Bonuses')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-hidden-pool')}
                        onChange={() => toggleFilter('raid1-hidden-pool')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Hidden Pools')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('raid1-fee')}
                        onChange={() => toggleFilter('raid1-fee')}
                        scale="sm"
                      />
                      <Text> {t('1.0 - Fees')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('evolution')}
                        onChange={() => toggleFilter('evolution')}
                        scale="sm"
                      />
                      <Text> {t('2.0')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Arken: Infinite Arena')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('infinite')}
                        onChange={() => toggleFilter('infinite')}
                        scale="sm"
                      />
                      <Text> {t('1.0')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Arken: Guardians Unleashed')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('infinite')}
                        onChange={() => toggleFilter('infinite')}
                        scale="sm"
                      />
                      <Text> {t('1.0')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Arken: Heart of the Oasis')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('infinite')}
                        onChange={() => toggleFilter('infinite')}
                        scale="sm"
                      />
                      <Text> {t('1.0')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                  <Heading as="h3" size="md" style={{ marginTop: 15 }}>
                    {t('Admin')}
                  </Heading>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle checked={filters.includes('admin')} onChange={() => toggleFilter('admin')} scale="sm" />
                      <Text> {t('General')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle
                        checked={filters.includes('moderator-action')}
                        onChange={() => toggleFilter('moderator-action')}
                        scale="sm"
                      />
                      <Text> {t('Moderator Actions')}</Text>
                    </ToggleWrapper>
                  </ViewControls>
                </div>
              </>
            ) : null}
            <hr />
            <CardBody style={{ overflow: 'visible', padding: 10 }}>
              <p>Welcome, watch the Arken Realms evolve in real time.</p>
              <br />
              <div
                css={css`
                  overflow-y: auto;
                  max-height: 400px;
                `}>
                {!playerActions ? <Skeleton height="80px" mb="16px" /> : null}
                {[...Array(200).keys()].map((index) => (
                  <motion.div
                    key={playerActions?.[index]?.id || index}
                    initial={{ opacity: 0 }}
                    animate={playerActions?.[index]?.visible ? 'unfaded' : 'faded'}
                    variants={{
                      faded: { opacity: 0 },
                      unfaded: { opacity: 1 },
                    }}
                    transition={{ duration: 2 }}>
                    <PlayerAction
                      action={playerActions?.[index]?.data}
                      createdAt={playerActions?.[index]?.data.createdAt}
                      replaceCharacterClasses={false}
                    />
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card style={{ width: '100%', overflow: 'visible' }}>
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
              {t('Highlights')}
            </Heading>
            <hr />
            <CardBody style={{ overflow: 'visible', padding: 10 }}>
              <div
                css={css`
                  overflow-y: auto;
                  max-height: 461px;
                `}>
                {/* * X crafted 10 runewords * Y joined Mage Isles * Z earned achievement * X is playing Infinite * Y transmuted
              X */}
                {!playerNotices ? <Skeleton height="80px" mb="16px" /> : null}
                {[...Array(200).keys()].map((index) => (
                  <motion.div
                    key={playerNotices?.[index]?.id || index}
                    initial={{ opacity: 0 }}
                    animate={playerNotices?.[index]?.visible ? 'unfaded' : 'faded'}
                    variants={{
                      faded: { opacity: 0 },
                      unfaded: { opacity: 1 },
                    }}
                    transition={{ duration: 2 }}>
                    <PlayerAction action={playerNotices?.[index]?.data} createdAt={playerNotices?.[index]?.createdAt} />
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Cards>
      </Page>
    </>
  )
}

export default LiveInner
