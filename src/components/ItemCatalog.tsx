import { BigNumber } from 'bignumber.js'
import { formatDistance, parseISO } from 'date-fns'
import { orderBy } from 'lodash'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { ItemType as ItemTypeType } from 'rune-backend-sdk/build/data/items'
import { ItemsBonusType, ItemType } from 'rune-backend-sdk/build/data/items.type'
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder' // 'src/utils/decodeItem' //
import styled, { css } from 'styled-components'
import useSound from 'use-sound'
import CategoriesMenu from '~/components/CategoriesMenu'
import ItemInformation from '~/components/ItemInformation'
import ItemsGrid from '~/components/ItemsGrid'
import NavigationArrow, { NavigationArrowVariant } from '~/components/NavigationArrow'
import ItemsContext from '~/contexts/ItemsContext'
import SoundContext from '~/contexts/SoundContext'
import useCache from '~/hooks/useCache'
import useMarket from '~/hooks/useMarket'
import useSettings from '~/hooks/useSettings'
import useWeb3 from '~/hooks/useWeb3'
import { getUsername } from '~/state/profiles/getProfile'
import { Button, Flex } from '~/ui'
import getItems, { emptyItem } from '~/utils/getItems'
import {
  getIndexFromMaxtrixPosition,
  getMatrixPositionFromIndex,
  goDown,
  goLeft,
  goRight,
  goUp,
} from '~/utils/keyboardNavigation'
import navigateToDirection from '~/utils/navigateToDirection'
import { itemData as itemDataJson } from 'rune-backend-sdk/build/data/items'
import { ItemsMainCategoriesType } from 'rune-backend-sdk/build/data/items.type'

const NoItems = styled.div`
  margin: 0 auto;
  padding: 1.4rem;
`
const Container = styled.div`
  width: 100%;
  min-height: 400px;
  // margin-bottom: 30px;
  position: relative;
`

const Grid = styled.div`
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
`

const sortItems = (list, filterSort) => {
  switch (filterSort) {
    case 'hot':
      return orderBy(list, (val) => Number(val.hotness), 'desc')
    case 'name':
      return orderBy(list, (val) => Number(val.name), 'desc')
    case 'perfection':
      return orderBy(list, (val) => Number(val.perfection), 'desc')
    // case 'earned':
    //   return orderBy(list, (item) => (item.userData ? item.userData.earnings : 0), 'desc')
    // case 'liquidity':
    //   return orderBy(list, (item) => Number(item.liquidity), 'desc')
    default:
      return list
  }
}

const Final = styled.div`
  margin-top: 1em;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  // color: ${(props) => props.theme.colors.primary};
`

function isFundraiserAddress(address) {
  return [
    '0xe619ba5F9F80b8A22cFcAAB357A0Fc2827cf6ECC'.toLowerCase(),
    '0x191727d22f2693100acef8e48F8FeaEaa06d30b1'.toLowerCase(),
  ].includes(address.toLowerCase())
}

const itemData = JSON.parse(JSON.stringify(itemDataJson))

delete itemData.rune

console.log('kkkk', itemData)

