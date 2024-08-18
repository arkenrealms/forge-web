import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import contracts from 'rune-backend-sdk/build/contractInfo'
import { ItemSlot } from 'rune-backend-sdk/build/data/items'
import { decodeItem } from 'rune-backend-sdk/build/util/item-decoder'
import { allRuneList } from '~/config'
import { useCurrency } from '~/hooks/Tokens'
import { useBarracks } from '~/hooks/useContract'
import useWeb3 from '~/hooks/useWeb3'
import { useCurrencyBalancesWithLoadingIndicator } from '~/state/wallet/hooks'
import { getAddress, getRuneAddress } from '~/utils/addressHelpers'

const defaultValues = {
  meta: {
    harvestYield: 0,
    harvestFeeToken: '',
    harvestFeePercent: 0,
    harvestFees: {},
    chanceToSendHarvestToHiddenPool: 0,
    chanceToLoseHarvest: 0,
    harvestBurn: 0,
    unstakeLocked: false,
    classRequired: 0,
    totalYield: 0,
    feeReduction: 0,
    randomRuneExchange: 0,
    worldstoneShardChance: 0,
  },
  equipment: {},
  items: [],
  runes: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
    31: 0,
    32: 0,
    33: 0,
  },
  addTokenId: (slotId, tokenId) => {},
  removeTokenId: (slotId, tokenId) => {},
  refreshRunes: () => {},
  refreshEquipment: () => {},
  setUserAddress: (userAddress) => {},
  tokenBalancesLoading: true,
}
const InventoryContext = React.createContext(defaultValues)

// let init = false

