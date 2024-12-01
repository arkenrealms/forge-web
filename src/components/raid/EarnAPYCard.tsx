import React, { useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { Heading, Card, CardBody, Flex, ArrowForwardIcon, Button, OpenNewIcon, Skeleton, LinkExternal } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import { NavLink } from 'react-router-dom';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { getBalanceNumber } from '~/utils/formatBalance';
import { useRewardPerBlock } from '~/hooks/useRewardPerBlock';
import { useFarmStatus } from '~/hooks/useFarmStatus';
import { useMasterchef } from '~/hooks/useContract';
import symbolMap from '~/utils/symbolMap';
import { PurchaseModal } from '~/components/PurchaseModal';
import { CURRENT_FARM_SYMBOL, NEXT_FARM_SYMBOL, CURRENT_FARM_PAUSED } from '~/config';
import { QuoteToken } from '~/config/constants/types';
import { useBnbPrice, useFarms, useGetApiPrice, useRunePrice } from '~/state/hooks';
import { BLOCKS_PER_YEAR, REWARD_PER_BLOCK, REWARD_BUSD_POOL_PID, OLD_VERSION } from '~/config';

const RainbowLight = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const StyledCardAccent = styled.div`
  background: linear-gradient(
    45deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(255, 154, 0, 1) 10%,
    rgba(208, 222, 33, 1) 20%,
    rgba(79, 220, 74, 1) 30%,
    rgba(63, 218, 216, 1) 40%,
    rgba(47, 201, 226, 1) 50%,
    rgba(28, 127, 238, 1) 60%,
    rgba(95, 21, 242, 1) 70%,
    rgba(186, 12, 248, 1) 80%,
    rgba(251, 7, 217, 1) 90%,
    rgba(255, 0, 0, 1) 100%
  );
  background-size: 300% 300%;
  border-radius: 32px;
  filter: blur(6px);
  position: absolute;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
  body.good-quality & {
    animation: ${RainbowLight} 2s linear infinite;
  }
`;

const StyledFarmStakingCard = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  width: 100%;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 0;
    max-width: none;
  }
`;

const HelpText = styled.p`
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  text-transform: none;
`;

const HelpLinks = styled.div`
  text-align: left;
  width: 100%;
  margin-top: 20px;
  line-height: 1.3rem;

  &,
  div,
  span,
  a {
    font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
    text-transform: none;
    font-size: 0.9rem;
    color: #aaa;
  }
`;

const CardMidContent = styled(Heading).attrs({ size: 'xl' })`
  line-height: 44px;