const ItemCatalogInner = ({
  address,
  showFull,
  showItemDropdown,
  onItemSelected,
  defaultItemSelected,
  defaultBranch,
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
  page: page2,
  direction: direction2,
  children,
  selectMode,
  onItemMultiSelected,
  rightSidedInfo,
  nfts,
}) => {
  const { tradesByToken } = useMarket()
  const { account: _account } = useWeb3()
  const cache = useCache()
  const account = address || _account

  const [itemsPaginated, setItemsPaginated] = useState<any>(null)
  const [itemPreviewed, _setItemPreviewed] = useState(null)
  const [[page, direction], _setPage] = useState([page2, direction2])
  const [_itemSelected, _setItemSelected] = useState(defaultItemSelected || undefined)
  const [isModalOpened, setIsModalOpened] = useState(false)
  const [showAll, setShowAll] = useState(!account || showFull)
  const cachedFiltersRef = useRef(JSON.stringify({ filterPerfectOnly, filterQuery, filterSort }))
  const cachedTokensRef = useRef(null)

  const itemSelected = parseInt((_itemSelected ? _itemSelected + '' : '0').replace('catalog', '') || '0')

  useEffect(() => {
    async function run() {
      const newFilters = JSON.stringify({
        filterPerfectOnly,
        filterQuery,
        filterSort,
        tradesByTokenLength: tradesByToken?.length,
      })

      const didFiltersChange = cachedFiltersRef.current !== newFilters

      if (didFiltersChange) {
        console.log('Item catalog filters changed')
        _setPage(() => [0, 0])

        cachedFiltersRef.current = newFilters
      }

      if (!nfts) return

      const newTokens = JSON.stringify(nfts)

      const didTokensChange = cachedTokensRef.current !== newTokens

      if (!didTokensChange && !didFiltersChange) {
        return
      }

      cachedTokensRef.current = newTokens
      console.log('Regenerating item catalog')

      itemData[ItemsMainCategoriesType.WEAPONS] = []
      itemData[ItemsMainCategoriesType.ARMORS] = []
      itemData[ItemsMainCategoriesType.SHIELDS] = []
      itemData[ItemsMainCategoriesType.ACCESSORIES] = []

      const arcaneItems = []

      for (const token of nfts) {
        const tokenId = new BigNumber(token.id + '').toString()
        if (tokenId.length < 18) continue // old IDs
        const arcaneItem = decodeItem(tokenId)

        if (!arcaneItem) continue
        if (!arcaneItem.name) continue
        if (arcaneItems.find((a) => a.tokenId === tokenId)) continue

        if (token.owner) {
          arcaneItem.ownerAddress = token.owner
          arcaneItem.ownerUsername = await getUsername(token.owner)
        }

        arcaneItems.push(arcaneItem)
      }

      const arcaneItemsGrouped = arcaneItems.reduce((groups, item) => {
        const groupKey = `${item.id}${item.attributes.map((a) => a.value)}`
        const group = groups[groupKey] || []
        group.push(item)
        return {
          ...groups,
          [groupKey]: group,
        }
      }, {})

      for (const key of Object.keys(arcaneItemsGrouped)) {
        let arcaneItemGroup = arcaneItemsGrouped[key]

        // Sort by price
        arcaneItemGroup = arcaneItemGroup.sort(function (a, b) {
          const tradeA = tradesByToken[a.tokenId]
          const tradeB = tradesByToken[b.tokenId]

          if (!tradeA && !tradeB) return 0
          if (!tradeA) return 1
          if (!tradeB) return 1

          a.trade = tradeA
          b.trade = tradeB

          if (tradeB.price > tradeA.price) return -1
          if (tradeA.isPromo && tradeB.isPromo) return 0
          if (tradeB.isPromo) return -1

          return 0
        })

        const groupedItem = {
          ...arcaneItemGroup[0],
          value: `${arcaneItemGroup.length}`,
          tokenIds: [],
        }

        for (const arcaneItem of arcaneItemGroup) {
          if (groupedItem.tokenIds.find((a) => a === arcaneItem.tokenId)) continue

          groupedItem.tokenIds.push(arcaneItem.tokenId)
        }

        // for (const tokenId of groupedItem.tokenIds) {
        //   if (tradesByToken[tokenId]) {
        //     tradesByToken[tokenId].otherTokenIds = groupedItem.tokenIds
        //   }
        // }

        itemData[groupedItem.category].push(groupedItem)
      }

      for (const cat in itemData) {
        if (cat === ItemsMainCategoriesType.RUNES) continue

        if (filterPerfectOnly) {
          console.log('filterPerfectOnly')
          itemData[cat] = itemData[cat].filter((val) => val.perfection === 1)
        }

        if (filterQuery) {
          itemData[cat] = itemData[cat].filter((val) => val.name.toLowerCase().indexOf(filterQuery) !== -1)
        }

        if (filterSort) {
          itemData[cat] = sortItems(itemData[cat], filterSort)
        }
      }

      const _itemsPaginationed = getItems(itemData, rows * columns, showCategories, showAll || showUnobtained)

      const firstCategoryFound = _itemsPaginationed.find((i) => !!i.items.find((e) => !!e.tokenId))
      if (firstCategoryFound) {
        _setPage(() => [firstCategoryFound.page, 0])
      }

      setItemsPaginated(_itemsPaginationed)
    }

    run()
  }, [
    account,
    cachedFiltersRef,
    filterQuery,
    filterSort,
    filterPerfectOnly,
    showUnobtained,
    showCategories,
    columns,
    tradesByToken,
    showAll,
    rows,
    nfts,
  ])

  const [itemsEquipped, setItemsEquipped] = useState<{
    [key: string]: ItemType
  }>({})
  const inventoryRef = useRef<HTMLDivElement>(null)

  const [activeBonus, setActiveBonus] = useState({
    [ItemsBonusType.FIRE]: 0,
    [ItemsBonusType.SWIMMING]: 0,
    [ItemsBonusType.CLIMBING]: 0,
  })
  const { quality } = useSettings()

  const [itemMultiSelected, _setItemMultiSelected] = useState({})
  const { playSelect, playAction } = useContext(SoundContext)

  const totalPages = itemsPaginated ? itemsPaginated.length : 0

  const setItemPreviewed = (value) => {
    _setItemPreviewed(value)
  }

  const setItemSelected = (value) => {
    _setItemSelected(() => value)

    const { items } = itemsPaginated[page]
    onItemSelected?.(value, items[value])
  }

  const setItemMultiSelected = (value) => {
    if (itemMultiSelected[value]) {
      delete itemMultiSelected[value]
    } else {
      itemMultiSelected[value] = true
    }

    _setItemMultiSelected(JSON.parse(JSON.stringify(itemMultiSelected)))

    onItemMultiSelected?.(value, itemMultiSelected)
  }

  const closeModal = () => {
    setIsModalOpened(false)
    if (inventoryRef.current) {
      inventoryRef.current.focus()
    }
  }

  const equipItem = () => {
    if (!itemSelected) return

    const { items } = itemsPaginated[page]
    const itemSelectedData = items[itemSelected]
    setItemsEquipped({
      ...itemsEquipped,
      [itemSelectedData.category]: itemSelectedData,
    })
    playAction()
  }

  const dropItem = () => {
    if (!itemSelected) return

    const newItemsPaginated = [...itemsPaginated]
    newItemsPaginated[page].items.splice(itemSelected, 1)
    newItemsPaginated[page].items.push(emptyItem)
    setItemsPaginated(newItemsPaginated)
    playAction()
  }

  const contextState = {
    setItemPreviewed,
    setItemSelected,
    itemMultiSelected,
    itemSelected: _itemSelected,
    itemPreviewed,
    setItemMultiSelected,
    isModalOpened,
    setIsModalOpened,
    closeModal,
    equipItem,
    dropItem,
    itemsEquipped,
  }

  const setPage = useCallback(
    async ([p, d]: any) => {
      if (!itemsPaginated[p] || !itemsPaginated[p].items.length) return
      _setItemSelected('catalog' + 0)
      await _setPage([p, d])
      if (p !== page) {
        // Get framer working
        // await setItemSelected(1)
        // setItemSelected(0)
      }
    },
    [_setPage, _setItemSelected, itemsPaginated, page]
  )

  const setCategory = async ([c, p]: any) => {
    const pageOfCategory = itemsPaginated.find((i) => i.mainCategory === c)
    if (!pageOfCategory) return
    _setItemSelected('catalog' + 0)
    await _setPage([pageOfCategory.page, p])
  }

  const handleKeyPressed = (event: React.KeyboardEvent) => {
    let newItemSelected = null
    const positionItemSelected = getMatrixPositionFromIndex(itemSelected, columns)

    let pageAfterChange = page
    const { items } = itemsPaginated[page]
    const isSelectedItemNotEmpty =
      itemSelected !== null && items[itemSelected] ? items[itemSelected].name !== '' : false
    switch (event.key) {
      case 'ArrowUp':
        newItemSelected = goUp(positionItemSelected)
        if (quality === 'good') playSelect()
        break
      case 'ArrowDown':
        newItemSelected = newItemSelected = goDown(positionItemSelected, rows)
        if (quality === 'good') playSelect()
        break
      case 'ArrowLeft':
        if (positionItemSelected.y === 0) {
          pageAfterChange = navigateToDirection(-1, page, setPage, itemsPaginated.length - 1)
        }
        newItemSelected = goLeft(positionItemSelected, columns)
        if (quality === 'good') playSelect()
        break
      case 'ArrowRight':
        if (positionItemSelected.y === columns - 1 || positionItemSelected.y === items.length - 1 || !items.length) {
          pageAfterChange = navigateToDirection(1, page, setPage, itemsPaginated.length - 1)
        }

        if (page === pageAfterChange) newItemSelected = goRight(positionItemSelected, columns)
        else newItemSelected = { x: 0, y: 0 }

        if (quality === 'good') playSelect()
        break
      case 'Enter':
        if (isSelectedItemNotEmpty) {
          setIsModalOpened(!isModalOpened)
        }
        playAction()
        break
      default:
        break
    }

    if (newItemSelected) {
      const newItemSelectedResolved = getIndexFromMaxtrixPosition(newItemSelected, columns)

      if (itemsPaginated[pageAfterChange] && itemsPaginated[pageAfterChange].items[newItemSelectedResolved]) {
        setItemSelected('catalog' + newItemSelectedResolved)
      }
    }

    event.stopPropagation()
    event.preventDefault()
  }

  const defaultItemSelectedIndex =
    defaultItemSelected && itemsPaginated && itemsPaginated[page]
      ? itemsPaginated[page].items.indexOf(itemsPaginated[page].items.find((i) => i.id === defaultItemSelected.id))
      : 0

  useEffect(() => {
    if (itemsPaginated?.[page]?.items.length && itemSelected === null) {
      _setItemSelected('catalog' + defaultItemSelectedIndex)
    }
    // _setPage([0, 0])
    // setShowAll(showFull)
  }, [account, defaultItemSelectedIndex, page, itemSelected, itemsPaginated, _setItemSelected])

  if (!itemsPaginated || !itemsPaginated[page]) {
    return <></>
  }

  const item = itemsPaginated[page].items[itemSelected]
  const trade = item ? tradesByToken[item.tokenId] : undefined

  const onMouseLeave = () => {
    // if (isMobile) return
    // setShowInformation(false)
    // setIsModalOpened && setIsModalOpened(false)
    // console.log(888,222)
    setItemPreviewed(null)
  }

  return (
    <Container ref={inventoryRef} onKeyDown={handleKeyPressed} className="font-calamity outline-none" tabIndex={0}>
      {!hideExtras && !hideCategories ? (
        <CategoriesMenu
          showRunes={false}
          categorySelected={itemsPaginated[page].mainCategory}
          setCategory={setCategory}
        />
      ) : null}

      <Flex
        flexDirection={rightSidedInfo ? 'row' : 'column'}
        justifyContent="space-between"
        alignItems="flex-start"
        onMouseLeave={onMouseLeave}>
        <ItemsContext.Provider value={contextState}>
          {itemsPaginated[page].items.length ? (
            <ItemsGrid
              id="catalog"
              direction={direction}
              page={page}
              items={itemsPaginated[page].items}
              showAll={showAll}
              showItemDropdown={showItemDropdown}
              showNames={showNames}
              showQuantity={showQuantity}
              columns={columns}
              rows={rows}
              defaultBranch={defaultBranch}
              noDisabled={noDisabled}
              disableAnimation={totalPages >= 10}
              selectMode={selectMode}
              isSelectable
            />
          ) : (
            <NoItems>Empty. </NoItems>
          )}
        </ItemsContext.Provider>
        {!hideExtras ? (
          <div
            css={css`
              margin: 0 auto 0;
              ${rightSidedInfo ? `width: 400px; margin-left: 30px;` : 'margin-top: 30px;'}
              // overflow: hidden;
              zoom: 0.9;
              position: relative;

              @media (min-width: 768px) {
                .md\:mx-4 {
                  margin-left: 1rem;
                  margin-right: 1rem;
                }

                .md\:max-w-lg {
                  max-width: 32rem;
                }
              }
            `}>
            {trade?.isPromo ? (
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
            {itemSelected !== null &&
            (itemsPaginated[page].items[itemSelected]
              ? itemsPaginated[page].items[itemSelected].name !== ''
              : false) ? (
              <ItemInformation
                item={itemsPaginated[page].items[itemSelected]}
                price={0}
                showActions={false}
                showOwner
                defaultBranch={defaultBranch}></ItemInformation>
            ) : null}
            {trade ? (
              <Flex flexDirection="column" alignItems="center" justifyContent="center" style={{ zoom: '1.2' }}>
                {/* {item.perfection !== null ? <Final>{(item.perfection * 100).toFixed(0)}% PERFECT</Final> : null} */}
                <Final>
                  {trade.price.toLocaleString(undefined, { maximumFractionDigits: 0 })} RXS
                  <span style={{ fontSize: '0.9rem', color: '#ccc', marginLeft: 10 }}>
                    (${(trade.price * cache.runes.rxs.price).toLocaleString('en-US')})
                  </span>
                </Final>
                {trade.status === 'sold' ? (
                  <Final>
                    {formatDistance(parseISO(new Date(trade.updatedAt).toISOString()), new Date(), {
                      addSuffix: true,
                    })}
                  </Final>
                ) : (
                  <Final>
                    {formatDistance(parseISO(new Date(trade.createdAt).toISOString()), new Date(), {
                      addSuffix: true,
                    })}
                  </Final>
                )}
                {item.type === ItemTypeType.Pet ? (
                  <Final>
                    {isFundraiserAddress(trade.seller) ? <>Rune Fundraiser</> : <></>}
                    <br />
                  </Final>
                ) : null}
                {/* {trade.buyer !== '0x0000000000000000000000000000000000000000' ? <Final>Private Sale<br /></Final> : null} */}
                <br />
                <Button as={NavLink} to={`/trade/${trade.id}`} style={{ zoom: '1.2' }}>
                  View Trade
                </Button>
              </Flex>
            ) : null}
          </div>
        ) : null}
      </Flex>
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
      {children}
    </Container>
  )
}

const ItemCatalog = ({
  showFull,
  nfts,
  defaultBranch = undefined,
  address = null,
  filterPerfectOnly = null,
  filterSort = null,
  filterQuery = null,
  onItemSelected = null,
  showItemDropdown = true,
  hideExtras = false,
  showUnobtained = false,
  showNames = false,
  hideArrows = false,
  showQuantity = true,
  selectMode = false,
  onItemMultiSelected = null,
  showCategories = [
    ItemsMainCategoriesType.WEAPONS as ItemsMainCategoriesType,
    ItemsMainCategoriesType.SHIELDS as ItemsMainCategoriesType,
    ItemsMainCategoriesType.ARMORS as ItemsMainCategoriesType,
    ItemsMainCategoriesType.ACCESSORIES as ItemsMainCategoriesType,
  ],
  noDisabled = false,
  hideCategories = false,
  defaultItemSelected = undefined,
  page = 0,
  direction = 0,
  rows = 9,
  columns = 10,
  autoColumn = false,
  children = null,
  rightSidedInfo = false,
}) => {
  const ref = useRef(null)
  const [_columns, setColumns] = useState(columns)
  const [_rows, setRows] = useState(rows)
  const [playSelect] = useSound('/assets/sounds/select.mp3')
  const [playAction] = useSound('/assets/sounds/action.mp3', { volume: 0.5 })
  const contextState = {
    playSelect,
    playAction,
  }

  useLayoutEffect(() => {
    if (!autoColumn) return
    const cols = Math.round((ref.current.offsetWidth - 0) / 85)

    if (cols > 10 && cols !== _columns) {
      setColumns(cols)
      setRows(Math.min(cols, 9))
    }
  }, [_columns, autoColumn])

  return (
    <SoundContext.Provider value={contextState}>
      <div ref={ref}>
        <ItemCatalogInner
          defaultBranch={defaultBranch}
          address={address}
          showFull={showFull}
          showItemDropdown={showItemDropdown}
          onItemSelected={onItemSelected}
          defaultItemSelected={defaultItemSelected}
          columns={_columns}
          rows={_rows}
          hideExtras={hideExtras}
          page={page}
          selectMode={selectMode}
          onItemMultiSelected={onItemMultiSelected}
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
          rightSidedInfo={rightSidedInfo}
          nfts={nfts}>
          {children}
        </ItemCatalogInner>
      </div>
    </SoundContext.Provider>
  )
}

ItemCatalog.defaultProps = {
  showFull: false,
}

export default ItemCatalog
