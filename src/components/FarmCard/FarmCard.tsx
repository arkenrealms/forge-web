import React, { useMemo, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import styled, { keyframes } from 'styled-components';
import { Flex, Text, Skeleton, Card, Heading, Button, HelpIcon } from '~/ui';
import { Modal, useModal, InjectedModalProps } from '~/components/Modal';
import useWeb3 from '~/hooks/useWeb3';
import { Farm } from '~/state/types';
import { useBnbPrice, useFarmUser, useGetApiPrice, useRunePrice } from '~/state/hooks';
import { useTranslation } from 'react-i18next';
import useStake from '~/hooks/useStake';
import useInventory from '~/hooks/useInventory';
import Tooltip from '~/components/Tooltip/Tooltip';
import ExpandableSectionButton from '~/components/ExpandableSectionButton';
import { QuoteToken } from '~/config/constants/types';
import { BASE_ADD_LIQUIDITY_URL } from '~/config';
import getLiquidityUrlPathParts from '~/utils/getLiquidityUrlPathParts';
import { getBalanceNumber } from '~/utils/formatBalance';
import { getMasterChefAddress, getRuneAddress } from '~/utils/addressHelpers';
import { useMasterchef } from '~/hooks/useContract';
import useRefresh from '~/hooks/useRefresh';
import useTokenBalanceOf from '~/hooks/useTokenBalanceOf';
import { useFarmStatus } from '~/hooks/useFarmStatus';
import symbolMap from '~/utils/symbolMap';
import DetailsSection from './DetailsSection';
import CardHeading from './CardHeading';
import CardActionsContainer from './CardActionsContainer';

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber;
  liquidity?: BigNumber;
}

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

const FCard = styled(Card)`
  align-self: baseline;
  box-shadow: 0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
  position: relative;
  text-align: center;
  overflow: visible;
`;

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`;

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`;

interface FarmCardProps {
  farm: FarmWithStakedValue;
  removed: boolean;
  account?: string;
}