`;
const EarnAPYCard = () => {
  const { t } = useTranslation();
  const farmsLP = useFarms();
  const runePrice = useRunePrice('RUNE');
  const elPrice = useRunePrice('EL');
  const eldPrice = useRunePrice('ELD');
  const tirPrice = useRunePrice('TIR');
  const nefPrice = useRunePrice('NEF');
  const ithPrice = useRunePrice('ITH');
  const talPrice = useRunePrice('TAL');
  const ralPrice = useRunePrice('RAL');
  const ortPrice = useRunePrice('ORT');
  const thulPrice = useRunePrice('THUL');
  const bnbPrice = useBnbPrice();

  const [onPresentPurchaseModal] = useModal(<PurchaseModal onSuccess={() => {}} />);
  const { rewardPerBlock } = useRewardPerBlock();
  const { prevFarmSymbol, currentFarmSymbol, nextFarmSymbol, currentFarmPending, currentFarmPaused, startBlock } =
    useFarmStatus();
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef();

  const maxAPY = useRef(0);
  const boost = parseFloat((rewardPerBlock.toNumber() * 10).toFixed(2));

  const getHighestAPY = () => {
    const activeFarms = farmsLP
      .filter((farm) => farm.multiplier !== '0X')
      .filter((f) => f.chefKey === chefKey)
      .filter((f) => f.pid !== 28)
      .filter((f) =>
        f.lpSymbol === 'ITH' ? f.userData && new BigNumber(f.userData.stakedBalance).isGreaterThan(0) : true
      );
    // console.log(activeFarms)
    calculateAPY(activeFarms);

    // console.log(maxAPY.current, (maxAPY.current * 100).toLocaleString('en-US'))

    return parseFloat((maxAPY.current * 100).toFixed(0)).toLocaleString('en-US'); //.slice(0, -1)
  };

  const calculateAPY = useCallback(
    (farmsToDisplay) => {
      const tokenPriceVsBUSD = new BigNumber(
        farmsLP.find((farm) => farm.pid === REWARD_BUSD_POOL_PID)?.tokenPriceVsQuote || 0
      );

      farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm;
        }
        const tokenRewardPerBlock = rewardPerBlock.times(farm.poolWeight);
        const tokenRewardPerYear = tokenRewardPerBlock.times(BLOCKS_PER_YEAR);

        let apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken);

        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(bnbPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.RUNE) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(runePrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.EL) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(elPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.TIR) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(tirPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.ELD) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(eldPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.NEF) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(nefPrice);
        }

        if (maxAPY.current < apy.toNumber()) maxAPY.current = apy.toNumber();

        if (maxAPY.current < Number.MIN_VALUE) maxAPY.current = Number.MIN_VALUE;

        return apy;
      });
    },
    [farmsLP, rewardPerBlock, bnbPrice, elPrice, eldPrice, tirPrice, nefPrice, runePrice]
  );

  return (
    <>
      <StyledFarmStakingCard>
        {boost > 1 ? <StyledCardAccent /> : null}
        <CardBody>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Heading as="h2" size="xl" color="#fff" mb="24px">
              Raid Status
            </Heading>
            {currentFarmPending ? (
              <>
                <Heading color="contrast" size="lg" style={{ textAlign: 'center' }}>
                  {/* {prevFarmSymbol} RUNIC RAIDS FINISHED.
                <br />
                <br /> */}
                  {symbolMap(currentFarmSymbol)} RUNIC RAIDS STARTS SOON!
                  <br />
                  <br />
                  Start block: {startBlock}
                  <br />
                  <br />
                  <LinkExternal href={`https://v${OLD_VERSION}.arken.gg/farms`}>Unstake Old Farms</LinkExternal>
                  {/* <LinkExternal href={`https://bscscan.com/block/countdown/${startBlock}`}>Countdown</LinkExternal> */}
                  <LinkExternal href="https://t.me/Arken_Realms">Open Announcements</LinkExternal>
                </Heading>
                <br />
                <br />
                <Button as={RouterLink} to="/farms">
                  {t('Get Ready For Next Farm')}
                  <OpenNewIcon color="white" ml="4px" />
                </Button>
              </>
            ) : null}

            {currentFarmPaused ? (
              <>
                <Heading color="contrast" size="md">
                  {symbolMap(currentFarmSymbol)} RUNIC RAIDS FINISHED.
                  <br />
                  <br />
                  {symbolMap(nextFarmSymbol)} RUNIC RAIDS STARTS SOON.
                  <br />
                  <br />
                  <LinkExternal href="https://t.me/Arken_Realms">Open Announcements</LinkExternal>
                </Heading>
                <br />
                <br />
                <Button as={RouterLink} to="/farms">
                  {t('Get Ready For Next Farm')}
                  <OpenNewIcon color="white" ml="4px" />
                </Button>
              </>
            ) : null}

            {!currentFarmPaused && !currentFarmPending ? (
              <>
                <Heading color="text" size="md" style={{ textAlign: 'center' }}>
                  {symbolMap(currentFarmSymbol)} RUNIC RAIDS IS ACTIVE
                  <br />
                  <br />
                  <span style={{ fontSize: boost + 'rem' }}>{boost > 1 ? `${boost}X Boost` : 'No Boost'}</span>
                </Heading>
                <br />
                <br />
                <Heading color="contrast" size="lg">
                  Rewards up to
                </Heading>
                <CardMidContent color="#e9a053">
                  {getHighestAPY() && maxAPY.current !== 0 ? (
                    `${getHighestAPY()}% ${t('APR')}`
                  ) : (
                    <Skeleton animation="pulse" variant="rect" height="44px" />
                  )}
                </CardMidContent>
                <Heading color="contrast" size="lg">
                  in Farms
                </Heading>
                <br />
                <br />
                <Button as={RouterLink} to="/farms">
                  {t('Join Farm Raids')}
                  <OpenNewIcon color="white" ml="4px" />
                </Button>
                <br />
                <Button variant="text" as={RouterLink} to="/pools">
                  {t('Join Pool Raids')}
                  <OpenNewIcon color="white" ml="4px" />
                </Button>
              </>
            ) : null}
          </Flex>
          <br />
          {/* <Flex justifyContent="space-between">
          <div></div>
          <NavLink exact activeClassName="active" to="/farms" id="farm-apy-cta">
            <ArrowForwardIcon mt={30} color="primary" />
          </NavLink>
        </Flex> */}
        </CardBody>
      </StyledFarmStakingCard>
      <StyledFarmStakingCard>
        <CardBody>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <Heading as="h2" size="xl" color="#fff" mb="24px">
              How To Raid
            </Heading>
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              1. Join the Raid
            </Heading>
            <br />
            <HelpText>
              Welcome raider! The first thing you&apos;re going to want to do is join the raid. You can do that by
              getting yourself the $RXS token, or any of the runes and staking them in Pool Raid, or Farm Raid. You can
              get those on Arken Swap. To join a Farm Raid, you need to create an LP.
            </HelpText>
            <HelpLinks>
              &bull;{' '}
              <div style={{ display: 'inline-block' }} onClick={onPresentPurchaseModal}>
                Purchase $RXS
              </div>
              <br />
              &bull;{' '}
              <a href="https://arken.gg/swap/" rel="noreferrer noopener" target="_blank">
                Create LP on Arken Swap
              </a>
              <br />
              &bull; <RouterLink to="/pools">Join Pool Raids</RouterLink>
              <br />
              &bull; <RouterLink to="/farms">Join Farm Raids</RouterLink>
              <br />
            </HelpLinks>
            <br />
            <br />
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              2. Create a Character
              <br />
              <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
            </Heading>
            <br />
            <HelpText>If you want to use items, you must create a character and join a guild first!</HelpText>
            <HelpLinks>
              &bull; <RouterLink to="/account">Create Character</RouterLink>
            </HelpLinks>
            <br />
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              3. Craft Items
              <br />
              <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
            </Heading>
            <br />
            <HelpText>
              At any time, you can craft items using the Cube. To do this, you must select the correct rune combination.
            </HelpText>
            <HelpLinks>
              &bull; <RouterLink to="/craft">View Runeforms</RouterLink>
              <br />
              &bull; <RouterLink to="/transmute">Start Crafting</RouterLink>
            </HelpLinks>
            <br />
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              4. Equip Items
              <br />
              <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>(Optional)</span>
            </Heading>
            <br />
            <HelpText>
              Once you have your items crafted, you can equip them on the inventory screen and they will show up as
              equipped on the raid page. Don&apos;t worry if you don&apos;t see it right away, just refresh in a minute.
            </HelpText>
            <HelpLinks>
              &bull; <RouterLink to="/account/inventory">View Inventory</RouterLink>
            </HelpLinks>
            <br />
            <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
              More Info
            </Heading>
            <br />
            <HelpText>
              If you&apos;ve got more questions, check out the FAQ. We&apos;ve worked hard to answer every frequently
              asked question. Or join the Telegram community and the devs will answer any questions you may have.
            </HelpText>
            <HelpLinks>
              &bull;{' '}
              <a href="/faq" rel="noreferrer noopener" target="_blank">
                View FAQ
              </a>
              <br />
              &bull;{' '}
              <a href="https://t.me/Arken_Realms" rel="noreferrer noopener" target="_blank">
                Join Telegram
              </a>
              <br />
              {/* &bull; <a href="/faq#q-theres-so-much-to-do-what-do-i-do" rel="noreferrer noopener" target="_blank">Best strategy?</a> */}
            </HelpLinks>
          </Flex>
        </CardBody>
      </StyledFarmStakingCard>
    </>
  );
};

export default EarnAPYCard;
