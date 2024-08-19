import React, { useEffect, useLayoutEffect, useMemo, useRef, useState, useContext, useCallback } from 'react';
import useSound from 'use-sound';
import { Button } from '~/ui';
import styled from 'styled-components';
import ItemInformation from '~/components/ItemInformation';
import { BigNumber } from 'bignumber.js';
import useInventory from '~/hooks/useInventory';
import useCache from '~/hooks/useCache';
import ItemsGrid from '~/components/ItemsGrid';
import ItemsContext from '~/contexts/ItemsContext';
import useWeb3 from '~/hooks/useWeb3';
import { useRunePrice } from '~/state/hooks';
import SoundContext from '~/contexts/SoundContext';
import useRuneBalance from '~/hooks/useRuneBalance';
import { getBalanceNumber } from '~/utils/formatBalance';
import getItems, { emptyItem } from '~/utils/getItems';
import { decodeItem } from '@arken/node/util/decoder'; // 'src/utils/decodeItem' //
import { orderBy } from 'lodash';
import useSettings from '~/hooks/useSettings2';
import useGetWalletItems from '~/hooks/useGetWalletItems';
import {
  getIndexFromMaxtrixPosition,
  getMatrixPositionFromIndex,
  goDown,
  goLeft,
  goRight,
  goUp,
} from '~/utils/keyboardNavigation';
import CategoriesMenu from '~/components/CategoriesMenu';
import NavigationArrow from '~/components/NavigationArrow';
import { NavigationArrowVariant } from '~/components/NavigationArrow';
import navigateToDirection from '~/utils/navigateToDirection';
import { ItemsBonusType, ItemType } from '@arken/node/data/items.type';
import EnduranceGauge from '~/components/EnduranceGauge';
import { itemData as itemDataJson } from '@arken/node/data/items';
import { ItemsMainCategoriesType, ItemCategoriesType } from '@arken/node/data/items.type';
import BonusList from './BonusList';

const NoItems = styled.div`
  margin: 0 auto;
  padding: 1.4rem;
`;
const Container = styled.div`
  // margin-bottom: 30px;
`;

const Grid = styled.div`
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`;

const sortItems = (list, filterSort) => {
  switch (filterSort) {
    case 'hot':
      return orderBy(list, (val) => Number(val.hotness), 'desc');
    case 'name':
      return orderBy(list, (val) => Number(val.name), 'desc');
    case 'perfection':
      return orderBy(list, (val) => Number(val.perfection), 'desc');
    // case 'earned':
    //   return orderBy(list, (item) => (item.userData ? item.userData.earnings : 0), 'desc')
    // case 'liquidity':
    //   return orderBy(list, (item) => Number(item.liquidity), 'desc')
    default:
      return list;
  }
};

const itemData = JSON.parse(JSON.stringify(itemDataJson));

