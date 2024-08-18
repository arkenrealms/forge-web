import React, { lazy, Suspense, useContext, useCallback, useEffect, useState, useRef, useLayoutEffect } from 'react';
import styled, { css } from 'styled-components';
import { Skeleton } from '~/ui';
import useIntersectionObserver from '~/hooks/useIntersectionObserver';
import useBrand from '~/hooks/useBrand';
import Page from '~/components/layout/Page';
import Swap from '~/components/Swap';

const zzz = styled.div``;

const MarketComponent = lazy(() => import(/* webpackChunkName: "MarketComponent" */ '~/components/Market'));
const TournamentComponent = lazy(() => import(/* webpackChunkName: "TournamentComponent" */ '~/components/Tournament'));
const RoadmapComponent = lazy(() => import(/* webpackChunkName: "RoadmapComponent" */ '~/components/Roadmap'));
const CraftComponent = lazy(() => import(/* webpackChunkName: "CraftComponent" */ '~/components/Craft'));
const TransmuteComponent = lazy(() => import(/* webpackChunkName: "TransmuteComponent" */ '~/components/Transmute'));
const NexusComponent = lazy(() => import(/* webpackChunkName: "NexusComponent" */ '~/components/Nexus'));
const TokenomicsComponent = lazy(() => import(/* webpackChunkName: "TokenomicsComponent" */ '~/components/Tokenomics'));
const AboutComponent = lazy(() => import(/* webpackChunkName: "AboutComponent" */ '~/components/About'));
const StatsComponent = lazy(() => import(/* webpackChunkName: "StatsComponent" */ '~/components/Stats'));
const EvolutionComponent = lazy(() => import(/* webpackChunkName: "EvolutionComponent" */ '~/components/Evolution'));
const Evolution2Component = lazy(() => import(/* webpackChunkName: "Evolution2Component" */ '~/components/Evolution2'));
const ServicesComponent = lazy(() => import(/* webpackChunkName: "ServicesComponent" */ '~/components/Services'));
const RaidComponent = lazy(() => import(/* webpackChunkName: "RaidComponent" */ '~/components/Raid'));
const InfiniteComponent = lazy(() => import(/* webpackChunkName: "InfiniteComponent" */ '~/components/Infinite'));
const SanctuaryComponent = lazy(() => import(/* webpackChunkName: "SanctuaryComponent" */ '~/components/Sanctuary'));
const GuardiansComponent = lazy(() => import(/* webpackChunkName: "GuardiansComponent" */ '~/components/Guardians'));
const SwapComponent = lazy(() => import(/* webpackChunkName: "SwapComponent" */ '~/components/Swap'));
const RuneComponent = lazy(() => import(/* webpackChunkName: "RuneComponent" */ '~/components/Rune'));
const LiveComponent = lazy(() => import(/* webpackChunkName: "LiveComponent" */ '~/components/Live'));
const HomeComponent = lazy(() => import(/* webpackChunkName: "HomeComponent" */ '~/components/Home'));
const CharactersComponent = lazy(() => import(/* webpackChunkName: "CharactersComponent" */ '~/components/Characters'));
const GuildsComponent = lazy(() => import(/* webpackChunkName: "GuildsComponent" */ '~/components/Guilds'));
const DaoComponent = lazy(() => import(/* webpackChunkName: "DaoComponent" */ '~/components/DAO'));
const AiComponent = lazy(() => import(/* webpackChunkName: "AiComponent" */ '~/components/AI'));

