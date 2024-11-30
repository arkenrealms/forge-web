import { decodeItem, normalizeItem } from '@arken/node/util/decoder';
import { formatDistance, parseISO } from 'date-fns';
import queryString from 'query-string';
import React, { KeyboardEventHandler, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsPlusSquare } from 'react-icons/bs';
import { CgClose } from 'react-icons/cg';
import { Link as RouterLink, NavLink, useNavigate, useLocation } from 'react-router-dom';
import ReactSelect, { components } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import styled, { css, keyframes } from 'styled-components';
import Input from '~/components/Input/Input';
import Item from '~/components/Item';
import ItemCatalogFull from '~/components/ItemCatalogFull';
import ItemInformation from '~/components/ItemInformation';
import MarketBuyModal from '~/components/MarketBuyModal';
import MarketDelistModal from '~/components/MarketDelistModal';
import MarketUpdateModal from '~/components/MarketUpdateModal';
import { useModal } from '~/components/Modal';
import { OptionProps } from '~/components/Select/Select';
import TipCard from '~/components/TipCard';
import Tooltip from '~/components/Tooltip/Tooltip';
import useCache from '~/hooks/useCache';
import useMarket from '~/hooks/useMarket';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import useWeb3 from '~/hooks/useWeb3';
import {
  BaseLayout,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  CardBody,
  Flex,
  Heading,
  Skeleton,
  Text,
  Toggle,
} from '~/ui';
// @ts-ignore
// @ts-ignore
import { itemData, ItemType } from '@arken/node/data/items';
import { ItemsMainCategoriesType } from '@arken/node/data/items.type';

interface SearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: any;
}

const selectTheme =
  (multi = false) =>
  (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
      ...theme.colors,
      neutral0: '#2d1e1e', //'#000', //'#5a3f3f', // item bg
      neutral80: '#bb955e', // text color
      neutral5: '#000',
      neutral10: '#000', // not sure
      neutral20: '#000', // unselected border and divider
      neutral30: '#b08c59', // border hover
      neutral40: '#8d6e57', // arrow hover
      neutral50: '#bb955e', // default text
      neutral60: '#bb955e', // opened arrow
      neutral90: '#000', //
      neutral70: '#000', // not sure
      primary25: multi ? '#52393a' : '#432d2d', // hover bg
      primary: '#bb955e', // opened selected item bg
      primary50: '#000', // not sure
      primary75: '#000', // not sure
      // primary: '#5a3f3f', // 8d6e57
    },
  });

const InfiniteFlex = styled(Flex)`
  & > div > div {
    // overflow: hidden !important;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 6px;
  margin-left: auto;
`;

const InputWrapper = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaQueries.sm} {
    // width: 234px;
    display: block;
  }
  margin-bottom: 15px;
`;

const SearchContainer = styled.div<{ toggled: boolean }>``;

const SearchInput: React.FC<SearchProps> = ({ value, onChange, onKeyDown, onBlur }) => {
  const [toggled, setToggled] = useState(false);
  const inputEl = useRef(null);

  return (
    <SearchContainer toggled={toggled}>
      <InputWrapper>
        <StyledInput
          ref={inputEl}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder="Enter keyword..."
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
  flex-direction: column;
  width: 100%;
  padding: 8px 0px;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    // width: auto;
    padding: 0;
  }
`;

const ViewControls = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 100%;
  margin-bottom: 15px;

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

const AttributeInput: any = (props: any) => {
  if (props.isHidden) {
    return <components.Input {...props} />;
  }
  return (
    <div style={{ border: `1px dotted rgb(204, 204, 204)` }}>
      <Tooltip content={'Custom Input'}>
        <components.Input {...props} />
      </Tooltip>
    </div>
  );
};

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
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: relative;
  min-width: 300px;
  align-self: start;
  overflow: visible;
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

function isFundraiserAddress(address) {
  return [
    '0xe619ba5F9F80b8A22cFcAAB357A0Fc2827cf6ECC'.toLowerCase(),
    '0x191727d22f2693100acef8e48F8FeaEaa06d30b1'.toLowerCase(),
  ].includes(address.toLowerCase());
}

