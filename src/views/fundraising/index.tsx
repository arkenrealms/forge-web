import Input from '~/components/Input/Input';
import ItemInformation from '~/components/ItemInformation';
import Select, { OptionProps } from '~/components/Select/Select';
import { formatDistance, parseISO } from 'date-fns';
import useMarket from '~/hooks/useMarket';
import useWeb3 from '~/hooks/useWeb3';
import queryString from 'query-string';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { decodeItem } from '@arken/node/util/decoder';
import styled, { css } from 'styled-components';
import { BaseLayout, Button, ButtonMenu, ButtonMenuItem, Card, CardBody, Flex, Heading, Text, Toggle } from '~/ui';
// @ts-ignore
// @ts-ignore
import { itemData, ItemType } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfiniteFlex = styled(Flex)`
  & > div > div {
    overflow: hidden !important;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 16px;
  margin-left: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 234px;
    display: block;
  }
`;

const SearchContainer = styled.div<{ toggled: boolean }>``;

const SearchInput: React.FC<SearchProps> = ({ value, onChange, onBlur }) => {
  const [toggled, setToggled] = useState(false);
  const inputEl = useRef(null);

  return (
    <SearchContainer toggled={toggled}>
      <InputWrapper>
        <StyledInput
          ref={inputEl}
          value={value}
          onChange={onChange}
          placeholder="SEARCH MARKET"
          onBlur={(e) => {
            setToggled(false);
            onBlur?.(e);
          }}
        />
      </InputWrapper>
    </SearchContainer>
  );
};

const Container = styled.div``;

const Background1 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  pointer-events: none;

  //   background: url(/images/inventory/character-bg.png) no-repeat 50% 50%;
  background-size: contain;
  width: 100%;
  height: 100%;
  opacity: 0.7;
  mix-blend-mode: screen;
  filter: drop-shadow(2px 4px 6px black);
`;
const Background2 = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  pointer-events: none;

  //   background: url(/images/inventory/character-male-bg.png) no-repeat 50% 50%;
  background-size: contain;
  width: 100%;
  height: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;
  z-index: 20;

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

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

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

const ItemLayout = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 25px;

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
      grid-column: span 4;
    }
  }
`;

// const ItemCard = styled(Card)`
//   position: relative;
//   overflow: hidden;
//   font-weight: bold;

//   border-width: 18px 6px;
//   border-style: solid;
//   border-color: transparent;
//   border-image-source: url(/images/puzzle_bars.png);
//   border-image-slice: 25% fill;
//   border-image-width: 100px 100px;
//   background: none;
//   // transform: scale(0.8);
//   text-shadow: 1px 1px 1px black;
//   // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
//   filter: contrast(1.08);
//   padding: 30px 80px;

//   & > div {
//     position: relative;
//     z-index: 2;
//   }

//   ${({ theme }) => theme.mediaQueries.lg} {
//   }
// `

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
      grid-column: span 6;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;

const SubHeading = styled.div`
  width: 100%;
  font-size: 2rem;
  line-height: 2.5rem;
  text-align: center;
  text-decoration: underline;
`;

const ItemCardContainer = styled(Card)`
  border: 0 none;
  align-self: baseline;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  min-width: 300px;
`;

const MainHeading = styled.div`
  font-size: 3rem;
  line-height: 3.5rem;
  color: #fff;
`;

const ItemHeading = styled.div`
  font-size: 1.8rem;
  margin: 5px 0;
`;

const ItemCard = ({ trade, account, advanced }) => {
  const item = decodeItem(trade.tokenId);
  return (
    <ItemCardContainer>
      {/* Name: {trade.item.name} {trade.item.shorthand}
      <br />
      Seller: {trade.seller}
      <br />
      ID: {trade.id}
      <br />
      Token ID: {trade.item.tokenId}
      <br />
      Price: {trade.price}
      <br />
      Perfection: {(trade.item.perfection * 100).toFixed(0)}%<br />
      <p>{trade.item.message}</p> */}
      {advanced ? (
        <Card style={{ padding: 20 }}>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <ItemHeading>
              {item.name} {item.shorthand}
            </ItemHeading>
            {item.perfection !== null ? <Final>{(item.perfection * 100).toFixed(0)}% PERFECT</Final> : null}
            <Final>{trade.price} RXS</Final>
            <br />
            <Button as={NavLink} to={`/trade/${trade.id}`}>
              View Trade
            </Button>
          </Flex>
        </Card>
      ) : (
        <ItemInformation
          item={item}
          showActions={false}
          showPerfection={false}
          showBranches={false}
          hideDetails
          hideMetadata
          price={0}>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            {item.perfection !== null ? <Final>{(item.perfection * 100).toFixed(0)}% PERFECT</Final> : null}
            <Final>{trade.price} RXS</Final>
            {trade.status === 'sold' ? (
              <Final>
                {formatDistance(parseISO(new Date(trade.updatedAt).toISOString()), new Date(), { addSuffix: true })}
              </Final>
            ) : (
              <Final>
                {formatDistance(parseISO(new Date(trade.createdAt).toISOString()), new Date(), { addSuffix: true })}
              </Final>
            )}
            {item.type === ItemType.Pet ? (
              <Final>
                {trade.seller.toLowerCase() === '0xe619ba5F9F80b8A22cFcAAB357A0Fc2827cf6ECC'.toLowerCase() ? (
                  <>Rune Fundraiser</>
                ) : (
                  <></>
                )}
                <br />
              </Final>
            ) : null}
            <br />
            <Button as={NavLink} to={`/trade/${trade.id}`}>
              View Trade
            </Button>
          </Flex>
        </ItemInformation>
      )}
    </ItemCardContainer>
  );
};

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