const InventoryContextProvider = ({ children }) => {
  const tokenIdsRef = useRef([])
  const [tokenIds, setTokenIds] = useState([])
  const { web3, address: account } = useWeb3()
  const barracks = useBarracks()
  const [userAddress, setUserAddress] = useState(account)
  const [runes, setRunes] = useState({ ...defaultValues.runes })
  const cachedTokenBalancesRef = useRef(null)
  const cachedAddressRef2 = useRef(null)
  const currencies = [
    useCurrency(getAddress(contracts.el)),
    useCurrency(getAddress(contracts.tir)),
    useCurrency(getAddress(contracts.eld)),
    useCurrency(getAddress(contracts.nef)),
    useCurrency(getAddress(contracts.eth)),
    useCurrency(getAddress(contracts.ith)),
    useCurrency(getAddress(contracts.tal)),
    useCurrency(getAddress(contracts.ral)),
    useCurrency(getAddress(contracts.ort)),
    useCurrency(getAddress(contracts.thul)),
    useCurrency(getAddress(contracts.amn)),
    useCurrency(getAddress(contracts.sol)),
    useCurrency(getAddress(contracts.shael)),
    useCurrency(getAddress(contracts.dol)),
    useCurrency(getAddress(contracts.hel)),
    useCurrency(getAddress(contracts.io)),
    useCurrency(getAddress(contracts.lum)),
    useCurrency(getAddress(contracts.ko)),
    useCurrency(getAddress(contracts.fal)),
    useCurrency(getAddress(contracts.lem)),
    useCurrency(getAddress(contracts.pul)),
    useCurrency(getAddress(contracts.um)),
    useCurrency(getAddress(contracts.mal)),
    useCurrency(getAddress(contracts.ist)),
    useCurrency(getAddress(contracts.gul)),
    useCurrency(getAddress(contracts.vex)),
    useCurrency(getAddress(contracts.ohm)),
    useCurrency(getAddress(contracts.sur)),
    useCurrency(getAddress(contracts.lo)),
    useCurrency(getAddress(contracts.ber)),
    useCurrency(getAddress(contracts.jah)),
    useCurrency(getAddress(contracts.cham)),
    useCurrency(getAddress(contracts.zod)),
  ]
  const [currencyBalances, tokenBalancesLoading] = useCurrencyBalancesWithLoadingIndicator(
    userAddress || account,
    currencies
  )

  const forceRefreshEquipment = useCallback(
    async (loadFromAccount) => {
      try {
        console.log('Fetching staked items', loadFromAccount)

        const ids = []

        const leftHand = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.LeftHand).call()
        if (leftHand) ids.push([ItemSlot.LeftHand, new BigNumber(leftHand).toString()])

        const rightHand = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.RightHand).call()
        if (rightHand) ids.push([ItemSlot.RightHand, new BigNumber(rightHand).toString()])

        const head = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Head).call()
        if (head) ids.push([ItemSlot.Head, new BigNumber(head).toString()])

        const hands = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Hands).call()
        if (hands) ids.push([ItemSlot.Hands, new BigNumber(hands).toString()])

        const belt = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Waist).call()
        if (belt) ids.push([ItemSlot.Waist, new BigNumber(belt).toString()])

        const legs = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Legs).call()
        if (legs) ids.push([ItemSlot.Legs, new BigNumber(legs).toString()])

        const chest = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Chest).call()
        if (chest) ids.push([ItemSlot.Chest, new BigNumber(chest).toString()])

        const feet = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Feet).call()
        if (feet) ids.push([ItemSlot.Feet, new BigNumber(feet).toString()])

        const trinket1 = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Trinket1).call()
        if (trinket1) ids.push([ItemSlot.Trinket1, new BigNumber(trinket1).toString()])

        const trinket2 = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Trinket2).call()
        if (trinket2) ids.push([ItemSlot.Trinket2, new BigNumber(trinket2).toString()])

        const trinket3 = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Trinket3).call()
        if (trinket3) ids.push([ItemSlot.Trinket3, new BigNumber(trinket3).toString()])

        const pet = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Pet).call()
        if (pet) ids.push([ItemSlot.Pet, new BigNumber(pet).toString()])

        const neck = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Neck).call()
        if (neck) ids.push([ItemSlot.Neck, new BigNumber(neck).toString()])

        const finger1 = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Finger1).call()
        if (finger1) ids.push([ItemSlot.Finger1, new BigNumber(finger1).toString()])

        const finger2 = await barracks.methods.getEquippedItem(loadFromAccount, ItemSlot.Finger2).call()
        if (finger2) ids.push([ItemSlot.Finger2, new BigNumber(finger2).toString()])

        tokenIdsRef.current = ids
      } catch (e) {
        tokenIdsRef.current = []
      }

      setTokenIds(tokenIdsRef.current)

      console.log('Gear fetched', tokenIdsRef.current)
    },
    [tokenIdsRef, barracks.methods]
  )

  const refreshEquipment = useCallback(async () => {
    const loadFromAccount = userAddress || account

    const didAddressChange = cachedAddressRef2.current !== loadFromAccount

    if (!didAddressChange) return

    forceRefreshEquipment(loadFromAccount)

    cachedAddressRef2.current = loadFromAccount
  }, [userAddress, account, forceRefreshEquipment])

  const refreshRunes = useCallback(async () => {
    if (tokenBalancesLoading) return

    const loadFromAccount = userAddress || account

    if (!loadFromAccount) return

    const cacheKey = JSON.stringify(currencyBalances.map((c) => c?.toSignificant(9, undefined, 2)))
    const tokenBalancesChanged = cachedTokenBalancesRef.current !== cacheKey

    if (!tokenBalancesChanged) return

    cachedTokenBalancesRef.current = cacheKey

    console.log('Fetching wallet runes', loadFromAccount)

    try {
      // const fetchBalance = async (tokenAddress) => {
      //   console.log(`Fetching balance of ${loadFromAccount} for ${tokenAddress}`)
      //   const contract = getBep20Contract(tokenAddress, web3)
      //   const res = await contract.methods.balanceOf(loadFromAccount).call()
      //   return new BigNumber(res)
      // }
      const newRunes = { ...defaultValues.runes }

      for (const runeIndex in allRuneList) {
        const runeSymbol = allRuneList[runeIndex]
        const tokenAddress = getRuneAddress(runeSymbol)
        // const balance = currencyBalances.find(c => c.currency.symbol === runeSymbol).toSignificant(4)//await fetchBalance(tokenAddress)
        const balanceNumber = currencyBalances
          .find((c) => c.currency.symbol === runeSymbol.toUpperCase())
          .toSignificant(9, undefined, 2)
        newRunes[runeIndex] = balanceNumber
        console.log(`${runeSymbol} = ${balanceNumber} (${tokenAddress})`)
      }

      setRunes(newRunes)
    } catch (e) {
      console.log('Error fetching wallet balances', e)
    }
    console.log('Runes fetched')
  }, [userAddress, account, tokenBalancesLoading, currencyBalances, setRunes])

  useEffect(() => {
    if (tokenBalancesLoading) return

    // init = true

    refreshRunes()
    refreshEquipment()
  }, [tokenBalancesLoading, refreshRunes, refreshEquipment])

  const totalMeta = {
    feeReduction: 0,
    harvestYield: 0,
    harvestBurn: 0,
    totalYield: 0,
    randomRuneExchange: 0,
    worldstoneShardChance: 0,
    chanceToSendHarvestToHiddenPool: 0,
    chanceToLoseHarvest: 0,
    harvestFeeToken: null,
    harvestFeePercent: 0,
    unstakeLocked: false,
    classRequired: null,
    harvestFees: {},
    attributes: {},
  }

  const equipment = {
    [ItemSlot.LeftHand]: undefined,
    [ItemSlot.RightHand]: undefined,
    [ItemSlot.Head]: undefined,
    [ItemSlot.Hands]: undefined,
    [ItemSlot.Chest]: undefined,
    [ItemSlot.Feet]: undefined,
  }

  //   useEffect(() => {
  //     console.log('Updating', tokenIdsRef.current)
  //     // setTokenIds(tokenIdsRef.current)
  //   }, [tokenIdsRef])

  const items = tokenIdsRef.current
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map((props) => {
      const [slotId, tokenId] = props

      if (tokenId === '0') return

      const item = decodeItem(new BigNumber(tokenId + '').toString())

      if (!item) return

      console.log(555, item)

      const meta = {
        slotId,
        harvestYield: 0,
        harvestFeePercent: 0,
        harvestFees: {},
        chanceToSendHarvestToHiddenPool: 0,
        chanceToLoseHarvest: 0,
        harvestBurn: 0,
        feeReduction: 0,
        randomRuneExchange: 0,
        worldstoneShardChance: 0,
        ...(item ? item.meta : {}),
      }

      for (const attributeKey of Object.keys(item.meta)) {
        const value = item.meta[attributeKey]

        if (attributeKey === 'harvestYield') {
          totalMeta.harvestYield += value

          totalMeta.totalYield += totalMeta.totalYield * (value / 100)
        } else if (attributeKey === 'harvestBurn') {
          totalMeta.harvestBurn += value

          totalMeta.totalYield -= totalMeta.totalYield * (value / 100)
        } else if (attributeKey === 'harvestFeeToken') {
          totalMeta.harvestFeeToken = item.meta.harvestFeeToken
        } else if (attributeKey === 'harvestFeePercent') {
          totalMeta.harvestFeePercent = item.meta.harvestFeePercent
        } else if (attributeKey === 'unstakeLocked') {
          totalMeta.unstakeLocked = item.meta.unstakeLocked
        } else if (attributeKey === 'classRequired') {
          totalMeta.classRequired = item.meta.classRequired
        } else if (attributeKey === 'harvestFees') {
          totalMeta.harvestFees = item.meta.harvestFees
        } else if (typeof value === 'number') {
          if (!totalMeta[attributeKey]) totalMeta[attributeKey] = 0

          totalMeta[attributeKey] += value
        } else if (Array.isArray(value)) {
          if (!totalMeta[attributeKey]) totalMeta[attributeKey] = []

          for (const kk of Object.keys(value)) {
            if (typeof value[kk] === 'number') {
              totalMeta[attributeKey][kk] += value[kk]
            } else {
              totalMeta[attributeKey][kk] = value[kk]
            }
          }
        } else if (value !== null && typeof value === 'object') {
          if (!totalMeta[attributeKey]) totalMeta[attributeKey] = {}

          for (const kk of Object.keys(value)) {
            if (typeof value[kk] === 'number') {
              if (!totalMeta[attributeKey][kk]) totalMeta[attributeKey][kk] = 0

              totalMeta[attributeKey][kk] += value[kk]
            } else {
              totalMeta[attributeKey][kk] = value[kk]
            }
          }
        } else {
          totalMeta[attributeKey] = value
        }
      }

      item.isEquipable = false
      item.isEquipped = true

      equipment[slotId] = item

      return {
        ...item,
        meta,
      }
    })
    .filter((item) => !!item)

  // feeReduction = feeReduction > 100 ? 100 : feeReduction
  totalMeta.harvestFeePercent =
    totalMeta.feeReduction > 100
      ? 0
      : parseFloat(
          (totalMeta.harvestFeePercent - totalMeta.harvestFeePercent * (totalMeta.feeReduction / 100)).toFixed(2)
        )

  const addTokenId = useCallback(
    function (slotId, tokenId) {
      if (tokenIdsRef.current.find((item) => item[0] === slotId && item[1] === tokenId)) return

      tokenIdsRef.current.push([slotId, tokenId])

      setTokenIds(tokenIdsRef.current)

      console.log('Added token from equipment')
    },
    [tokenIdsRef, setTokenIds]
  )

  const removeTokenId = useCallback(
    function (slotId, tokenId) {
      if (!tokenIdsRef.current.find((item) => item[0] === slotId && item[1] === tokenId)) return

      tokenIdsRef.current = tokenIdsRef.current.filter((item) => !(item[0] === slotId && item[1] === tokenId))

      setTokenIds(tokenIdsRef.current)

      console.log('Removed token from equipment')
    },
    [tokenIdsRef, setTokenIds]
  )
  console.log(555, totalMeta)
  // console.log(4444, equipment, tokenIds)
  return (
    <InventoryContext.Provider
      value={{
        meta: totalMeta,
        equipment,
        items,
        runes,
        addTokenId,
        removeTokenId,
        refreshRunes,
        refreshEquipment,
        setUserAddress,
        tokenBalancesLoading,
      }}>
      {children}
    </InventoryContext.Provider>
  )
}

export { InventoryContext, InventoryContextProvider }