const Home: React.FC<any> = ({ active, match }) => {
  const [loaded, setLoaded] = useState(false);
  const { brand } = useBrand();
  const refMarketSection = useRef(null);
  const isMarketSectionVisible = useIntersectionObserver(refMarketSection);

  const refTournamentSection = useRef(null);
  const isTournamentSectionVisible = useIntersectionObserver(refTournamentSection);

  const refRoadmapSection = useRef(null);
  const isRoadmapSectionVisible = useIntersectionObserver(refRoadmapSection);

  const refCraftSection = useRef(null);
  const isCraftSectionVisible = useIntersectionObserver(refCraftSection);

  // const refTransmuteSection = useRef(null)
  // const isTransmuteSectionVisible = useIntersectionObserver(refTransmuteSection)

  // const refNexusSection = useRef(null)
  // const isNexusSectionVisible = useIntersectionObserver(refNexusSection)

  const refTokenomicsSection = useRef(null);
  const isTokenomicsSectionVisible = useIntersectionObserver(refTokenomicsSection);

  const refAboutSection = useRef(null);
  const isAboutSectionVisible = useIntersectionObserver(refAboutSection);

  const refStatsSection = useRef(null);
  const isStatsSectionVisible = useIntersectionObserver(refStatsSection);

  const refEvolutionSection = useRef(null);
  const isEvolutionSectionVisible = useIntersectionObserver(refEvolutionSection);

  const refServicesSection = useRef(null);
  const isServicesSectionVisible = useIntersectionObserver(refServicesSection);

  const refRaidSection = useRef(null);
  const isRaidSectionVisible = useIntersectionObserver(refRaidSection);

  const refInfiniteSection = useRef(null);
  const isInfiniteSectionVisible = useIntersectionObserver(refInfiniteSection);

  const refSanctuarySection = useRef(null);
  const isSanctuarySectionVisible = useIntersectionObserver(refSanctuarySection);

  const refGuardiansSection = useRef(null);
  const isGuardiansSectionVisible = useIntersectionObserver(refGuardiansSection);

  const refSwapSection = useRef(null);
  const isSwapSectionVisible = useIntersectionObserver(refSwapSection);

  const refRuneSection = useRef(null);
  const isRuneSectionVisible = useIntersectionObserver(refRuneSection);

  const refLiveSection = useRef(null);
  const isLiveSectionVisible = useIntersectionObserver(refLiveSection);

  const refDaoSection = useRef(null);
  const isDaoSectionVisible = useIntersectionObserver(refDaoSection);

  const refAiSection = useRef(null);
  const isAiSectionVisible = useIntersectionObserver(refAiSection);

  const refHomeSection = useRef(null);
  const isHomeSectionVisible = useIntersectionObserver(refHomeSection);

  const refCharactersSection = useRef(null);
  const isCharactersSectionVisible = useIntersectionObserver(refCharactersSection);

  const refGuildsSection = useRef(null);
  const isGuildsSectionVisible = useIntersectionObserver(refGuildsSection);

  useLayoutEffect(function () {
    if (!window?.navigator?.userAgent) return;
    if (window.navigator.userAgent === 'ReactSnap') return;

    setLoaded(true);
  }, []);

  // if (!loaded) return <></>
  // if (!active) return <></>

  return <div css={css`padding-top: 30px;`}><Swap showMenu /></div>;

  return (
    <div>
      {!loaded ? <div style={{ height: 5000 }}></div> : null}
      {brand === 'evolution' ? (
        <div
          ref={refEvolutionSection}
          css={css`
            min-height: 2000px;
            margin: 0 auto 100px auto;
          `}>
          {isEvolutionSectionVisible ? (
            <Suspense fallback={<Skeleton height="300px" m="30px" />}>
              <Evolution2Component />
            </Suspense>
          ) : null}
        </div>
      ) : null}
      {brand === 'sanctuary' ? (
        <div
          ref={refSanctuarySection}
          css={css`
            min-height: 2000px;
            margin: 0 auto 100px auto;
          `}>
          {isSanctuarySectionVisible ? (
            <Suspense fallback={<Skeleton height="300px" m="30px" />}>
              <SanctuaryComponent />
            </Suspense>
          ) : null}
        </div>
      ) : null}
      {brand === 'infinite' ? (
        <div
          ref={refInfiniteSection}
          css={css`
            min-height: 2000px;
            margin: 0 auto 100px auto;
          `}>
          {isInfiniteSectionVisible ? (
            <Suspense fallback={<Skeleton height="300px" m="30px" />}>
              <InfiniteComponent />
            </Suspense>
          ) : null}
        </div>
      ) : null}
      {brand === 'guardians' ? (
        <div
          ref={refGuardiansSection}
          css={css`
            min-height: 2000px;
            margin: 0 auto 100px auto;
          `}>
          {isGuardiansSectionVisible ? (
            <Suspense fallback={<Skeleton height="300px" m="30px" />}>
              <GuardiansComponent />
            </Suspense>
          ) : null}
        </div>
      ) : null}
      {brand === 'raid' ? (
        <div
          ref={refRaidSection}
          css={css`
            min-height: 2000px;
            margin: 0 auto 100px auto;
          `}>
          {isRaidSectionVisible ? (
            <Suspense fallback={<Skeleton height="300px" m="30px" />}>
              <RaidComponent />
            </Suspense>
          ) : null}
        </div>
      ) : null}
      {brand === 'w4' ? (
        <>
          <div
            ref={refServicesSection}
            css={css`
              min-height: 2000px;
              margin: 0 auto 100px auto;
            `}>
            {isServicesSectionVisible ? (
              <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                <ServicesComponent />
              </Suspense>
            ) : null}
          </div>
        </>
      ) : null}
      {brand === 'arken' ? (
        <>
          <div
            ref={refEvolutionSection}
            css={css`
              min-height: 2000px;
              margin: 0 auto 100px auto;
            `}>
            {isEvolutionSectionVisible ? (
              <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                <EvolutionComponent />
              </Suspense>
            ) : null}
          </div>
          <div
            ref={refLiveSection}
            css={css`
              min-height: 1000px;
              margin: 0 auto 100px auto;
            `}>
            {isLiveSectionVisible ? (
              <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                <LiveComponent />
              </Suspense>
            ) : null}
          </div>
          <div
            ref={refHomeSection}
            css={css`
              min-height: 4000px;
              margin: 0 auto 100px auto;
            `}>
            {isHomeSectionVisible ? (
              <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                <HomeComponent match={match} />
              </Suspense>
            ) : null}
          </div>
          <Page style={{ zIndex: 2, position: 'relative', maxWidth: 'none', width: '100%' }}>
            {/* <iframe
              title="Twitch Streams"
              src="https://player.twitch.tv/?channel=arkenrealms&parent=localhost&parent=arken.gg&parent=beta.arken.gg"
              height="<height>"
              width="<width>"
              allowFullScreen
              style={{ width: '100%', height: '500px', margin: '0 auto 30px auto' }}
            ></iframe> */}
            {/* <div
              ref={refEvolutionSection}
              css={css`
                min-height: 500px;
                margin: 0 auto 100px auto;
              `}
            >
              {isEvolutionSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <EvolutionComponent />
                </Suspense>
              ) : null}
            </div> */}
            <div
              ref={refAboutSection}
              css={css`
                min-height: 500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isAboutSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <AboutComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refSwapSection}
              css={css`
                min-height: 300px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isSwapSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <SwapComponent showMenu />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refCharactersSection}
              css={css`
                min-height: 500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isCharactersSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <CharactersComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refRoadmapSection}
              css={css`
                min-height: 300px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isRoadmapSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <RoadmapComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refCraftSection}
              css={css`
                min-height: 3000px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isCraftSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <CraftComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refMarketSection}
              css={css`
                min-height: 1500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isMarketSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <MarketComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refTokenomicsSection}
              css={css`
                min-height: 1500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isTokenomicsSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <TokenomicsComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refRuneSection}
              css={css`
                min-height: 1500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isRuneSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <RuneComponent match={match} />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refStatsSection}
              css={css`
                min-height: 3000px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isStatsSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <StatsComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refDaoSection}
              css={css`
                min-height: 2500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isDaoSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <DaoComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refAiSection}
              css={css`
                min-height: 500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isAiSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <AiComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refGuildsSection}
              css={css`
                min-height: 2500px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isGuildsSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <GuildsComponent />
                </Suspense>
              ) : null}
            </div>
            <div
              ref={refTournamentSection}
              css={css`
                min-height: 5000px;
                max-width: 1200px;
                margin: 0 auto 100px auto;
              `}>
              {isTournamentSectionVisible ? (
                <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                  <TournamentComponent />
                </Suspense>
              ) : null}
            </div>
            {/* <div ref={refNexusSection} css={css`min-height: 100vh; margin-bottom: 100px;`}>
                {isNexusSectionVisible ? (
                  <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                    <NexusComponent />
                  </Suspense>
                ) :  null}
              </div>
              <div ref={refTransmuteSection} css={css`min-height: 100vh; margin-bottom: 100px;`}>
                {isTransmuteSectionVisible ? (
                  <Suspense fallback={<Skeleton height="300px" m="30px" />}>
                    <TransmuteComponent />
                  </Suspense>
                ) :  null}
              </div> */}
            {/* <BottomCTA /> */}
            {/* <br />
            <br />
            <BigCard>
              <CardBody>
                <BoxHeading as="h2" size="xl">
                  {t('Vast World')}
                </BoxHeading>
                <p>
                  Imagine a digital world where your NFTs adapt to the game you’re playing. Equip your hero with unique Rune
                  Words with varying attributes to make them more powerful in battle, increase magic find, or improve
                  farming and merchant abilities.
                </p>
                <br />
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <iframe title="World" src="https://explore.arken.gg/" style={{width: 600, height: 400}} />
                </Flex>
              </CardBody>
            </BigCard> */}
            {/* <PTBTemplateContext
            template={PTBTemplateMaterial}
            styleOptions={barStyleOptions}
          >
            <PTBListBox mode={mode}>
              {roadmap.map((shipment, index) => (
                <ProcessTimelineBar
                  headerDetailPage={HeaderDetails}
                  key={index}
                  id={index}
                  title="SHIPMENT"
                  detail={shipment.shipment}
                  mode="large"
                  scrollableEvents="true"
                  eventWidth={150}
                  status={shipment.listDetails.status}
                  headerDetailsId={shipment.headerDetails}
                >
                <ProcessTimelineBarEvent
                  title="OPENED"
                  date={shipment.statusDates.opened}
                  color="#7699c2"
                  expandedHeight={280}
                  icon={CheckmarkCircleIcon}
                >
                  <ShipmentPackages />
                </ProcessTimelineBarEvent>
                <ProcessTimelineBarEvent
                  title="RECEIVED"
                  date={shipment.statusDates.received}
                  color="#6583a6"
                  expandedHeight={300}
                  icon={CheckmarkCircleIcon}
                >
                  <MaterialReceipt />
                </ProcessTimelineBarEvent>
                <ProcessTimelineBarEvent
                  title="PACKED"
                  date={shipment.statusDates.packed}
                  color="#4a75a1"
                  expandedHeight={400}
                  icon={CheckmarkCircleIcon}
                />
                <ProcessTimelineBarEvent
                  title="SHIPPED"
                  date={shipment.statusDates.shipped}
                  color="#3f658a"
                  expandedHeight={160}
                  icon={CheckmarkCircleIcon}
                />
                <ProcessTimelineBarEvent
                  title="IN TRANSIT"
                  date={shipment.statusDates.inTransit}
                  color="#325373"
                  expandedHeight={200}
                  icon={CheckmarkCircleIcon}
                />
                <ProcessTimelineBarEvent
                  title="ARRIVED"
                  date={shipment.statusDates.arrived}
                  color="#1e4566"
                  expandedHeight={270}
                  icon={CheckmarkCircleIcon}
                >
                  <ShipmentPackages />
                </ProcessTimelineBarEvent>
                <ProcessTimelineBarEvent
                  title="TEST 1"
                  date={shipment.statusDates.inTransit}
                  color="#325373"
                  expandedHeight={200}
                  icon={CheckmarkCircleIcon}
                />
                <ProcessTimelineBarEvent
                  title="TEST 2"
                  date={shipment.statusDates.arrived}
                  color="#1e4566"
                  expandedHeight={270}
                  icon={CheckmarkCircleIcon}
                >
                  <ShipmentPackages />
                </ProcessTimelineBarEvent>
                <ProcessTimelineBarEvent
                  title="TEST 3"
                  date={shipment.statusDates.arrived}
                  color="#1e4566"
                  expandedHeight={270}
                  icon={CheckmarkCircleIcon}
                >
                  <ShipmentPackages />
                </ProcessTimelineBarEvent>
                </ProcessTimelineBar>
              ))}
            </PTBListBox>
          </PTBTemplateContext> */}

            {/* <hr />
              <BoxHeading id="newsletter" as="h2" size="xl" style={{textAlign: 'center', marginTop: 15}}>
                {t('Newsletter')}
              </BoxHeading>
              <hr />
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <BigCard id="newsletter">
                <CardBody>
                  <Newsletter />
                </CardBody>
              </BigCard>
            </Flex> */}
            {/* <hr />
            <Flex flexDirection="column" alignItems="center" justifyContent="center" p="30px">
                  <BoxHeading as="h2" size="xl">
                    {t('Partners')}
                  </BoxHeading>
                  <br />
                  <Partners>
                    <div></div>
                    <a
                      href="https://www.binance.com/en/nft/shopWindow?uid=67515745"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{textAlign: 'center'}}
                    >
                      <img src="/images/other/binancenft.png" alt="Binance NFT"  />
                    </a>
                    <a href="https://raid.alturanft.com/collection/0x652010d7a2c983802bf84a0ea3f9c850880af030" rel="noreferrer noopener" target="_blank" style={{textAlign: 'center'}}>
                      <img src="/images/other/altura.png" alt="Altura" style={{ width: 110 }} />
                    </a>
                    <a href="https://raid.babylons.io/rune" rel="noreferrer noopener" target="_blank" style={{textAlign: 'center'}}>
                      <img src="/images/other/babylons.png" alt="Babylons"  style={{ height: 40 }} />
                    </a>
                    <a
                      href="https://treasureland.market/assets?contract=0xe97a1b9f5d4b849f0d78f58adb7dd91e90e0fb40&chain_id=56"
                      rel="noreferrer noopener"
                      target="_blank"
                      style={{textAlign: 'center'}}
                    >
                      <img src="/images/other/treasureland.svg" alt="Treasureland" style={{ filter: 'invert(1)' }} />
                    </a>
                  </Partners>
            </Flex>*/}
            {/* <BigCard>
              <CardBody>
                <BottomButtons>
                  <Button onClick={onPresentPurchaseModal} style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}>
                    {t('Buy Rune')}
                  </Button>

                  <Button
                    as={RouterLink}
                    to="/raid"
                    style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
                    onClick={() => {
                      window.scrollTo(0, 0)
                    }}
                  >
                    {t('Open App')}
                  </Button>
                  <Button
                    as={RouterLink}
                    to="/updates"
                    style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
                    onClick={() => {
                      window.scrollTo(0, 0)
                    }}
                  >
                    {t('Patch Notes')}
                  </Button>
                  <Button
                    as="a"
                    href="https://ArkenRealms.medium.com/ready-player-one-df8cc19741e4"
                    style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    {t('Our Vision')}
                  </Button>
                </BottomButtons>
              </CardBody>
            </BigCard> */}
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
            {/* <div id="moon"></div> */}
          </Page>
        </>
      ) : null}
    </div>
  );
};

export default Home;