const InventoryInner = ({
  address,
  showFull,
  showItemDropdown,
  onItemSelected,
  onItemMultiSelected,
  defaultItemSelected,
  columns,
  rows,
  hideExtras,
  showUnobtained,
  showCategories,
  showNames,
  showQuantity,
  hideArrows,
  noDisabled,
  hideCategories,
  filterPerfectOnly,
  filterSort,
  filterQuery,
  selectMode,
  page: page2,
  direction: direction2,
  defaultBranch,
  children,
}) => {
  const { account: _account } = useWeb3();
  const account = address || _account;
  const { fetchAddress } = useCache();
  const { nfts: itemTokenIds, items: decodedItemData, refresh: walletRefresh, setUserAddress } = useGetWalletItems();
  // const origItems = getItems(itemData, rows * columns)

  const refresh = () => {
    walletRefresh();
    setLastUpdateRequested(Date.now());
  };

  const [itemMultiSelected, _setItemMultiSelected] = useState({});
  const [itemsPaginated, setItemsPaginated] = useState<any>(null);
  const [[page, direction], _setPage] = useState([page2, direction2]);
  const [_itemSelected, _setItemSelected] = useState(defaultItemSelected || null);
  const [itemPreviewed, _setItemPreviewed] = useState(null);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [showAll, setShowAll] = useState(!account || showFull);
  const [lastUpdateRequested, setLastUpdateRequested] = useState(Date.now());
  const [cachedItems, setCachedItems] = useState('');
  const cachedFiltersRef = useRef(JSON.stringify({ filterPerfectOnly, filterQuery, filterSort }));
  const cachedTokensRef = useRef(null);
  const inventory = useInventory();

  const itemSelected = parseInt((_itemSelected ? _itemSelected + '' : '0').replace('inventory', '') || '0');

  const balances = inventory.runes;

  useEffect(() => {
    console.log('Setting inventory user address', account);
    setUserAddress(account);
    fetchAddress(account);
    // try {
    //   throw Error('sss')
    // } catch(e) {
    //   console.log(e.stack)
    // }
    // if (!account) return
    // const newCachedItems = JSON.stringify(itemTokenIds)

    // const didItemsChange = cachedItems !== newCachedItems

    const newFilters = JSON.stringify({ filterPerfectOnly, filterQuery, filterSort, balances });

    const didFiltersChange = cachedFiltersRef.current !== newFilters;

    if (didFiltersChange) {
      console.log('Inventory filters changed');
      // if(page !== 0 || direction !== 0) {
      _setPage(() => [0, 0]);
      // }

      cachedFiltersRef.current = newFilters;
    }

    const newTokens = JSON.stringify(itemTokenIds);

    const didTokensChange = cachedTokensRef.current !== newTokens;

    if (!didTokensChange && !didFiltersChange) {
      return;
    }

    cachedTokensRef.current = newTokens;
    console.log('Inventory tokens changed');
    console.log('Regenerating inventory');

    // setCachedItems(newCachedItems)

    itemData[ItemsMainCategoriesType.WEAPONS] = [];
    itemData[ItemsMainCategoriesType.ARMORS] = [];
    itemData[ItemsMainCategoriesType.SHIELDS] = [];
    itemData[ItemsMainCategoriesType.ACCESSORIES] = [];
    // itemData[ItemsMainCategoriesType.RUNES] = itemData[ItemsMainCategoriesType.RUNES]

    for (const item of itemData[ItemsMainCategoriesType.RUNES]) {
      item.value = balances[item.id - 1] ? `${balances[item.id - 1]}` : '0';
    }

    for (const i of Object.keys(itemTokenIds)) {
      if (!itemTokenIds[i] || !itemTokenIds[i].tokenIds) continue;

      const arcaneItems = [];

      for (const rawTokenId of itemTokenIds[i].tokenIds) {
        const tokenId = new BigNumber(rawTokenId + '').toString();
        // for (let i2 = 1; i2 < 100; i2++) {
        if (tokenId.length < 18) continue; // old IDs
        if (arcaneItems.find((a) => a.tokenId === tokenId)) continue;
        // console.log(new BigNumber(tokenId + '').toString())
        // console.log(decodedItemData[new BigNumber(tokenId + '').toString()])
        const arcaneItem = decodeItem(tokenId);
        // const arcaneItem = decodedItemData[new BigNumber(tokenId + '').toString()]

        if (!arcaneItem) continue;
        if (arcaneItem.name) {
          arcaneItem.isEquipped = false;
          arcaneItem.isEquipable = true;
          // arcaneItem.tokenId = tokenId
          arcaneItems.push(arcaneItem);
        }
        // if (itemData[arcaneItem.category].length < 40) {
        // }
        // }
      }

      const arcaneItemsGrouped = arcaneItems.reduce((groups, item) => {
        const groupKey = `${item.id}${item.attributes.map((a) => a.value)}`;
        const group = groups[groupKey] || [];
        group.push(item);
        return {
          ...groups,
          [groupKey]: group,
        };
      }, {});

      for (const key of Object.keys(arcaneItemsGrouped)) {
        const arcaneItemGroup = arcaneItemsGrouped[key];
        const groupedItem = {
          ...arcaneItemGroup[0],
          value: `${arcaneItemGroup.length}`,
          tokenIds: [],
        };

        for (const arcaneItem of arcaneItemGroup) {
          groupedItem.tokenIds.push(arcaneItem.tokenId);
        }

        itemData[groupedItem.category].push(groupedItem);
      }
    }

    // const ttl = 3 * 24 * 60 * 60 * 1000

    // console.log(JSON.stringify({
    //   expiry: (new Date()).getTime() + ttl,
    //   value: getTokenCache()
    // }))
    // localStorage.setItem('tokenCache', JSON.stringify({
    //   expiry: (new Date()).getTime() + ttl,
    //   value: getTokenCache()
    // }))

    for (const cat in itemData) {
      if (cat === ItemsMainCategoriesType.RUNES) continue;

      if (filterPerfectOnly) {
        console.log('filterPerfectOnly');
        itemData[cat] = itemData[cat].filter((val) => val.perfection === 1);
      }

      if (filterQuery) {
        itemData[cat] = itemData[cat].filter((val) => val.name.toLowerCase().indexOf(filterQuery) !== -1);
      }

      if (filterSort) {
        itemData[cat] = sortItems(itemData[cat], filterSort);
      }
    }
    // itemData[ItemsMainCategoriesType.WEAPONS].push({
    //   ...decodeItem('100100001100910001000111131'),
    //   value: '1',
    // })
    // itemData[ItemsMainCategoriesType.WEAPONS].push({
    //   ...decodeItem('100100002100510301030111131'),
    //   value: '1',
    // })
    // itemData[ItemsMainCategoriesType.ARMORS].push({
    //   ...decodeItem('100100003100210021000111131'),
    //   value: '1',
    // })
    // console.log(itemData)
    setItemsPaginated(getItems(itemData, rows * columns, showCategories, showAll || showUnobtained));
  }, [
    account,
    decodedItemData,
    itemTokenIds,
    balances,
    cachedFiltersRef,
    lastUpdateRequested,
    filterQuery,
    filterSort,
    filterPerfectOnly,
    showUnobtained,
    showCategories,
    columns,
    showAll,
    rows,
    setUserAddress,
    fetchAddress,
  ]);

  const [itemsEquipped, setItemsEquipped] = useState<{
    [key: string]: ItemType;
  }>({});
  const inventoryRef = useRef<HTMLDivElement>(null);

  const [activeBonus, setActiveBonus] = useState({
    [ItemsBonusType.FIRE]: 0,
    [ItemsBonusType.SWIMMING]: 0,
    [ItemsBonusType.CLIMBING]: 0,
  });
  const { quality } = useSettings();

  const { playSelect, playAction } = useContext(SoundContext);

  const elPrice = useRunePrice('EL');
  const tirPrice = useRunePrice('TIR');
  const eldPrice = useRunePrice('ELD');
  const nefPrice = useRunePrice('NEF');
  const ethPrice = useRunePrice('ETH');
  const ithPrice = useRunePrice('ITH');
  const talPrice = useRunePrice('TAL');
  const ralPrice = useRunePrice('RAL');
  const ortPrice = useRunePrice('ORT');
  const thulPrice = useRunePrice('THUL');
  const amnPrice = useRunePrice('AMN');
  const solPrice = useRunePrice('SOL');
  const shaelPrice = useRunePrice('SHAEL');
  const dolPrice = useRunePrice('DOL');
  const helPrice = useRunePrice('HEL');
  const ioPrice = useRunePrice('IO');
  const lumPrice = useRunePrice('LUM');
  const koPrice = useRunePrice('KO');
  const falPrice = useRunePrice('FAL');
  const lemPrice = useRunePrice('LEM');
  const pulPrice = useRunePrice('PUL');
  const umPrice = useRunePrice('UM');
  const malPrice = useRunePrice('MAL');
  const istPrice = useRunePrice('IST');
  const gulPrice = useRunePrice('GUL');
  const vexPrice = useRunePrice('VEX');
  const ohmPrice = useRunePrice('OHM');
  const loPrice = useRunePrice('LO');
  const surPrice = useRunePrice('SUR');
  const berPrice = useRunePrice('BER');
  const jahPrice = useRunePrice('JAH');
  const chamPrice = useRunePrice('CHAM');
  const zodPrice = useRunePrice('ZOD');

  const prices = {
    1: elPrice.toNumber(),
    2: eldPrice.toNumber(),
    3: tirPrice.toNumber(),
    4: nefPrice.toNumber(),
    5: ethPrice.toNumber(),
    6: ithPrice.toNumber(),
    7: talPrice.toNumber(),
    8: ralPrice.toNumber(),
    9: ortPrice.toNumber(),
    10: thulPrice.toNumber(),
    11: amnPrice.toNumber(),
    12: solPrice.toNumber(),
    13: shaelPrice.toNumber(),
    14: dolPrice.toNumber(),
    15: helPrice.toNumber(),
    16: ioPrice.toNumber(),
    17: lumPrice.toNumber(),
    18: koPrice.toNumber(),
    19: falPrice.toNumber(),
    20: lemPrice.toNumber(),
    21: pulPrice.toNumber(),
    22: umPrice.toNumber(),
    23: malPrice.toNumber(),
    24: istPrice.toNumber(),
    25: gulPrice.toNumber(),
    26: vexPrice.toNumber(),
    27: ohmPrice.toNumber(),
    28: loPrice.toNumber(),
    29: surPrice.toNumber(),
    30: berPrice.toNumber(),
    31: jahPrice.toNumber(),
    32: chamPrice.toNumber(),
    33: zodPrice.toNumber(),
  };

  const totalPages = itemsPaginated ? itemsPaginated.length : 0;

  const setItemPreviewed = (value) => {
    _setItemPreviewed(value);
  };

  const setItemSelected = (value) => {
    _setItemSelected(() => value);

    const { items } = itemsPaginated[page];
    onItemSelected?.(value, items[value]);
  };

  const setItemMultiSelected = (value) => {
    if (itemMultiSelected[value]) {
      delete itemMultiSelected[value];
    } else {
      itemMultiSelected[value] = true;
    }

    _setItemMultiSelected(JSON.parse(JSON.stringify(itemMultiSelected)));

    onItemMultiSelected?.(value, itemMultiSelected);
  };

  const closeModal = () => {
    setIsModalOpened(false);
    if (inventoryRef.current) {
      inventoryRef.current.focus();
    }
  };

  const equipItem = () => {
    if (!itemSelected) return;

    const { items } = itemsPaginated[page];
    const itemSelectedData = items[itemSelected];
    setItemsEquipped({
      ...itemsEquipped,
      [itemSelectedData.category]: itemSelectedData,
    });
    playAction();
  };

  const dropItem = () => {
    if (!itemSelected) return;

    const newItemsPaginated = [...itemsPaginated];
    newItemsPaginated[page].items.splice(itemSelected, 1);
    newItemsPaginated[page].items.push(emptyItem);
    setItemsPaginated(newItemsPaginated);
    playAction();
  };

  const contextState = {
    setItemSelected,
    setItemMultiSelected,
    itemMultiSelected,
    itemPreviewed,
    setItemPreviewed,
    itemSelected: _itemSelected,
    isModalOpened,
    setIsModalOpened,
    closeModal,
    equipItem,
    dropItem,
    itemsEquipped,
  };

  const setPage = useCallback(
    async ([p, d]: any) => {
      if (!itemsPaginated[p] || !itemsPaginated[p].items.length) return;
      _setItemSelected('inventory' + 0);
      await _setPage([p, d]);
      if (p !== page) {
        // Get framer working
        // await setItemSelected(1)
        // setItemSelected(0)
      }
    },
    [_setPage, _setItemSelected, itemsPaginated, page]
  );

  const setCategory = async ([c, p]: any) => {
    const pageOfCategory = itemsPaginated.find((i) => i.mainCategory === c);
    if (!pageOfCategory) return;
    _setItemSelected('inventory' + 0);
    await _setPage([pageOfCategory.page, p]);
  };

  const handleKeyPressed = (event: React.KeyboardEvent) => {
    let newItemSelected = null;
    const positionItemSelected = getMatrixPositionFromIndex(itemSelected, columns);

    let pageAfterChange = page;
    const { items } = itemsPaginated[page];
    const isSelectedItemNotEmpty =
      itemSelected !== null && items[itemSelected] ? items[itemSelected].name !== '' : false;
    switch (event.key) {
      case 'ArrowUp':
        newItemSelected = goUp(positionItemSelected);
        if (quality === 'good') playSelect();
        break;
      case 'ArrowDown':
        newItemSelected = newItemSelected = goDown(positionItemSelected, rows);
        if (quality === 'good') playSelect();
        break;
      case 'ArrowLeft':
        if (positionItemSelected.y === 0) {
          pageAfterChange = navigateToDirection(-1, page, setPage, itemsPaginated.length - 1);
        }
        newItemSelected = goLeft(positionItemSelected, columns);
        if (quality === 'good') playSelect();
        break;
      case 'ArrowRight':
        if (positionItemSelected.y === columns - 1 || positionItemSelected.y === items.length - 1 || !items.length) {
          pageAfterChange = navigateToDirection(1, page, setPage, itemsPaginated.length - 1);
        }

        if (page === pageAfterChange) newItemSelected = goRight(positionItemSelected, columns);
        else newItemSelected = { x: 0, y: 0 };

        if (quality === 'good') playSelect();
        break;
      case 'Enter':
        if (isSelectedItemNotEmpty) {
          setIsModalOpened(!isModalOpened);
        }
        playAction();
        break;
      default:
        break;
    }

    if (newItemSelected) {
      const newItemSelectedResolved = getIndexFromMaxtrixPosition(newItemSelected, columns);

      if (itemsPaginated[pageAfterChange] && itemsPaginated[pageAfterChange].items[newItemSelectedResolved]) {
        setItemSelected('inventory' + newItemSelectedResolved);
      }
    }

    event.stopPropagation();
    event.preventDefault();
  };

  // useEffect(() => {
  //   const bonusEquipped = Object.values(itemsEquipped).map((item) => item.bonus)

  //   const defaultAccumulator = {
  //     [ItemsBonusType.FIRE]: 0,
  //     [ItemsBonusType.SWIMMING]: 0,
  //     [ItemsBonusType.CLIMBING]: 0,
  //   }

  //   const newActiveBonus = bonusEquipped.reduce((accumulator, currentValue) => {
  //     if (currentValue) {
  //       accumulator[currentValue] += 1
  //     }
  //     return accumulator
  //   }, defaultAccumulator)

  //   setActiveBonus(newActiveBonus)
  // }, [itemsEquipped])

  const walletRefresh2 = useRef(walletRefresh);

  // useEffect(() => {
  //   console.log('Refreshing from Inventory component');
  //   walletRefresh2.current();
  // }, [walletRefresh2]);

  const defaultItemSelectedIndex =
    defaultItemSelected && itemsPaginated && itemsPaginated[page]
      ? itemsPaginated[page].items.indexOf(itemsPaginated[page].items.find((i) => i.id === defaultItemSelected.id))
      : 0;

  // useLayoutEffect(() => {
  //   if (account) {
  //     if (itemsPaginated?.[page]?.items?.length) return; // We're already somewhere decent

  //     console.log('Resetting inventory page');
  //     _setItemSelected('inventory' + defaultItemSelectedIndex);
  //     _setPage([0, 0]);
  //     setShowAll(showFull);
  //   }
  // }, [account, defaultItemSelectedIndex, itemsPaginated, page, showFull, _setPage, _setItemSelected]);

  if (!itemsPaginated || !itemsPaginated[page]) {
    return <></>;
  }
  // useEffect(() => {
  //   if (init) return
  //   init = true
  //   // Get framer working
  //   setItemSelected(0)
  // }, [setItemSelected, itemSelected])

  const onMouseLeave = () => {
    // if (isMobile) return
    // setShowInformation(false)
    // setIsModalOpened && setIsModalOpened(false)
    // console.log(888,222)
    setItemPreviewed(null);
  };

  return (
    <Container ref={inventoryRef} onKeyDown={handleKeyPressed} className="font-calamity outline-none" tabIndex={0}>
      <div className="container mx-auto flex flex-col">
        {!hideExtras && !hideCategories ? (
          <CategoriesMenu categorySelected={itemsPaginated[page].mainCategory} setCategory={setCategory} />
        ) : null}
        <Grid className="flex flex-col justify-center w-full mx-auto relative">
          <ItemsContext.Provider value={contextState}>
            <div className="flex" onMouseLeave={onMouseLeave}>
              {itemsPaginated[page].items.length ? (
                <ItemsGrid
                  id="inventory"
                  direction={direction}
                  page={page}
                  items={itemsPaginated[page].items}
                  showAll={showAll}
                  showItemDropdown={showItemDropdown}
                  showNames={showNames}
                  showQuantity={showQuantity}
                  columns={columns}
                  rows={rows}
                  noDisabled={noDisabled}
                  disableAnimation={totalPages >= 10}
                  selectMode={selectMode}
                  defaultBranch={defaultBranch}
                  isSelectable
                />
              ) : (
                <NoItems>
                  Empty.{' '}
                  {/* <Button variant="text" onClick={refresh} style={{ padding: 0 }}>
                    Refresh?
                  </Button> */}
                </NoItems>
              )}
            </div>
          </ItemsContext.Provider>
          {!hideArrows ? (
            <NavigationArrow
              currentPage={page}
              setPage={setPage}
              variant={NavigationArrowVariant.LEFT}
              maxPage={Object.keys(itemsPaginated).length}
            />
          ) : null}
          {!hideArrows ? (
            <NavigationArrow
              currentPage={page}
              setPage={setPage}
              variant={NavigationArrowVariant.RIGHT}
              maxPage={Object.keys(itemsPaginated).length}
            />
          ) : null}
        </Grid>
        {!hideExtras ? (
          <div className="flex flex-col items-center self-end w-full my-6">
            {!showFull ? (
              <Button
                onClick={() => {
                  setShowAll(!showAll);
                }}>
                {showAll ? 'Hide' : 'Show'} Full List
              </Button>
            ) : null}
            {/* <img className="absolute hidden top-0 z-0" src={linkImage} alt="link" /> */}
            {/* <div className="flex flex-row items-center justify-center ">
              <EnduranceGauge />
              <BonusList fire={3} swimming={3} climbing={3} />
            </div> */}
            {itemSelected !== null &&
            (itemsPaginated[page].items[itemSelected]
              ? itemsPaginated[page].items[itemSelected].name !== ''
              : false) ? (
              <ItemInformation
                item={itemsPaginated[page].items[itemSelected]}
                price={prices[itemsPaginated[page].items[itemSelected].id] || 0}
                defaultBranch={defaultBranch}
              />
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </Container>
  );
};

const Inventory = ({
  showFull,
  address = null,
  filterPerfectOnly = null,
  filterSort = null,
  filterQuery = null,
  onItemSelected = null,
  onItemMultiSelected = null,
  showItemDropdown = true,
  columns = 6,
  rows = 4,
  hideExtras = false,
  showUnobtained = false,
  showNames = false,
  hideArrows = false,
  showQuantity = true,
  showCategories = null,
  noDisabled = false,
  hideCategories = false,
  defaultItemSelected = null,
  page = 0,
  direction = 0,
  children = null,
  defaultBranch = undefined,
  selectMode = false,
}) => {
  const [playSelect] = useSound('/assets/sounds/select.mp3');
  const [playAction] = useSound('/assets/sounds/action.mp3', { volume: 0.5 });
  const contextState = {
    playSelect,
    playAction,
  };

  return (
    <SoundContext.Provider value={contextState}>
      <InventoryInner
        address={address}
        showFull={showFull}
        showItemDropdown={showItemDropdown}
        onItemSelected={onItemSelected}
        onItemMultiSelected={onItemMultiSelected}
        defaultItemSelected={defaultItemSelected}
        columns={columns}
        rows={rows}
        hideExtras={hideExtras}
        page={page}
        showCategories={showCategories}
        showUnobtained={showUnobtained}
        showNames={showNames}
        hideCategories={hideCategories}
        direction={direction}
        hideArrows={hideArrows}
        showQuantity={showQuantity}
        noDisabled={noDisabled}
        filterPerfectOnly={filterPerfectOnly}
        filterSort={filterSort}
        filterQuery={filterQuery}
        selectMode={selectMode}
        defaultBranch={defaultBranch}>
        {children}
      </InventoryInner>
    </SoundContext.Provider>
  );
};

Inventory.defaultProps = {
  showFull: false,
};

export default Inventory;
