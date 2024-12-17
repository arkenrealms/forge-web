import React, { useEffect, useCallback, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Card,
  Button,
  Flex,
  Text,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui';
import styled from 'styled-components';
import { BLOCKS_PER_YEAR, REWARD_PER_BLOCK, CHEF_MAP, REWARD_BUSD_POOL_PID } from '~/config';
import { useRewardPerBlock } from '~/hooks/useRewardPerBlock';
import FlexLayout from '~/components/layout/Flex';
import PageWindow from '~/components/PageWindow';
import { useMasterchef } from '~/hooks/useContract';
import { useFarmStatus } from '~/hooks/useFarmStatus';
import Page from '~/components/layout/Page';
import { useBnbPrice, useFarms, useGetApiPrice, useRunePrice } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import useRefresh from '~/hooks/useRefresh';
import { fetchFarmUserDataAsync } from '~/state/actions';
import { QuoteToken } from '~/config/constants/types';
import { useTranslation } from 'react-i18next';
import { getBalanceNumber } from '~/utils/formatBalance';
import { orderBy } from 'lodash';
import { FarmHeader } from '~/components/FarmHeader';
import FarmCard, { FarmWithStakedValue } from '~/components/FarmCard/FarmCard';
import SearchInput from '~/components/SearchInput';
import Select, { OptionProps } from '~/components/Select/Select';
import useInventory from '~/hooks/useInventory';
import { useProfile } from '~/state/hooks';
import { ClassNames } from '@arken/node/legacy/data/items';
import { DesktopColumnSchema, ViewMode } from '../../types';

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  margin-bottom: 20px;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
  filter: contrast(1.1);
`;

const Header = styled.div`
  padding: 32px 0px;

  padding-left: 16px;
  padding-right: 16px;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`;

// const SpecialButton = styled(NavLink)`
//   height: 110px;
//   width: 360px;
//   border-width: 44px 132px;
//   border-style: solid;
//   border-color: rgba(0, 0, 0, 0);
//   border-image-source: url(/images/special-button.png);
//   border-image-slice: 110 330 fill;
//   filter: drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px) drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px);
//   font-family: 'webfontexl', sans-serif !important;
//   text-transform: uppercase;

//   top: 35px;
//   position: relative;
//   zoom: 0.8;

//   &:before {
//     content: 'Old Pools';
//     position: absolute;
//     top: 0;
//     white-space: nowrap;
//     font-size: 24px;
//     left: -70px;
//     color: #d2c8ae;
//   }

//   @media (max-width: 768px) {
//     zoom: 0.7;
//   }
// `;

const HeadingWrapper = styled.div`
  position: relative;
  height: 200px;
  padding-top: 0px;
  background: url(/images/pop_up_window_A2.png) no-repeat 50% 0;
  background-size: 200%;
  filter: contrast(1.5) saturate(1.7) drop-shadow(rgba(0, 0, 0, 0.6) 1px 1px 1px)
    drop-shadow(rgba(0, 0, 0, 0.6) 0px 0px 4px) hue-rotate(10deg);

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 200px;
    padding-top: 10px;
    background-size: 100%;
  }
`;

const FarmClosedIcon = styled.img<{ url: string }>`
  width: 16px;
  height: 16px;
  background: #ff5858;
  mask: url(${({ url }) => url}) center/contain;
`;

export interface FarmsProps {
  tokenMode?: boolean;
}

const Farms: React.FC<FarmsProps> = ({ tokenMode }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate(); // Replace `history.push`
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
  const amnPrice = useRunePrice('AMN');
  const bnbPrice = useBnbPrice();
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState(ViewMode.CARD);
  const { address: account } = useWeb3();
  const { currentFarmSymbol, nextFarmSymbol, currentFarmPaused } = useFarmStatus();
  const [currentMasterchefIndex, setCurrentMasterchefIndex] = useState(CHEF_MAP.indexOf(currentFarmSymbol));
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef();
  const [sortOption, setSortOption] = useState('multiplier');
  const { rewardPerBlock } = useRewardPerBlock();
  const [showOldFarms, setShowOldFarms] = useState(false);

  const { profile } = useProfile();
  const { meta: buffs } = useInventory();
  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account, chefKey));
    }
  }, [account, dispatch, chefKey, fastRefresh]);

  const [stackedOnly, setStackedOnly] = useState(false);

  const activeFarms = farmsLP
    .filter((f) => f.chefKey === chefKey)
    .filter(
      (farm) =>
        farm.lpSymbol !== 'ITH' ||
        (farm.lpSymbol === 'ITH' && farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0))
    )
    .filter((f) => f.chefKey === chefKey)
    .filter(
      (farm) =>
        !farm.isRetired ||
        (farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) ||
        window.location.hostname === 'dev.arken.gg' ||
        window.location.hostname === 'localhost'
    )
    .filter((farm) => farm.isTokenOnly === true && farm.multiplier !== '0X');

  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
    switch (sortOption) {
      case 'apr':
        return orderBy(farms, 'apy', 'desc');
      case 'multiplier':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.multiplier.slice(0, -1)), 'desc');
      case 'earned':
        return orderBy(
          farms,
          (farm: FarmWithStakedValue) => (farm.userData ? getBalanceNumber(new BigNumber(farm.userData.earnings)) : 0),
          'desc'
        );
      case 'liquidity':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc');
      default:
        return farms;
    }
  };

  const farmsList = useCallback(
    (farmsToDisplay): FarmWithStakedValue[] => {
      const tokenPriceVsBUSD = new BigNumber(
        farmsLP.find((farm) => farm.pid === REWARD_BUSD_POOL_PID)?.tokenPriceVsQuote || 0
      );

      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
          return farm;
        }
        const tokenRewardPerBlock = rewardPerBlock.times(farm.poolWeight);
        const tokenRewardPerYear = tokenRewardPerBlock.times(BLOCKS_PER_YEAR);

        let apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken);

        if (farm.quoteTokenSymbol === QuoteToken.BUSD) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken);
        } else {
          apy = tokenRewardPerYear.div(farm.lpTotalInQuoteToken);
        }

        let liquidity = farm.lpTotalInQuoteToken;

        if (!farm.lpTotalInQuoteToken) {
          liquidity = null;
        }
        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          liquidity = bnbPrice.times(farm.lpTotalInQuoteToken);
        }
        if (farm.quoteTokenSymbol === QuoteToken.RUNE) {
          liquidity = runePrice.times(farm.lpTotalInQuoteToken);
        }
        if (farm.quoteTokenSymbol === QuoteToken.EL) {
          liquidity = elPrice.times(farm.lpTotalInQuoteToken);
        }
        if (farm.quoteTokenSymbol === QuoteToken.ELD) {
          liquidity = eldPrice.times(farm.lpTotalInQuoteToken);
        }
        if (farm.quoteTokenSymbol === QuoteToken.TIR) {
          liquidity = tirPrice.times(farm.lpTotalInQuoteToken);
        }
        if (farm.quoteTokenSymbol === QuoteToken.NEF) {
          liquidity = nefPrice.times(farm.lpTotalInQuoteToken);
        }

        return { ...farm, apy, liquidity };
      });

      if (query) {
        const lowercaseQuery = query.toLowerCase();
        farmsToDisplayWithAPY = farmsToDisplayWithAPY.filter((farm: FarmWithStakedValue) => {
          if (farm.lpSymbol.toLowerCase().includes(lowercaseQuery)) {
            return true;
          }

          return false;
        });
      }
      return farmsToDisplayWithAPY;
    },
    [bnbPrice, farmsLP, query, rewardPerBlock, elPrice, eldPrice, tirPrice, nefPrice, runePrice]
  );

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const isActive = !pathname.includes('history');
  let farmsStaked = [];
  if (isActive) {
    farmsStaked = stackedOnly ? farmsList(stackedOnlyFarms) : farmsList(activeFarms);
  } else {
    farmsStaked = [];
  }

  farmsStaked = sortFarms(farmsStaked);

  const renderContent = (): any => {
    return (
      <div>
        <FlexLayout>
          {farmsStaked.map((farm) => {
            return <FarmCard key={farm.pid} farm={farm} account={account} removed={false} />;
          })}
        </FlexLayout>
      </div>
    );
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  if (profile?.nft && buffs?.classRequired) {
    if (profile?.nft.characterId !== buffs?.classRequired) {
      return (
        <Page>
          <PageWindow>
            <Header>
              <FarmHeader title="Farms" />
            </Header>
            <Header>
              <p>
                <strong>Invalid Character</strong>
              </p>
              <br />
              <br />
              <p>Your equipment requires using a {ClassNames[buffs?.classRequired]} character class.</p>
              <br />
              <br />
              <p>Your are currently using a {ClassNames[profile?.nft.characterId]}.</p>
              <br />
              <br />
              <p>You won&apos;t be able to harvest, withdraw or deposit until you change class, or unequip the item.</p>
            </Header>
          </PageWindow>
        </Page>
      );
    }
  }

  return (
    <Page>
      <PageWindow>
        <FarmHeader title="Pools" />
        <br />
        <ControlContainer>
          <ViewControls>
            <ToggleWrapper>
              <Toggle checked={false} onChange={() => navigate('/expert')} scale="sm" />
              <Text> {t('Expert Mode')}</Text>
            </ToggleWrapper>
            <ToggleWrapper>
              <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} scale="sm" />
              <Text> {t('Staked only')}</Text>
            </ToggleWrapper>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper>
              <Text>SORT BY</Text>
              <Select
                options={[
                  {
                    label: 'Hot',
                    value: 'hot',
                  },
                  {
                    label: 'APR',
                    value: 'apr',
                  },
                  {
                    label: 'Multiplier',
                    value: 'multiplier',
                  },
                  {
                    label: 'Rewarded',
                    value: 'earned',
                  },
                  {
                    label: 'Liquidity',
                    value: 'liquidity',
                  },
                ]}
                onChange={handleSortOptionChange}
              />
            </LabelWrapper>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <Text>SEARCH</Text>
              <SearchInput onChange={handleChangeQuery} value={query} />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {renderContent()}
      </PageWindow>
    </Page>
  );
};

export default Farms;