const ItemCard = ({ trade, account, advanced }) => {
  const item = decodeItem(trade.tokenId);
  const cache = useCache();

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
      {trade.isPromo ? (
        <div
          css={css`
            position: absolute;
            top: -27px;
            left: 0;
            color: #fff;
            z-index: 11;
            opacity: 0.5;
            // font-size: 0.9rem;

            * {
              color: #fff;
            }
          `}>
          Promoted
          {/* <div css={css`position: relative; display: inline-block; zoom: 0.7;`}><QuestionHelper text={`Trades are promoted while actively playing games.`} /></div> */}
        </div>
      ) : null}
      {advanced ? (
        <Card style={{ padding: 20 }}>
          <Flex flexDirection="column" alignItems="center" justifyContent="center">
            <ItemHeading>
              {item.name} {item.shorthand}
            </ItemHeading>
            {item.perfection !== null ? <Final>{(item.perfection * 100).toFixed(0)}% PERFECT</Final> : null}
            <Final>{trade.price} RXS</Final>
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
          showBranches
          hideDetails
          hideMetadata
          price={0}>
          <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ zoom: 1.1, marginTop: 15 }}>
            {/* {item.perfection !== null ? <Final>{(item.perfection * 100).toFixed(0)}% PERFECT</Final> : null} */}
            <Final>
              {trade.price.toLocaleString(undefined, { maximumFractionDigits: 0 })} RXS
              <br />
              <span style={{ fontSize: '0.9rem', color: '#ccc' }}>
                (${(trade.price * cache.runes.rxs.price).toLocaleString('en-US')})
              </span>
            </Final>
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
                {isFundraiserAddress(trade.seller) ? <>Rune Fundraiser</> : <></>}
                <br />
              </Final>
            ) : null}
            {/* {trade.buyer !== '0x0000000000000000000000000000000000000000' ? <Final>Private Sale<br /></Final> : null} */}
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

const cubeItem = normalizeItem(itemData[ItemsMainCategoriesType.OTHER].find((r) => r.name === "Founder's Cube"));

