import React, { useEffect, useCallback, useState } from 'react';
import { Route, useRouteMatch, useLocation, Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import BigNumber from 'bignumber.js';
import history from '~/routerHistory';
import {
  Image,
  Heading,
  RowType,
  Toggle,
  Card,
  Button,
  Flex,
  Text,
  BaseLayout,
  LinkExternal,
  ButtonMenu,
  ButtonMenuItem,
} from '~/ui';
import styled, { keyframes } from 'styled-components';
import { BLOCKS_PER_YEAR, REWARD_PER_BLOCK, REWARD_BUSD_POOL_PID } from '~/config';
import { useRewardPerBlock } from '~/hooks/useRewardPerBlock';
import PageWindow from '~/components/PageWindow';
import useWeb3 from '~/hooks/useWeb3';
import { useMasterchef } from '~/hooks/useContract';
import Page from '~/components/layout/Page';
import { useBnbPrice, useFarms, useGetApiPrice, useRunePrice } from '~/state/hooks';
import useRefresh from '~/hooks/useRefresh';
import { fetchFarmUserDataAsync } from '~/state/actions';
import { QuoteToken } from '~/config/constants/types';
import { useTranslation } from 'react-i18next';
import { orderBy } from 'lodash';
import FarmCard, { FarmWithStakedValue } from '~/components/FarmCard/FarmCard';
import SearchInput from '~/components/SearchInput';
import { FarmHeader } from '~/components/FarmHeader';
import Select, { OptionProps } from '~/components/Select/Select';
import useInventory from '~/hooks/useInventory';
import { useProfile } from '~/state/hooks';
import { ClassNames } from 'rune-backend-sdk/build/data/items';
import { ConnectNetwork } from '~/components/ConnectNetwork';

// const ItemCard = styled(Card)`
//   position: relative;
//   overflow: visible;
//   font-weight: bold;

//   border-width: 40px 40px;
//   border-style: solid;
//   border-color: inherit;
//   border-image-source: url(/images/spellbook.png);
//   border-image-slice: 25% fill;
//   border-image-width: 100px;
//   background: none;
//   // transform: scale(0.8);
//   text-shadow: 1px 1px 1px black;
//   // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
//   filter: contrast(1.08);

//   ${({ theme }) => theme.mediaQueries.lg} {
//     max-width: 50%;
//   }
// `

const FarmLayout = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    & > div {
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 4;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    & > div {
      grid-column: span 3;
    }
  }
`;

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

const AdvancedButton = styled(Button)`
  margin-top: 12px;
  margin-right: 15px;
  // background: linear-gradient(
  //   45deg,
  //   rgba(255, 0, 0, 1) 0%,
  //   rgba(255, 154, 0, 1) 10%,
  //   rgba(208, 222, 33, 1) 20%,
  //   rgba(79, 220, 74, 1) 30%,
  //   rgba(63, 218, 216, 1) 40%,
  //   rgba(47, 201, 226, 1) 50%,
  //   rgba(28, 127, 238, 1) 60%,
  //   rgba(95, 21, 242, 1) 70%,
  //   rgba(186, 12, 248, 1) 80%,
  //   rgba(251, 7, 217, 1) 90%,
  //   rgba(255, 0, 0, 1) 100%
  // );
  // background-size: 300% 300%;
  // animation: ${RainbowLight} 2s linear infinite;
  // padding: 10px;
  // opacity: 0.3;
  // color: #000;
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

const Header = styled.div``;

export interface FarmsProps {
  tokenMode?: boolean;
}

const Farms: React.FC<FarmsProps> = ({ tokenMode }) => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const farmsLP = useFarms();
  const runePrice = useRunePrice('RUNE');
  const elPrice = useRunePrice('EL');
  const eldPrice = useRunePrice('ELD');
  const tirPrice = useRunePrice('TIR');
  const nefPrice = useRunePrice('NEF');
  const bnbPrice = useBnbPrice(); //useGetApiPrice('WBNB')

  const { profile } = useProfile();
  const { meta: buffs } = useInventory();
  const [query, setQuery] = useState('');
  const { address: account } = useWeb3();
  const [sortOption, setSortOption] = useState('multiplier');
  const { contract: masterChefContract, setChefKey, chefKey } = useMasterchef();

  const dispatch = useDispatch();
  const { fastRefresh } = useRefresh();
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account, chefKey));
    }
  }, [account, dispatch, chefKey, fastRefresh]);

  const [stackedOnly, setStackedOnly] = useState(false);

  const { rewardPerBlock } = useRewardPerBlock();
  const activeFarms = farmsLP
    .filter((f) => f.chefKey === chefKey)
    .filter(
      (farm) =>
        // ![
        //   'EL-RUNE LP',
        //   'TIR-RUNE LP',
        //   'IO-BNB LP',
        //   'ITH-ELD LP',
        //   'ITH-NEF LP',
        //   'NEF-TIR LP',
        //   'NEF-EL LP',
        //   'NEF-RUNE LP',
        //   'TIR-EL LP',
        //   'LUM-BNB LP',
        //   'TAL-BNB LP',
        //   'ITH-BNB LP',
        //   'NEF-BNB LP',
        //   'TIR-BNB LP',
        //   'EL-BNB LP',
        //   'ZOD-BNB LP',
        //   'HEL-BNB LP',
        //   'DOL-BNB LP',
        //   'SHAEL-BNB LP',
        //   'SOL-BNB LP',
        //   'AMN-BNB LP',
        //   'THUL-BNB LP',
        //   'ORT-BNB LP',
        //   'RAL-BNB LP',
        //   'RAL-BNB LP',
        //   'RUNE-BNB LP',
        // ].includes(farm.lpSymbol) ||
        !farm.isRetired ||
        (farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)) ||
        window.location.hostname === 'dev.arken.gg' ||
        window.location.hostname === 'localhost'
    )
    // .filter(
    //   (farm) =>
    //     farm.lpSymbol !== 'RUNE-SLME LP' ||
    //     (farm.lpSymbol === 'RUNE-SLME LP' &&
    //       farm.userData &&
    //       new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)),
    // )
    .filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier !== '0X');
  // const inactiveFarms = farmsLP
  //   .filter((f) => f.chefKey === chefKey)
  //   // .filter(
  //   //   (farm) =>
  //   //     farm.lpSymbol !== 'RUNE-SLME LP' ||
  //   //     (farm.lpSymbol === 'RUNE-SLME LP' &&
  //   //       farm.userData &&
  //   //       new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)),
  //   // )
  //   .filter((farm) => !!farm.isTokenOnly === !!tokenMode && farm.multiplier === '0X') // [{"fid":0,"pid":0,"risk":6,"poolWeight":600,"depositFeeBP":0,"inactive":true,"lpSymbol":"RUNE-BNB LP","lpAddresses":{"56":"0xf9444c39bbdcc3673033609204f8da00d1ae3f52","97":""},"tokenSymbol":"RUNE","tokenAddresses":{"56":"0xa9776b590bfc2f956711b3419910a5ec1f63153e","97":"0xa9776b590bfc2f956711b3419910a5ec1f63153e"},"quoteTokenSymbol":"BNB","quoteTokenAdresses":{"56":"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","97":"0xae13d989dac2f0debff460ac112a837c89baa7cd"}},{"fid":0,"pid":1,"risk":6,"poolWeight":600,"depositFeeBP":0,"inactive":true,"lpSymbol":"RUNE-BUSD LP","lpAddresses":{"56":"0x68513e24495b9d1d1fedee0906872a96858e8ad2","97":""},"tokenSymbol":"RUNE","tokenAddresses":{"56":"0xa9776b590bfc2f956711b3419910a5ec1f63153e","97":"0xa9776b590bfc2f956711b3419910a5ec1f63153e"},"quoteTokenSymbol":"BUSD","quoteTokenAdresses":{"56":"0xe9e7cea3dedca5984780bafc599bd69add087d56","97":""}},{"fid":0,"pid":2,"risk":6,"poolWeight":600,"depositFeeBP":0,"inactive":true,"lpSymbol":"RUNE-SLME LP","lpAddresses":{"56":"0x996dbbbb92fb273fb5e1c79f201d0cb9ac637bb8","97":""},"tokenSymbol":"RUNE","tokenAddresses":{"56":"0xa9776b590bfc2f956711b3419910a5ec1f63153e","97":"0xa9776b590bfc2f956711b3419910a5ec1f63153e"},"quoteTokenSymbol":"SLME","quoteTokenAdresses":{"56":"0x4fcfa6cc8914ab455b5b33df916d90bfe70b6ab1","97":""}},{"fid":0,"pid":3,"risk":1,"poolWeight":300,"depositFeeBP":0,"inactive":true,"lpSymbol":"BUSD-BNB LP","lpAddresses":{"56":"0x1b96b92314c44b159149f7e0303511fb2fc4774f","97":""},"tokenSymbol":"BUSD","tokenAddresses":{"56":"0xe9e7cea3dedca5984780bafc599bd69add087d56","97":""},"quoteTokenSymbol":"BNB","quoteTokenAdresses":{"56":"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","97":"0xae13d989dac2f0debff460ac112a837c89baa7cd"}},{"fid":0,"pid":4,"risk":1,"poolWeight":300,"depositFeeBP":0,"inactive":true,"lpSymbol":"BTCB-BNB LP","lpAddresses":{"56":"0x7561EEe90e24F3b348E1087A005F78B4c8453524","97":""},"tokenSymbol":"BTCB","tokenAddresses":{"56":"0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c","97":""},"quoteTokenSymbol":"BNB","quoteTokenAdresses":{"56":"0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c","97":"0xae13d989dac2f0debff460ac112a837c89baa7cd"}},{"fid":0,"pid":5,"risk":1,"poolWeight":200,"depositFeeBP":0,"inactive":true,"lpSymbol":"USDT-BUSD LP","lpAddresses":{"56":"0xc15fa3e22c912a276550f3e5fe3b0deb87b55acd","97":""},"tokenSymbol":"USDT","tokenAddresses":{"56":"0x55d398326f99059ff775485246999027b3197955","97":""},"quoteTokenSymbol":"BUSD","quoteTokenAdresses":{"56":"0xe9e7cea3dedca5984780bafc599bd69add087d56","97":""}}]

  const stackedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  );

  const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
    switch (sortOption) {
      case 'apr':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.apy.toNumber()), 'desc');
      case 'multiplier':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.multiplier.slice(0, -1)), 'desc');
      case 'earned':
        return orderBy(farms, (farm: FarmWithStakedValue) => (farm.userData ? farm.userData.earnings : 0), 'desc');
      case 'liquidity':
        return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc');
      default:
        return farms;
    }
  };

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay): FarmWithStakedValue[] => {
      const tokenPriceVsBUSD = new BigNumber(
        farmsLP.find((farm) => farm.pid === REWARD_BUSD_POOL_PID)?.tokenPriceVsQuote || 0
      );
      //console.log(tokenPriceVsBUSD.toNumber(), bnbPrice.toNumber())
      let farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        //console.log(farm.lpTotalInQuoteToken)
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken) {
          return farm;
        }
        const tokenRewardPerBlock = rewardPerBlock.times(farm.poolWeight);
        const tokenRewardPerYear = tokenRewardPerBlock.times(BLOCKS_PER_YEAR);
        // if (farm.lpSymbol === 'ITH-BUSD LP') {
        //   console.log(tokenPriceVsBUSD.toNumber())
        //   console.log(
        //     farm.quoteTokenSymbol,
        //     farm.lpTotalInQuoteToken,
        //     tokenRewardPerYear.toNumber(),
        //     tokenPriceVsBUSD.toNumber(),
        //     bnbPrice,
        //   )
        // }
        // console.log(getBalanceNumber(tokenPriceVsBUSD), farmsLP.find((farm2) => farm2.pid === REWARD_BUSD_POOL_PID))
        // runePriceInQuote * tokenRewardPerYear / lpTotalInQuoteToken
        let apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken);
        // console.log(tokenPriceVsBUSD, tokenRewardPerYear, farm.lpTotalInQuoteToken)
        if (farm.quoteTokenSymbol === QuoteToken.BNB) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(bnbPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.RUNE) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(runePrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.EL) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(elPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.ELD) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(eldPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.TIR) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(tirPrice);
        } else if (farm.quoteTokenSymbol === QuoteToken.NEF) {
          apy = tokenPriceVsBUSD.times(tokenRewardPerYear).div(farm.lpTotalInQuoteToken).div(nefPrice);
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
    farmsStaked = []; //farmsList(inactiveFarms)
  }

  farmsStaked = sortFarms(farmsStaked);

  const renderContent = (): any => {
    return (
      <div>
        <FarmLayout>
          {/* <Route exact path={`${path}`}> */}
          {farmsStaked.map((farm) => (
            <FarmCard key={`${chefKey}-${farm.chefKey}-${farm.pid}`} farm={farm} account={account} removed={false} />
          ))}
          {/* </Route> */}
        </FarmLayout>
      </div>
    );
  };

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value);
  };

  // console.log(profile?.nft, profile?.nft.characterId, buffs?.classRequired)

  if (profile?.nft && buffs?.classRequired) {
    if (profile?.nft.characterId !== buffs?.classRequired) {
      return (
        <Page>
          <PageWindow>
            <FarmHeader title="Farms" />
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
          </PageWindow>
        </Page>
      );
    }
  }

  return (
    <div>
      <ConnectNetwork style={{ marginBottom: 20 }} />
      <Page>
        <PageWindow>
          <FarmHeader title="Farms" />
          <br />
          <ControlContainer>
            <ViewControls>
              <ToggleWrapper>
                <Toggle checked={false} onChange={() => history.push('/expert')} scale="sm" />
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
    </div>
  );
};

export default Farms;