let init = false;

const Market = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const location = useLocation();
  const match = parseMatch(location);
  const {
    trades,
    page,
    setPage,
    query,
    setQuery,
    sortFilter,
    setSortFilter,
    rarityFilter,
    setRarityFilter,
    statusFilter,
    setStatusFilter,
    myListingsOnly,
    setMyListingsOnly,
    meOnly,
    setMeOnly,
    perfectOnly,
    setPerfectOnly,
    advanced,
    setAdvanced,
    tab,
    setTab,
    count,
    setCount,
  } = useMarket();
  // @ts-ignore

  const updateHistory = useCallback(
    (key, val) => {
      setTimeout(() => {
        try {
          navigate({
            pathname: '/fundraising',
            search:
              '?' +
              // @ts-ignore
              new URLSearchParams({
                query,
                account: account || '',
                sort: sortFilter,
                status: statusFilter,
                rarity: rarityFilter,
                perfectOnly,
                meOnly,
                tab: tab.toString(),
                myListingsOnly,
                advanced,
                count,
                page,
                [key]: val,
              }).toString(),
            // state: { detail: 'some_value' }
          });
        } catch (e) {
          console.log(e);
        }
      }, 500);
    },
    [
      navigate,
      tab,
      advanced,
      meOnly,
      myListingsOnly,
      perfectOnly,
      query,
      rarityFilter,
      sortFilter,
      statusFilter,
      page,
      count,
      account,
    ]
  );

  useEffect(() => {
    if (init) return;
    init = true;

    if (match.params.advanced !== undefined && match.params.advanced !== advanced) setAdvanced(match.params.advanced);
    if (match.params.count !== undefined && match.params.count !== count)
      setCount(parseInt(String(match.params.count)));
    if (match.params.meOnly !== undefined && match.params.meOnly !== meOnly) setMeOnly(match.params.meOnly);
    if (match.params.myListingsOnly !== undefined && match.params.myListingsOnly !== myListingsOnly)
      setMyListingsOnly(match.params.myListingsOnly);
    if (match.params.page !== undefined && match.params.page !== page) setPage(parseInt(String(match.params.page)));
    if (match.params.perfectOnly !== undefined && match.params.perfectOnly !== perfectOnly)
      setPerfectOnly(match.params.perfectOnly);
    if (match.params.query !== undefined && match.params.query !== query) setQuery(match.params.query);
    if (match.params.rarity !== undefined && match.params.rarity !== rarityFilter) setRarityFilter(match.params.rarity);
    if (match.params.sort !== undefined && match.params.sort !== sortFilter) setSortFilter(match.params.sort);
    if (match.params.status !== undefined && match.params.status !== statusFilter) setStatusFilter(match.params.status);
    if (match.params.tab !== undefined && match.params.tab !== tab) setTab(parseInt(String(match.params.tab)));
  }, [
    match,
    page,
    setPage,
    query,
    setQuery,
    sortFilter,
    setSortFilter,
    rarityFilter,
    setRarityFilter,
    statusFilter,
    setStatusFilter,
    myListingsOnly,
    setMyListingsOnly,
    meOnly,
    setMeOnly,
    perfectOnly,
    setPerfectOnly,
    advanced,
    setAdvanced,
    tab,
    setTab,
    count,
    setCount,
  ]);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    // const query = new URLSearchParams(history.location.search)
    // query.set('foo', 'bar')
    // history.replace({...history.location, search: query.toString()})
  };

  const handleBlurQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateHistory('query', event.target.value);
  };

  const handleSortFilterChange = (option: OptionProps): void => {
    setSortFilter(option.value);

    updateHistory('sort', option.value);
  };

  // @ts-ignore
  // const paginatedTrades = trades.slice(0, page * count)

  const updateRarityFilter = (val) => {
    setRarityFilter(val);

    updateHistory('rarity', val);
  };

  const updateStatusFilter = (val) => {
    setStatusFilter(val);

    updateHistory('status', val);
  };

  const updateMyListingsOnly = (val) => {
    setMyListingsOnly(val);

    updateHistory('myListingsOnly', val);
  };

  const updateMeOnly = (val) => {
    setMeOnly(val);

    updateHistory('meOnly', val);
  };

  const updatePerfectOnly = (val) => {
    setPerfectOnly(val);

    updateHistory('perfectOnly', val);
  };

  const updateAdvanced = (val) => {
    setAdvanced(val);

    updateHistory('advanced', val);
  };

  const updateTab = (val) => {
    setTab(val);

    updateHistory('tab', val);
  };

  const updatePage = (val) => {};

  const updatecount = (val) => {
    setCount(val);

    updateHistory('count', val);
  };

  const allLoaded = false; // paginatedTrades.length === trades.length

  const fetchData = () => {
    setPage((p) => p + 1);

    updateHistory('page', page + 1);
  };

  const refreshData = () => {};

  const runewordOptions = [
    {
      label: 'Choose',
      value: '',
    },
    ...itemData[ItemsMainCategoriesType.OTHER]
      .filter((item) => item.isRuneword && !item.isDisabled && item.isTradeable)
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
  ];

  const runeword = runewordOptions.find((r) => r.value === query.toLowerCase())?.value || '';
  const currentTrades = trades?.[tab]?.length ? trades[tab] : undefined;

  return (
    <Container>
      {/* <Background1 />
      <Background2 /> */}

      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Fundraising')}
        </Heading>
        <hr />
        <CardBody>
          <div
            css={css`
              ${({ theme }) => theme.mediaQueries.lg} {
                float: left;
              }
              background: url('/images/team/kevin-anime.png') 0px 100% no-repeat;
              width: 200px;
              height: 200px;
              margin-bottom: 20px;
              background-size: contain;
              margin-right: 20px;
            `}></div>
          <p>
            There are 5 planned fundraisers. The funds from the first 2 will go entirely to marketing events. The rest
            are to be determined.
            <br />
            <br />
            Fundraiser #1: Pets. Arken will be selling 8 pets with 4 rarities each. Forest Turtle, Wyvern, Hippogryph,
            Goblin Drake, Fairy Drake, Red-Eyes Black Drake, Blue-Eyes White Drake, Golden Lion Cub. Each pet will have
            unique 3D videos.
            <br />
            <br />
            Fundraiser #2: Nostalgia. Arken will be selling 10 unique items with 4 rarities each. Windforce, Stone of
            Jordan, Vampire Gaze, Shako, etc. These will be 2D models for now until they are done professionally.
            <br />
            <br />
            Fundraiser #3: NPCs #1. Arken will be selling 6 unique NPCs, 1 from each act. You will own an NPC from
            Arcane Sanctuary. You will receive a portion of the NPCs in game profits (virtual currency, not real
            currency). These will be 2D portraits for now until they can do them professionally.
            <br />
            <br />
            Fundraiser #4: Land. The Rune team will be selling Land deeds to specific locations within Haerra and End of
            Time.
            <br />
            <br />
            Fundraiser #5: Guild Tokens. The Rune team will be selling Guild Tokens of 4 rarities. Magic, Rare, Epic,
            Legendary.
          </p>
        </CardBody>
      </Card>
      <br />
      <Card style={{ width: '100%' }}>
        <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
          {t('Filters')}
        </Heading>
        <hr />
        <CardBody>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <ButtonMenu activeIndex={tab} scale="md" onItemClick={(index) => updateTab(index)}>
              <ButtonMenuItem>{t('Land')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Pets')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Items')}</ButtonMenuItem>
              <ButtonMenuItem>{t('NPCs')}</ButtonMenuItem>
              <ButtonMenuItem>{t('Special')}</ButtonMenuItem>
            </ButtonMenu>
          </Flex>

          <ControlContainer>
            <FilterContainer>
              <LabelWrapper style={{ marginLeft: 16 }}>
                <Text>SEARCH</Text>
                <SearchInput onChange={handleChangeQuery} onBlur={handleBlurQuery} value={query} />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
          <br />
          <ControlContainer>
            <ViewControls>
              <ToggleWrapper>
                <Toggle checked={perfectOnly} onChange={() => updatePerfectOnly(!perfectOnly)} scale="sm" />
                <Text> {t('Perfect only')}</Text>
              </ToggleWrapper>
              <ToggleWrapper>
                <Toggle checked={advanced} onChange={() => updateAdvanced(!advanced)} scale="sm" />
                <Text> {t('Advanced mode')}</Text>
              </ToggleWrapper>
            </ViewControls>
            <FilterContainer>
              <LabelWrapper style={{ marginRight: 15 }}>
                <Text>Rarity</Text>
                <Select
                  value={rarityFilter}
                  options={[
                    {
                      label: 'All',
                      value: '',
                    },
                    {
                      label: 'Legendary',
                      value: 'Legendary',
                    },
                    {
                      label: 'Mythic',
                      value: 'Mythic',
                    },
                    {
                      label: 'Unique',
                      value: 'Unique',
                    },
                    {
                      label: 'Epic',
                      value: 'Epic',
                    },
                    {
                      label: 'Rare',
                      value: 'Rare',
                    },
                    {
                      label: 'Magical',
                      value: 'Magical',
                    },
                  ]}
                  onChange={(option) => updateRarityFilter(option.value)}
                />
              </LabelWrapper>
              <LabelWrapper style={{ marginRight: 15 }}>
                <Text>Status</Text>
                <Select
                  value={statusFilter}
                  options={[
                    {
                      label: 'Available',
                      value: 'available',
                    },
                    {
                      label: 'Sold',
                      value: 'sold',
                    },
                    // {
                    //   label: 'Delisted',
                    //   value: 'delisted',
                    // },
                    // {
                    //   label: 'Earned',
                    //   value: 'earned',
                    // },
                    // {
                    //   label: 'Liquidity',
                    //   value: 'liquidity',
                    // },
                  ]}
                  onChange={(option) => updateStatusFilter(option.value)}
                />
              </LabelWrapper>
              <LabelWrapper style={{ marginRight: 15 }}>
                <Text>SORT BY</Text>
                <Select
                  value={sortFilter}
                  options={[
                    {
                      label: 'Hot',
                      value: 'hot',
                    },
                    {
                      label: 'Price',
                      value: 'price',
                    },
                    {
                      label: 'New',
                      value: 'new',
                    },
                    {
                      label: 'Updated',
                      value: 'updated',
                    },
                    {
                      label: 'Perfection',
                      value: 'perfection',
                    },
                    // {
                    //   label: 'Earned',
                    //   value: 'earned',
                    // },
                    // {
                    //   label: 'Liquidity',
                    //   value: 'liquidity',
                    // },
                  ]}
                  onChange={handleSortFilterChange}
                />
              </LabelWrapper>
            </FilterContainer>
          </ControlContainer>
        </CardBody>
      </Card>
      <br />

      <Card style={{ width: '100%' }}>
        <CardBody>
          {tab === 0 ? (
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <br />
              <br />
              <MainHeading>Land Sale</MainHeading>
              <br />
              <br />
              <div>Show map</div>
            </Flex>
          ) : null}
          {tab === 1 ? (
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <MainHeading>
                {currentTrades?.length === 100 ? '100 Results (Max)' : `${currentTrades?.length || 0} Results`}
              </MainHeading>
              <br />
              <br />
              {/* {currentTrades.length === 0 ? <MainHeading>No trades found</MainHeading> : null} */}
              {currentTrades?.length > 0 ? (
                <ItemLayout>
                  {currentTrades.map((trade, index) => (
                    <ItemCard key={`trade-${index}`} trade={trade} account={account} advanced={advanced} />
                  ))}
                </ItemLayout>
              ) : null}
            </Flex>
          ) : null}
          {tab === 2 ? (
            <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
              {currentTrades === undefined ? <MainHeading>Finding items...</MainHeading> : null}
              {currentTrades?.length > 0 ? (
                <>
                  <MainHeading>{currentTrades.length} Results</MainHeading>
                  <br />
                  <br />
                  <br />
                  {/* <InfiniteScroll
                dataLength={currentTrades.length} //This is important field to render the next data
                next={fetchData}
                hasMore={!allLoaded}
                loader={<MainHeading>Loading...</MainHeading>}
                endMessage={<MainHeading>Done</MainHeading>}
                // below props only if you need pull down functionality
                refreshFunction={refreshData}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>}
                releaseToRefreshContent={<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>}
                scrollableTarget="#infinite-wrapper"
              > */}
                  <ItemLayout>
                    {currentTrades.map((trade, index) => (
                      <ItemCard key={`trade-${index}`} trade={trade} account={account} advanced={advanced} />
                    ))}
                  </ItemLayout>
                  {/* </InfiniteScroll> */}
                </>
              ) : null}
            </InfiniteFlex>
          ) : null}
          {tab === 3 ? (
            <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
              NPCs
            </InfiniteFlex>
          ) : null}
          {tab === 4 ? (
            <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
              Cubes
            </InfiniteFlex>
          ) : null}
        </CardBody>
      </Card>
      <br />
      <br />
    </Container>
  );
};

export default Market;

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  // color: ${(props) => props.theme.colors.primary};
`;