const Market = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { address: account } = useWeb3();
  const location = useLocation();
  const match = parseMatch(location);
  const marketParams = useMarket();
  const cache = useCache();
  const [selectMode, setSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const { isMd, isLg, isXl, isXxl, isXxxl } = useMatchBreakpoints();
  const [onPresentDelistModal] = useModal(
    <MarketDelistModal
      tokenIds={selectedItems}
      onSuccess={() => {
        setSelectedItems({});
      }}
    />
  );
  const [onPresentUpdateModal] = useModal(
    <MarketUpdateModal
      tokenIds={selectedItems}
      trades={marketParams.trades?.[marketParams.tab] || {}}
      onSuccess={() => {
        setSelectedItems({});
      }}
    />
  );
  const [onPresentBuyModal] = useModal(
    <MarketBuyModal
      tokenIds={selectedItems}
      trades={marketParams.trades?.[marketParams.tab] || {}}
      onSuccess={() => {
        setSelectedItems({});
      }}
    />
  );
  const isMobile = !isMd && !isLg && !isXl && !isXxl && !isXxxl;
  const [attributeFilters, setAttributeFilters] = useState([]);

  const addAttributeFilter = () => {
    setAttributeFilters([
      ...attributeFilters,
      {
        key: 'AA',
        value: 5,
        operator: '>=',
        step: 2,
      },
    ]);
  };

  const {
    defaultFilters,
    isFiltered,
    trades,
    page,
    setPage,
    seller,
    setSeller,
    buyer,
    setBuyer,
    query,
    setQuery,
    branch: branchFilter,
    setBranch: setBranchFilter,
    sort: sortFilter,
    setSort: setSortFilter,
    rarity: rarityFilter,
    setRarity: setRarityFilter,
    status: statusFilter,
    setStatus: setStatusFilter,
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
    // clearFilters,
  } = marketParams;
  // @ts-ignore
  const [queuedQuery, setQueuedQuery] = useState(query.join(''));

  const updateHistory = useCallback(
    (key, val) => {
      // clearTimeout(searchTimeout)

      // searchTimeout = setTimeout(() => {
      try {
        const searchParams = new URLSearchParams({
          account: account || '',
          seller: key === 'tab' ? '' : seller,
          buyer: key === 'tab' ? '' : buyer,
          sort: sortFilter,
          branch: branchFilter,
          status: key === 'tab' ? 'available' : statusFilter,
          rarity: key === 'tab' ? '' : rarityFilter,
          perfectOnly: key === 'tab' ? '' : perfectOnly,
          meOnly: key === 'tab' ? '' : meOnly,
          myListingsOnly: key === 'tab' ? '' : myListingsOnly,
          tab: tab.toString(),
          advanced,
          count,
          page: key === 'tab' ? 1 : page,
          // [key]: val,
        });

        if (key === 'query') {
          // console.log('qqq7', val)
          for (const q of val) {
            if (!q) continue;
            searchParams.append('query', q);
          }
        } else {
          searchParams.set(key, val);

          for (const q of query) {
            if (!q) continue;
            searchParams.append('query', q);
          }
        }

        // searchParams.append('query', key === 'tab' ? '' : query)
        // query: key === 'tab' ? '' : [...searchOptions.map(s => s.value), query],
        navigate({
          pathname: '/market',
          search:
            '?' +
            // @ts-ignore
            searchParams.toString(),
          // state: { detail: 'some_value' }
        });
      } catch (e) {
        console.log(e);
      }
      // }, 200)
    },
    [
      navigate,
      tab,
      advanced,
      meOnly,
      myListingsOnly,
      perfectOnly,
      query,
      seller,
      buyer,
      rarityFilter,
      sortFilter,
      branchFilter,
      statusFilter,
      page,
      count,
      account,
    ]
  );

  const clearFilters = useCallback(() => {
    try {
      const searchParams = new URLSearchParams({
        account: account || '',
        seller: defaultFilters.seller,
        buyer: defaultFilters.buyer,
        sort: defaultFilters.sort,
        branch: defaultFilters.branch,
        status: defaultFilters.status,
        rarity: defaultFilters.rarity,
        perfectOnly: defaultFilters.perfectOnly ? 'true' : '',
        meOnly: defaultFilters.meOnly ? 'true' : '',
        myListingsOnly: defaultFilters.myListingsOnly ? 'true' : '',
        advanced: defaultFilters.advanced ? 'true' : '',
        tab: defaultFilters.tab.toString(),
        count: defaultFilters.count.toString(),
        page: defaultFilters.page.toString(),
      });

      navigate({
        pathname: '/market',
        search:
          '?' +
          // @ts-ignore
          searchParams.toString(),
      });
    } catch (e) {
      console.log(e);
    }
  }, [defaultFilters, navigate, account]);

  useEffect(() => {
    // if (init) return
    // init = true
    // console.log(match.params, marketParams, match.params.query !== undefined && match.params.query !== query)

    // console.log('qqqq4', match.params.query, query)
    const newQuery = Array.isArray(match.params.query)
      ? match.params.query
      : match.params.query
        ? [match.params.query]
        : [];
    // console.log(match.params.query !== undefined && newQuery !== undefined && JSON.stringify(newQuery) !== JSON.stringify(query))

    if (match.params.advanced !== undefined && match.params.advanced !== advanced)
      setAdvanced(Boolean(match.params.advanced));
    if (match.params.meOnly !== undefined && match.params.meOnly !== meOnly) setMeOnly(Boolean(match.params.meOnly));
    if (match.params.myListingsOnly !== undefined && match.params.myListingsOnly !== myListingsOnly)
      setMyListingsOnly(Boolean(match.params.myListingsOnly));
    if (match.params.perfectOnly !== undefined && match.params.perfectOnly !== perfectOnly)
      setPerfectOnly(Boolean(match.params.perfectOnly));
    if (JSON.stringify(newQuery) !== JSON.stringify(query)) {
      setQuery(newQuery);
      setQueuedQuery(newQuery.join(''));
    }
    if (match.params.seller !== undefined && match.params.seller !== seller) setSeller(match.params.seller);
    if (match.params.buyer !== undefined && match.params.buyer !== buyer) setBuyer(match.params.buyer);
    if (match.params.rarity !== undefined && match.params.rarity !== rarityFilter) setRarityFilter(match.params.rarity);
    if (match.params.sort !== undefined && match.params.sort !== sortFilter) setSortFilter(match.params.sort);
    if (match.params.branch !== undefined && match.params.branch !== branchFilter) setBranchFilter(match.params.branch);
    if (match.params.status !== undefined && match.params.status !== statusFilter) setStatusFilter(match.params.status);
    if (match.params.tab !== undefined && parseInt(String(match.params.tab)) !== tab)
      setTab(parseInt(String(match.params.tab)));
    if (match.params.count !== undefined && match.params.count !== count)
      setCount(parseInt(String(match.params.count)));
    if (match.params.page !== undefined && match.params.page !== page) setPage(parseInt(String(match.params.page)));
  }, [
    marketParams,
    match,
    page,
    setPage,
    seller,
    setSeller,
    buyer,
    setBuyer,
    query,
    setQuery,
    branchFilter,
    setBranchFilter,
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

  const handleChangeQuery = (newValue: any, actionMeta: any) => {
    // setQuery(event.target.value)
    // updateHistory('query', newValue)
    // console.log('qqqq', newValue)
    setQueuedQuery(newValue);

    // const query = new URLSearchParams(history.location.search)
    // query.set('foo', 'bar')
    // history.replace({...history.location, search: query.toany()})
  };

  const handleInputChangeQuery = (newValue: any) => {
    // setQuery(event.target.value)
    // updateHistory('query', newValue)
    // console.log('qqqq', newValue)
    setQueuedQuery(newValue);

    // const query = new URLSearchParams(history.location.search)
    // query.set('foo', 'bar')
    // history.replace({...history.location, search: query.toany()})
  };

  const handleBlurQuery = (newValue: string, actionMeta: any) => {
    // setQueuedQuery('')
  };

  const handleInputKeyDownQuery: KeyboardEventHandler<HTMLDivElement> = (event) => {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if (!query.includes(queuedQuery)) {
          // setQueuedQuery('')
          updateHistory(
            'query',
            queuedQuery
              ? [
                  // ...query,
                  queuedQuery,
                ]
              : []
          );
        }

        event.preventDefault();
    }
  };

  // const searchOptions = query.map(q => ({
  //   label: q,
  //   value: q
  // }))

  // if (queuedQuery) {
  //   searchOptions.push({
  //     label: queuedQuery,
  //     value: queuedQuery
  //   })
  // }

  const searchOptions = queuedQuery
    ? [
        {
          label: queuedQuery,
          value: queuedQuery,
        },
      ]
    : [];

  const handleSortFilterChange = (option: OptionProps): void => {
    // setSortFilter(option.value)

    updateHistory('sort', option.value);
  };

  const handleBranchFilterChange = (option: OptionProps): void => {
    // setBranchFilter(option.value)

    updateHistory('branch', option.value);
  };

  // @ts-ignore
  // const paginatedTrades = trades.slice(0, page * count)

  const updateRarityFilter = (val) => {
    // console.log('qqqq6', val)
    // setRarityFilter(val)

    updateHistory('rarity', val);
  };

  const updateStatusFilter = (val) => {
    // setStatusFilter(val)

    updateHistory('status', val);
  };

  const updateMyListingsOnly = (val) => {
    // setMyListingsOnly(val)

    updateHistory('myListingsOnly', val);
  };

  const updateMeOnly = (val) => {
    // setMeOnly(val)

    updateHistory('meOnly', val);
  };

  const updatePerfectOnly = (val) => {
    // setPerfectOnly(val)

    updateHistory('perfectOnly', val);
  };

  const updateAdvanced = (val) => {
    // setAdvanced(val)

    updateHistory('advanced', val);
  };

  const updateTab = (val) => {
    // setPerfectOnly(false)
    // setMeOnly(false)
    // setMyListingsOnly(false)
    // setAdvanced(false)
    // setQuery('')
    // setRarityFilter('')
    // setStatusFilter('available')
    // setPage(1)
    // setTab(val)
    updateHistory('tab', val);
  };

  const updatePage = (val) => {};

  const updateCount = (val) => {
    // setCount(val)

    updateHistory('count', val);
  };

  // const loader = useRef(null)

  // const handleObserver = useCallback((entities) => {
  //   const target = entities[0]
  //   if (target.isIntersecting && ((page+1) * count < trades[2].length)) {
  //     // updatePage((p) => p + 1)
  //     setPage((p) => p + 1)

  //     updateHistory('page', page + 1)
  //   }
  // }, [page, count, trades, setPage, updateHistory])

  // useEffect(() => {
  //   const options = {
  //     root: null,
  //     rootMargin: "20px",
  //     threshold: 1.0
  //   }
  //   const observer = new IntersectionObserver(handleObserver, options)
  //   if (loader.current) {
  //     observer.observe(loader.current)
  //   }
  // }, [handleObserver])

  const onItemMultiSelected = (value, items) => {
    setSelectedItems(items);
  };

  const allLoaded = false; // paginatedTrades.length === trades.length

  const fetchData = () => {
    setPage((p) => p + 1);

    updateHistory('page', page + 1);
  };

  const refreshData = () => {};

  const runewordOptions: any = [
    {
      label: 'Select...',
      value: '',
    },
    ...itemData[ItemsMainCategoriesType.OTHER]
      .filter(
        (item) =>
          item.isRuneword && !item.isDisabled && item.isTradeable && !item.isSecret && !(item as any).isUltraSecret
      )
      .map((item) => ({
        label: item.name,
        value: item.name,
      })),
  ];

  const currentTrades = trades?.[tab] ? trades[tab] : undefined;

  const showOptions = [
    {
      label: '100',
      value: '100',
    },
    {
      label: '250',
      value: '250',
    },
    {
      label: '500',
      value: '500',
    },
    {
      label: '1000',
      value: '1000',
    },
    {
      label: '5000',
      value: '5000',
    },
    {
      label: 'All',
      value: '100000',
    },
  ];

  const sortOptions = [
    {
      label: 'Updated',
      value: 'updated',
    },
    {
      label: 'Perfection',
      value: 'perfection',
    },
    {
      label: 'Price',
      value: 'price',
    },
    {
      label: 'Hot',
      value: 'hot',
    },
    {
      label: 'New',
      value: 'new',
    },
    {
      label: 'Alphabetical',
      value: 'alphabetical',
    },
    // {
    //   label: 'Earned',
    //   value: 'earned',
    // },
    // {
    //   label: 'Liquidity',
    //   value: 'liquidity',
    // },
  ];

  const statusOptions = [
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
  ];

  const rarityOptions = [
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
  ];

  const branchOptions = [
    {
      label: 'Raid',
      value: '1',
    },
    {
      label: 'Evolution',
      value: '2',
    },
    {
      label: 'Infinite',
      value: '3',
    },
    // {
    //   label: 'Guardians',
    //   value: '4',
    // },
    {
      label: 'Sanctuary',
      value: '4',
    },
  ];

  const attributeStepOptions = {
    1: [
      {
        label: 'AA',
        value: 'AA',
      },
    ] as any,
    2: [
      {
        label: '=',
        value: '=',
      },
      {
        label: '>=',
        value: '>=',
      },
      {
        label: '<=',
        value: '<=',
      },
      {
        label: '!=',
        value: '!=',
      },
    ] as any,
    3: [
      {
        label: '5',
        value: '5',
      },
    ] as any,
  };
  // const activeUserAddresses = cache.activeUsers.map((u) => u.address)

  return (
    <Container>
      {/* {isFundraiserAddress(query) ? <StyledCardAccent /> : null} */}
      {!query.find((q) => isFundraiserAddress(q)) ? (
        <TipCard id="market-welcome" npc="kevin" heading={t('Market')}>
          <p>Select an item from your inventory to sell it. If you don't have any items yet, get crafting!</p>
          <br />
          <p>
            Find yourself a
            <RouterLink
              to="/cube"
              // style={{ zoom: 1, padding: '6px 20px', textAlign: 'center', background: '#222' }}
              // onClick={() => {
              //   window.scrollTo(0, 0)
              // }}
              css={css`
                position: relative;
                display: inline-block;
                text-decoration: none;
                border: 0 none !important;
                margin-left: 5px;
                margin-right: 5px;

                & > div {
                  position: relative;
                  width: auto;
                  height: auto;
                  // border: 1px solid #fff;
                  background: rgb(73 74 128 / 10%);
                  border-radius: 5px;
                  // border-size: 1px;
                  padding: 0 8px 8px;

                  &:hover {
                    background: rgb(73 74 128 / 20%);
                  }
                }

                & > div > div:first-child {
                  display: inline;
                  margin-right: 5px;
                }

                & > div > div:first-child > div:first-child {
                  display: inline-block;
                  position: relative;
                  top: 10px;
                  left: 0;
                  width: 30px;
                  height: 30px;
                }
              `}>
              <Item
                itemIndex="marketCubeItem"
                item={cubeItem}
                isDisabled={false}
                showDropdown
                showQuantity={false}
                showActions={false}
                hideMetadata>
                <span style={{ borderBottom: '1px solid transparent' }}>Founder's Cube</span>
              </Item>
            </RouterLink>{' '}
            if you want earliest access to Arken releases and much more!
          </p>
          <br />
          <Button as={RouterLink} to="/craft" style={{ marginRight: 10 }}>
            Craft Items
          </Button>
          <Button as={RouterLink} to="/account/inventory">
            Sell Items
          </Button>
          <br />
          <br />
          <br />
        </TipCard>
      ) : (
        <TipCard id="market-welcome" npc="binzy" heading={t('Fundraiser Items')}>
          <p>
            Welcome!
            <br />
            <br />
            Want to support development? Here you'll find some exclusive NFTs up for purchase.
            <br />
            <br />
            We hope you enjoy them as much as we enjoy building dark fantasy blockchain games for you!
            <br />
            <br />
            We're incredibly blessed to have such a supportive community. Thank you ❤️
          </p>
          <br />
        </TipCard>
      )}
      <br />

      <Cards>
        {!query.find((q) => isFundraiserAddress(q)) ? (
          <div style={{ gridColumn: isMobile ? 'span 12' : 'span 3', minWidth: 240 }}>
            <Card style={{ width: '100%', overflow: 'visible', marginBottom: 25 }}>
              <Heading as="h2" size="lg" style={{ textAlign: 'center', marginTop: 15 }}>
                {t('Filters')}
              </Heading>
              <hr />
              <CardBody style={{ padding: 10, textShadow: '1px 1px 1px #000' }}>
                <ControlContainer>
                  <FilterContainer>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>SEARCH</Text>
                      {/* <SearchInput onChange={handleInputChangeQuery} onKeyDown={handleInputKeyDownQuery} onBlur={() => {}} value={queuedQuery} /> */}
                      <CreatableSelect
                        theme={selectTheme(true)}
                        components={{
                          DropdownIndicator: null,
                        }}
                        inputValue={queuedQuery}
                        isClearable
                        // isMulti
                        menuIsOpen={false}
                        onChange={handleChangeQuery}
                        // onBlur={handleBlurQuery}
                        onInputChange={handleInputChangeQuery}
                        onKeyDown={handleInputKeyDownQuery}
                        placeholder="Search..."
                        value={searchOptions}
                      />
                    </LabelWrapper>
                  </FilterContainer>
                  <ViewControls>
                    <ToggleWrapper>
                      <Toggle
                        checked={myListingsOnly}
                        onChange={() => updateMyListingsOnly(!myListingsOnly)}
                        scale="sm"
                      />
                      <Text> {t('My Listings')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle checked={meOnly} onChange={() => updateMeOnly(!meOnly)} scale="sm" />
                      <Text> {t('My Offers')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle checked={perfectOnly} onChange={() => updatePerfectOnly(!perfectOnly)} scale="sm" />
                      <Text> {t('Perfect Only')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle checked={advanced} onChange={() => updateAdvanced(!advanced)} scale="sm" />
                      <Text> {t('Advanced Mode')}</Text>
                    </ToggleWrapper>
                    <ToggleWrapper>
                      <Toggle checked={selectMode} onChange={() => setSelectMode(!selectMode)} scale="sm" />
                      <Text> {t('Bulk Mode')}</Text>
                    </ToggleWrapper>
                    {selectMode ? (
                      <ControlContainer style={{ filter: 'saturate(0) contrast(1.4)', marginTop: 5 }}>
                        <FilterContainer>
                          <div
                            css={css`
                              button {
                                border: 2px solid rgba(255, 255, 255, 0.2);
                                border-radius: 7px;
                                zoom: 0.8;

                                &.active,
                                &:hover {
                                }
                              }
                            `}>
                            <ViewControls>
                              <Button
                                size="sm"
                                onClick={onPresentDelistModal}
                                disabled={!Object.keys(selectedItems).length}
                                style={{ marginTop: 5 }}>
                                Delist Items
                              </Button>
                              <Button
                                size="sm"
                                onClick={onPresentUpdateModal}
                                disabled={!Object.keys(selectedItems).length}
                                style={{ marginTop: 5 }}>
                                Update Items
                              </Button>
                              <Button
                                size="sm"
                                onClick={onPresentBuyModal}
                                disabled={!Object.keys(selectedItems).length}
                                style={{ marginTop: 5 }}>
                                Purchase Items
                              </Button>
                            </ViewControls>
                          </div>
                        </FilterContainer>
                      </ControlContainer>
                    ) : null}
                  </ViewControls>
                  <FilterContainer>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>RARITY</Text>
                      <ReactSelect
                        theme={selectTheme()}
                        value={rarityOptions.find((o) => o.value === rarityFilter)}
                        options={rarityOptions}
                        onChange={(option) => updateRarityFilter(option.value)}
                      />
                    </LabelWrapper>
                    {/* <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>TYPE</Text>
                      <Select
                        value={rarityFilter}
                        options={[
                          {
                            label: 'All',
                            value: '',
                          },
                          {
                            label: 'One Handed Weapon',
                            value: 'One Handed Weapon'
                          },
                          {
                            label: 'Two Handed Weapon',
                            value: 'Two Handed Weapon'
                          },
                          {
                            label: 'Shield',
                            value: 'Shield'
                          },
                          {
                            label: 'Arrow',
                            value: 'Arrow'
                          },
                          {
                            label: 'Helm',
                            value: 'Helm'
                          },
                          {
                            label: 'Pet',
                            value: 'Pet'
                          },
                          {
                            label: 'Body Armor',
                            value: 'Body Armor'
                          },
                          {
                            label: 'Leggings',
                            value: 'Leggings'
                          },
                          {
                            label: 'Wrist Armor',
                            value: 'Wrist Armor'
                          },
                          {
                            label: 'Glove',
                            value: 'Glove'
                          },
                          {
                            label: 'Belt',
                            value: 'Belt'
                          },
                          {
                            label: 'Boot',
                            value: 'Boot'
                          },
                          {
                            label: 'Ring',
                            value: 'Ring'
                          },
                          {
                            label: 'Amulet',
                            value: 'Amulet'
                          },
                          {
                            label: 'Trinket',
                            value: 'Trinket'
                          },
                          {
                            label: 'Consumable',
                            value: 'Consumable'
                          },
                          {
                            label: 'Gem',
                            value: 'Gem'
                          },
                          {
                            label: 'Rune',
                            value: 'Rune'
                          },
                          {
                            label: 'Ingredient',
                            value: 'Ingredient'
                          },
                          {
                            label: 'Quest',
                            value: 'Quest'
                          },
                          {
                            label: 'Undercloth',
                            value: 'Undercloth'
                          },
                          {
                            label: 'Mount',
                            value: 'Mount'
                          },
                          {
                            label: 'Key',
                            value: 'Key'
                          },
                          {
                            label: 'Container',
                            value: 'Container'
                          },
                          {
                            label: 'Misc',
                            value: 'Misc'
                          },
                        ]}
                        onChange={(option) => updateRarityFilter(option.value)}
                      />
                    </LabelWrapper> */}
                    {/* <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>SLOT</Text>
                      <Select
                        value={rarityFilter}
                        options={[
                          {
                            label: 'All',
                            value: '',
                          },
                          {
                            label: 'Left Hand',
                            value: 'Left Hand'
                          },
                          {
                            label: 'Right Hand',
                            value: 'Right Hand'
                          },
                          {
                            label: 'Head',
                            value: 'Head'
                          },
                          {
                            label: 'Neck',
                            value: 'Neck'
                          },
                          {
                            label: 'Legs',
                            value: 'Legs'
                          },
                          {
                            label: 'Chest',
                            value: 'Chest'
                          },
                          {
                            label: 'Body',
                            value: 'Body'
                          },
                          {
                            label: 'Waist',
                            value: 'Waist'
                          },
                          {
                            label: 'Hands',
                            value: 'Hands'
                          },
                          {
                            label: 'Wrists',
                            value: 'Wrists'
                          },
                          {
                            label: 'Shoulders',
                            value: 'Shoulders'
                          },
                          {
                            label: 'Feet',
                            value: 'Feet'
                          },
                          {
                            label: 'Finger 1',
                            value: 'Finger 1'
                          },
                          {
                            label: 'Finger 2',
                            value: 'Finger 2'
                          },
                          {
                            label: 'Trinket 1',
                            value: 'Trinket 1'
                          },
                          {
                            label: 'Trinket 2',
                            value: 'Trinket 2'
                          },
                          {
                            label: 'Trinket 3',
                            value: 'Trinket 3'
                          },
                          {
                            label: 'Companion',
                            value: 'Companion'
                          },
                          {
                            label: 'Mount',
                            value: 'Mount'
                          },
                          {
                            label: 'Pet',
                            value: 'Pet'
                          },
                        ]}
                        onChange={(option) => updateRarityFilter(option.value)}
                      />
                    </LabelWrapper> */}
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>RUNEWORD</Text>
                      <ReactSelect
                        value={
                          query.length
                            ? runewordOptions.find((r) =>
                                query.map((q) => q?.toLowerCase()).includes(r.value.toLowerCase())
                              )
                            : runewordOptions[0]
                        }
                        options={runewordOptions}
                        theme={selectTheme()}
                        onChange={(option) => {
                          // setQuery(option.value)
                          updateHistory('query', [option.value]);
                        }}
                      />
                    </LabelWrapper>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>STATUS</Text>
                      <ReactSelect
                        theme={selectTheme()}
                        value={statusOptions.find((o) => o.value === statusFilter)}
                        options={statusOptions}
                        onChange={(option) => updateStatusFilter(option.value)}
                      />
                    </LabelWrapper>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>GAME</Text>
                      <ReactSelect
                        theme={selectTheme()}
                        value={branchOptions.find((o) => o.value === branchFilter)}
                        options={branchOptions}
                        onChange={handleBranchFilterChange}
                      />
                    </LabelWrapper>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>SORT BY</Text>
                      <ReactSelect
                        value={sortOptions.find((o) => o.value === sortFilter)}
                        options={sortOptions}
                        theme={selectTheme()}
                        onChange={handleSortFilterChange}
                      />
                    </LabelWrapper>
                    <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                      <Text>SHOW</Text>
                      <ReactSelect
                        theme={selectTheme()}
                        value={showOptions.find((o) => o.value === count + '')}
                        options={showOptions}
                        onChange={(option: any) => updateCount(option.value)}
                      />
                    </LabelWrapper>
                    {account === '0xa987f487639920A3c2eFe58C8FBDedB96253ed9B' ? (
                      <>
                        <hr style={{ width: '100%' }} />
                        <Button variant="text" onClick={addAttributeFilter}>
                          Attribute Filters <BsPlusSquare style={{ marginLeft: 10 }} />
                        </Button>
                        {attributeFilters.map((attributeFilter) => (
                          <LabelWrapper style={{ marginBottom: 15, width: '100%' }}>
                            <Text>ATTRIBUTE</Text>
                            <ReactSelect
                              theme={selectTheme()}
                              closeMenuOnSelect={false}
                              components={{ AttributeInput } as any}
                              defaultValue={[
                                {
                                  label: 'Not Leader Skill Bonus',
                                  value: 'Not Leader Skill Bonus',
                                },
                                {
                                  label: '>=',
                                  value: '>=',
                                },
                              ]}
                              isMulti
                              options={attributeStepOptions[attributeFilter.step]}
                              onChange={(option: any) => {
                                console.log(option);
                              }}
                            />
                          </LabelWrapper>
                        ))}
                      </>
                    ) : null}
                  </FilterContainer>
                </ControlContainer>

                {currentTrades !== undefined ? (
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <hr style={{ width: '100%' }} />
                    <h3
                      css={css`
                        text-align: center;
                        margin-top: 5px;
                      `}>
                      Found {currentTrades.length === count ? currentTrades.length + '+' : currentTrades.length} results
                    </h3>
                    {isFiltered ? (
                      <Button variant="text" onClick={clearFilters}>
                        <CgClose style={{ marginRight: 5 }} />{' '}
                        <span
                          css={css`
                            font-family: 'webfontexl', sans-serif;
                            font-size: 0.8rem;
                          `}>
                          CLEAR FILTERS
                        </span>
                      </Button>
                    ) : null}
                  </Flex>
                ) : null}
              </CardBody>
            </Card>
          </div>
        ) : null}

        <div style={{ gridColumn: isMobile || query.find((q) => isFundraiserAddress(q)) ? 'span 12' : 'span 9' }}>
          <Card style={{ width: '100%', overflow: 'visible' }}>
            <CardBody>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <ButtonMenu activeIndex={tab} scale="md" onItemClick={(index) => updateTab(index)}>
                  <ButtonMenuItem>{t('Skins')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Pets')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Items')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Land')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('NPCs')}</ButtonMenuItem>
                </ButtonMenu>
              </Flex>
            </CardBody>
            {tab === 0 ? (
              <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
                <MainHeading>Coming Soon</MainHeading>
              </InfiniteFlex>
            ) : null}
            {/* {tab === 1 ? (
              <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
                {currentTrades === undefined ? <MainHeading>Finding trades...</MainHeading> : null}
                {currentTrades !== undefined ? (
                  <>
                    <ItemLayout>
                      {currentTrades.map((trade, index) => (
                        <ItemCard
                          key={`trade-${trade.id}-${index}`}
                          trade={trade}
                          account={account}
                          advanced={advanced}
                        />
                      ))}
                    </ItemLayout>
                  </>
                ) : null}
              </InfiniteFlex>
            ) : null} */}
            {tab === 2 || tab === 1 ? (
              <>
                {advanced && currentTrades === undefined ? (
                  <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
                ) : null}
                {advanced && currentTrades !== undefined ? (
                  <div style={{ padding: '0 10px' }}>
                    <ItemCatalogFull
                      sort={sortFilter.toLowerCase()}
                      rows={isMobile ? 4 : 10}
                      tokens={currentTrades.map((t2) => t2.tokenId)}
                      autoColumn
                      rightSidedInfo={!isMobile}
                      showControls={false}
                      selectMode={selectMode}
                      defaultBranch={branchFilter}
                      onItemMultiSelected={onItemMultiSelected}
                    />
                  </div>
                ) : (
                  <InfiniteFlex
                    id="infinite-wrapper"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center">
                    {currentTrades === undefined ? (
                      <Skeleton height="80px" mb="16px" mt="16px" ml="16px" mr="16px" />
                    ) : null}
                    {currentTrades !== undefined ? (
                      <>
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
                        {/* {!advanced && !isFundraiserAddress(query) ? (
                          <>
                            <MainHeading>{currentTrades.length} Results</MainHeading>
                            <br />
                          </>
                        ) : null} */}
                        <CardBody style={{ zoom: 0.8 }}>
                          <ItemLayout>
                            {currentTrades.map((trade, index) => (
                              <ItemCard
                                key={`trade-${trade.id}-${index}`}
                                trade={trade}
                                account={account}
                                advanced={advanced}
                              />
                            ))}
                          </ItemLayout>
                        </CardBody>
                        {/* </InfiniteScroll> */}
                      </>
                    ) : null}
                  </InfiniteFlex>
                )}
              </>
            ) : null}
            {tab === 3 ? (
              <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
                <MainHeading>Coming soon</MainHeading>
              </InfiniteFlex>
            ) : null}
            {tab === 4 ? (
              <InfiniteFlex id="infinite-wrapper" flexDirection="column" alignItems="center" justifyContent="center">
                <MainHeading>Coming soon</MainHeading>
              </InfiniteFlex>
            ) : null}
            <br />
          </Card>
        </div>
      </Cards>
      <br />
      <br />

      {/* <ControlContainer>
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
            <Text>Per Page</Text>
            <Select
              value={count}
              options={[
                {
                  label: '10',
                  value: '10',
                },
                {
                  label: '25',
                  value: '25',
                },
                {
                  label: '50',
                  value: '50',
                },
                {
                  label: '100',
                  value: '100',
                },
                {
                  label: '250',
                  value: '250',
                },
                {
                  label: '500',
                  value: '500',
                },
                {
                  label: '1000',
                  value: '1000',
                },
              ]}
              onChange={(option) => updatecount(option.value)}
            />
          </LabelWrapper>
        </FilterContainer>
      </ControlContainer> */}
      {/* <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/topics">
          <Topics />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch> */}
    </Container>
  );
};

// const Market = (props) => {
//   const [playSelect] = useSound(selectSound)
//   const [playAction] = useSound(actionSound, { volume: 0.5 })
//   const contextState = {
//     playSelect,
//     playAction,
//   }
//   return (
//     <SoundContext.Provider value={contextState}>
//       <MarketInner {...props} />
//     </SoundContext.Provider>
//   )
// }

Market.defaultProps = {};

export default Market;

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  // color: ${(props) => props.theme.colors.primary};
`;
