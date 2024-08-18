import BigNumber from 'bignumber.js'
import erc20ABI from '~/config/abi/erc20.json'
import masterchefABI from '~/config/abi/masterchef.json'
import multicall from '~/utils/multicall'
import farmsConfig from 'rune-backend-sdk/build/farmInfo'
import { getAddress, getMasterChefAddress, getRuneAddress } from '~/utils/addressHelpers'
import { CURRENT_FARM_SYMBOL } from '~/config'

export const fetchFarmUserAllowances = async (account: string, chefKey: string) => {
  const masterChefAdress = getMasterChefAddress()

  if (!masterChefAdress) return []

  const calls = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .filter((farm) => !!getAddress(farm.lpAddresses))
    .map((farm) => {
      // console.log('33333', farm)
      const lpContractAddress = getAddress(farm.lpAddresses)
      return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
    })
  // console.log('44444', calls)
  // console.log(calls)
  const rawLpAllowances = await multicall(erc20ABI, calls)
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON()
  })
  // console.log('55555', parsedLpAllowances)
  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (account: string, chefKey: string) => {
  const calls = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      const lpContractAddress = getAddress(farm.lpAddresses)
      return {
        address: lpContractAddress,
        name: 'balanceOf',
        params: [account],
      }
    })
  // console.log(calls)
  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, chefKey: string) => {
  const masterChefAdress = getMasterChefAddress()

  if (!masterChefAdress) return []

  const calls = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'userInfo',
        params: [farm.pid, account],
      }
    })

  // console.log(calls)
  const rawStakedBalances = await multicall(masterchefABI, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, chefKey: string) => {
  const masterChefAdress = getMasterChefAddress()

  if (!masterChefAdress) return []

  const calls = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress(CURRENT_FARM_SYMBOL), farm.pid, account],
      }
    })
  // console.log(calls)

  const rawEarnings = await multicall(masterchefABI, calls)
  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  })
  return parsedEarnings
}

export const fetchPreviousFarmUserEarnings = async (account: string, chefKey: string) => {
  const masterChefAdress = getMasterChefAddress()

  if (!masterChefAdress) return []

  const calls1 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('RAL'), farm.pid, account],
      }
    })

  const rawEarnings1 = await multicall(masterchefABI, calls1)

  const calls2 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('ORT'), farm.pid, account],
      }
    })

  const calls3 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('THUL'), farm.pid, account],
      }
    })

  const calls4 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('AMN'), farm.pid, account],
      }
    })

  const calls5 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('SOL'), farm.pid, account],
      }
    })

  const calls6 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('SHAEL'), farm.pid, account],
      }
    })

  const calls7 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('DOL'), farm.pid, account],
      }
    })

  const calls8 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('HEL'), farm.pid, account],
      }
    })

  const calls9 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('IO'), farm.pid, account],
      }
    })

  const calls10 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('LUM'), farm.pid, account],
      }
    })

  const calls11 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('LO'), farm.pid, account],
      }
    })

  const calls12 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('KO'), farm.pid, account],
      }
    })

  const calls13 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('FAL'), farm.pid, account],
      }
    })

  const calls14 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('PUL'), farm.pid, account],
      }
    })

  const calls15 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('UM'), farm.pid, account],
      }
    })

  const calls16 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('MAL'), farm.pid, account],
      }
    })

  const calls17 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('IST'), farm.pid, account],
      }
    })

  const calls18 = farmsConfig
    .filter((f) => f.chefKey === chefKey)
    .map((farm) => {
      return {
        address: masterChefAdress,
        name: 'pendingRune(address,uint256,address)',
        params: [getRuneAddress('GUL'), farm.pid, account],
      }
    })

  const rawEarnings2 = await multicall(masterchefABI, calls2)
  const rawEarnings3 = await multicall(masterchefABI, calls3)
  const rawEarnings4 = await multicall(masterchefABI, calls4)
  const rawEarnings5 = await multicall(masterchefABI, calls5)
  const rawEarnings6 = await multicall(masterchefABI, calls6)
  const rawEarnings7 = await multicall(masterchefABI, calls7)
  const rawEarnings8 = await multicall(masterchefABI, calls8)
  const rawEarnings9 = await multicall(masterchefABI, calls9)
  const rawEarnings10 = await multicall(masterchefABI, calls10)
  const rawEarnings11 = await multicall(masterchefABI, calls11)
  const rawEarnings12 = await multicall(masterchefABI, calls12)
  const rawEarnings13 = await multicall(masterchefABI, calls13)
  const rawEarnings14 = await multicall(masterchefABI, calls14)
  const rawEarnings15 = await multicall(masterchefABI, calls15)
  const rawEarnings16 = await multicall(masterchefABI, calls16)
  const rawEarnings17 = await multicall(masterchefABI, calls17)
  const rawEarnings18 = await multicall(masterchefABI, calls18)

  return rawEarnings4.map((earnings, i) => {
    return {
      RAL: new BigNumber(rawEarnings1[i]).toJSON(),
      ORT: new BigNumber(rawEarnings2[i]).toJSON(),
      THUL: new BigNumber(rawEarnings3[i]).toJSON(),
      AMN: new BigNumber(rawEarnings4[i]).toJSON(),
      SOL: new BigNumber(rawEarnings5[i]).toJSON(),
      SHAEL: new BigNumber(rawEarnings6[i]).toJSON(),
      DOL: new BigNumber(rawEarnings7[i]).toJSON(),
      HEL: new BigNumber(rawEarnings8[i]).toJSON(),
      IO: new BigNumber(rawEarnings9[i]).toJSON(),
      LUM: new BigNumber(rawEarnings10[i]).toJSON(),
      LO: new BigNumber(rawEarnings11[i]).toJSON(),
      KO: new BigNumber(rawEarnings12[i]).toJSON(),
      FAL: new BigNumber(rawEarnings13[i]).toJSON(),
      PUL: new BigNumber(rawEarnings14[i]).toJSON(),
      UM: new BigNumber(rawEarnings15[i]).toJSON(),
      MAL: new BigNumber(rawEarnings16[i]).toJSON(),
      IST: new BigNumber(rawEarnings17[i]).toJSON(),
      GUL: new BigNumber(rawEarnings18[i]).toJSON(),
    }
  })
}