const useLpBalance = (farmPid) => {
  const [balance, setBalance] = useState(0);
  const { address: account } = useWeb3();
  const { fastRefresh } = useRefresh();
  const { contract: masterChefContract } = useMasterchef();

  useEffect(() => {
    const fetchLpBalance = async () => {
      const res = await masterChefContract.methods.userInfo(farmPid, account).call();

      setBalance(getBalanceNumber(res.amount ? res.amount : res));
    };

    if (account) {
      fetchLpBalance();
    }
  }, [account, fastRefresh, farmPid, masterChefContract.methods]);

  return balance;
};

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, account }) => {
  const { web3 } = useWeb3();
  const { t } = useTranslation();
  const lpBalance = useLpBalance(farm.pid);
  const { earnings, previousEarnings } = useFarmUser(farm.pid);

  const { onStake } = useStake(farm.pid);
  const lpBalanceTotal = useTokenBalanceOf(farm.lpAddresses[56], getMasterChefAddress());
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPending, currentFarmPaused } = useFarmStatus();

  const bnbPrice = useBnbPrice();
  const elPrice = useRunePrice('EL');
  const eldPrice = useRunePrice('ELD');
  const tirPrice = useRunePrice('TIR');
  const nefPrice = useRunePrice('NEF');
  const runePrice = useRunePrice('RUNE');

  const inventory = useInventory();
  const buffs = inventory.meta;
  const [showExpandableSection, setShowExpandableSection] = useState(false);

  // We assume the token name is coin pair + lp e.g. RUNE-BNB LP, LINK-BNB LP,
  // NAR-RUNE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase();

  const totalValue: BigNumber = useMemo(() => {
    if (!farm.lpTotalInQuoteToken) {
      return null;
    }
    if (farm.quoteTokenSymbol === QuoteToken.BNB) {
      return bnbPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.RUNE) {
      return runePrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.EL) {
      return elPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.ELD) {
      return eldPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.TIR) {
      return tirPrice.times(farm.lpTotalInQuoteToken);
    }
    if (farm.quoteTokenSymbol === QuoteToken.NEF) {
      return nefPrice.times(farm.lpTotalInQuoteToken);
    }
    return farm.lpTotalInQuoteToken;
  }, [bnbPrice, elPrice, eldPrice, tirPrice, nefPrice, runePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol]);

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-';

  const { contract: masterChefContract } = useMasterchef();
  const lpLabel = farm.lpSymbol && farm.lpSymbol.toUpperCase().replace('PANRUNE', '');
  const earnLabel = farm.dual ? farm.dual.earnLabel : currentFarmSymbol;
  const parsedAPY = farm.apy
    ? parseFloat(farm.apy.times(new BigNumber(100)).toNumber().toFixed(2)) + buffs.harvestFeePercent
    : 0;
  const farmAPY = !parsedAPY || Number.isNaN(parsedAPY) ? 'TBD' : parsedAPY.toLocaleString('en-US') + '%';
  // if (farm.lpSymbol === 'RAL-BUSD LP') console.log(farm)
  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm;
  const liquidityUrlPathParts = getLiquidityUrlPathParts({ quoteTokenAdresses, quoteTokenSymbol, tokenAddresses });
  const addLiquidityUrl = `${
    liquidityUrlPathParts === '0xe9e7cea3dedca5984780bafc599bd69add087d56/0x2098fef7eeae592038f4f3c4b008515fed0d5886'
      ? 'https://pancakeswap.finance/add'
      : BASE_ADD_LIQUIDITY_URL
  }/${liquidityUrlPathParts}`;

  const totalLps = lpBalanceTotal ? Number(getBalanceNumber(lpBalanceTotal)) : 0;
  const totalLpValue = totalValue ? Number(totalValue) : 0;

  const myShareFloat = lpBalance / totalLps;

  const myShare = !Number.isNaN(myShareFloat) && totalLps ? (myShareFloat * 100).toFixed(3) : '0.000';
  const myValue =
    !Number.isNaN(myShareFloat) && totalLps
      ? '$' + parseFloat((myShareFloat * totalLpValue).toFixed(2)).toLocaleString('en-US')
      : '$0.00';
  let harvestFee =
    getBalanceNumber(earnings) > 0 ? getBalanceNumber(earnings) * (buffs.harvestFeePercent / 100) * 1.05 : 0;

  const previousRuneRewards = [];
  // console.log(farm.pid, previousEarnings)
  if (previousEarnings) {
    for (const key in previousEarnings) {
      const value = getBalanceNumber(new BigNumber(previousEarnings[key]));

      if (value === 0) continue;

      harvestFee += 0; //value > 0 ? value * (buffs.harvestFeePercent / 100) * 1.05 : 0

      previousRuneRewards.push({
        symbol: key,
        value: value.toLocaleString(),
      });
    }
  }

  const harvestSpecific = async (symbol) => {
    const address = getRuneAddress(symbol);
    await masterChefContract.methods.depositSpecific(address, farm.pid, 0).send({ from: account });
  };

  return (
    <FCard style={{ ...(farm.isHiddenPool ? { alignSelf: 'unset' } : {}) }}>
      {farm.isHiddenPool && <StyledCardAccent />}
      {farm.isHiddenPool && (
        <Heading as="h2" size="lg" mb="8px" style={{ textAlign: 'center', filter: 'drop-shadow(2px 4px 6px black)' }}>
          Hidden Pool
        </Heading>
      )}
      {!farm.isHiddenPool || (farm.isHiddenPool && buffs.chanceToSendHarvestToHiddenPool) ? (
        <>
          <CardHeading
            lpLabel={lpLabel}
            multiplier={farm.multiplier}
            risk={risk}
            isTokenOnly={farm.isTokenOnly}
            depositFee={farm.depositFeeBP}
            farmImage={farmImage}
            tokenSymbol={farm.tokenSymbol}
          />
          {farm.isRetired ? (
            <div>
              <br />
              <Text mr={10} style={{ display: 'inline-block', fontSize: '1.4rem' }}>
                Retired
              </Text>
              <Tooltip content={t('This pool will continue to get yield, but further deposits cannot be made.')}>
                <HelpIcon color="textSubtle" />
              </Tooltip>
              <br />
              <br />
            </div>
          ) : null}
          {!removed && (
            <Flex justifyContent="space-between" alignItems="center">
              <Text>{t('APR')}:</Text>
              <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                {currentFarmPending ? <>Starts soon</> : null}
                {!currentFarmPaused && farm.isFinished ? <>Finished</> : null}
                {!currentFarmPaused && farm.isStarting ? <>Starting soon</> : null}
                {currentFarmPaused ? <>Paused/Ended</> : null}
                {!currentFarmPending && !currentFarmPaused && !farm.isStarting && !farm.isFinished && farm.apy ? (
                  <>
                    {/* <ApyButton lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} apy={farm.apy} /> */}
                    {farmAPY || '0%'}
                  </>
                ) : null}
                {!currentFarmPending && !currentFarmPaused && !farm.isStarting && !farm.isFinished && !farm.apy ? (
                  <Skeleton height={24} width={80} />
                ) : null}
              </Text>
            </Flex>
          )}
          {!currentFarmPaused ? (
            <Flex justifyContent="space-between">
              <Text>{t('Reward')}:</Text>
              <Text bold>{symbolMap(earnLabel)}</Text>
            </Flex>
          ) : null}
          <Flex justifyContent="space-between">
            <Text>{t('Deposit Fee')}:</Text>
            <Text bold>{farm.depositFeeBP / 100}%</Text>
          </Flex>
          {buffs.harvestFeePercent > 0 ? (
            <Flex justifyContent="space-between">
              <Text>{t('Harvest Fee')}:</Text>
              <Text bold>
                {buffs.harvestFeePercent}% {buffs.harvestFeeToken}
              </Text>
            </Flex>
          ) : null}
          {buffs.harvestFeePercent > 0 ? (
            <Flex justifyContent="space-between">
              <Text>{t('Your Fee')}:</Text>
              <Text bold>
                {(Math.ceil(harvestFee * 1000) / 1000).toFixed(3)} {symbolMap(buffs.harvestFeeToken)}
              </Text>
            </Flex>
          ) : null}
          <CardActionsContainer
            farm={farm}
            ethereum={web3 as any}
            account={account}
            harvestFee={harvestFee}
            hasPreviousEarnings={!!previousRuneRewards.length}
          />
          {previousRuneRewards.length ? (
            <>
              {/* <Divider />
              <strong>Pending Earnings:</strong> */}
              <br />
              {previousRuneRewards.map((previousReward) => {
                return (
                  <div key={previousReward.symbol} style={{ marginBottom: 3 }}>
                    <Button scale="sm" onClick={() => harvestSpecific(previousReward.symbol)}>
                      Harvest {previousReward.value} {symbolMap(previousReward.symbol)}{' '}
                      {buffs.harvestFeeToken &&
                      Math.ceil(previousReward.value * (buffs.harvestFeePercent / 100) * 1000) / 1000 > 0 ? (
                        <span style={{ fontSize: '0.6em', minWidth: '60px' }}>
                          {(Math.ceil(previousReward.value * (buffs.harvestFeePercent / 100) * 1000) / 1000).toFixed(3)}
                          <br />
                          {symbolMap(buffs.harvestFeeToken)} fee
                        </span>
                      ) : null}
                    </Button>
                    {/* <img src={`/images/farms/${previousReward.symbol.toLowerCase()}.png`} style={{width: 20, height: 20, marginLeft: 5}} alt={previousReward.symbol} /> */}
                  </div>
                );
              })}
            </>
          ) : null}
          <Divider />
          <ExpandableSectionButton
            onClick={() => setShowExpandableSection(!showExpandableSection)}
            expanded={showExpandableSection}
          />
          <ExpandingWrapper expanded={showExpandableSection}>
            <DetailsSection
              removed={removed}
              bscScanAddress={`https://bscscan.com/address/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`}
              totalValueFormated={totalValueFormated}
              lpLabel={lpLabel}
              myShare={myShare}
              myValue={myValue}
              addLiquidityUrl={addLiquidityUrl}
            />
          </ExpandingWrapper>
        </>
      ) : null}
    </FCard>
  );
};

export default FarmCard;
