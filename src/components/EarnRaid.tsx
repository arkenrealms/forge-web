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
  font-size: 0.8rem;
  line-height: 1.3rem;
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
    font-size: 0.8rem;
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
      <Heading color="contrast" size="lg">
        Collect
      </Heading>
      <CardMidContent color="#e9a053">
        {getHighestAPY() && maxAPY.current !== 0 ? (
          `${getHighestAPY()}% ${t('APR')}`
        ) : (
          <Skeleton animation="pulse" variant="rect" height="44px" />
        )}
      </CardMidContent>
      <Heading color="contrast" size="lg">
        in Runic Raids
      </Heading>
    </>
  );
};

export default EarnAPYCard;
