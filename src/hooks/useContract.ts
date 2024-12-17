import React, { useMemo, useRef, useState } from 'react';
import useWeb3 from '~/hooks/useWeb3';
import {
  getBep20Contract,
  getRuneContract,
  getNativeContract,
  getCharacterFactoryContract,
  getCharacterSpecialContract,
  getArcaneCharacterContract,
  getProfileContract,
  getArcaneItemContract,
  getContract,
  getRouterContract,
} from '~/utils/contractHelpers';
import { getContract as getEthersContract } from '~/utils/web3';
import { getAddress } from '~/utils/addressHelpers';
import addresses from '@arken/node/legacy/contractInfo';
import masterChef from '~/config/abi/masterchef.json';
import ArcaneBarracksV1 from '@arken/node/legacy/contracts/ArcaneBarracksV1.json';
import ArcaneItemStorageV1 from '@arken/node/legacy/contracts/ArcaneItemStorageV1.json';
import ArcaneWorldstoneMinterV1 from '@arken/node/legacy/contracts/ArcaneWorldstoneMinterV1.json';
import ArcaneBlacksmithV4 from '@arken/node/legacy/contracts/ArcaneBlacksmithV4.json';
import RuneSenderV1 from '@arken/node/legacy/contracts/RuneSenderV1.json';
import RuneShards from '@arken/node/legacy/contracts/RuneShards.json';
import ArcaneTraderV1 from '@arken/node/legacy/contracts/ArcaneTraderV1.json';
import RxsMarketplace from '@arken/node/legacy/contracts/RXSMarketplace.json';
import pancakeRouterAbi from '~/config/abi/pancakeRouter.json';
import { useContext } from 'react';
import { MasterchefContext } from '~/contexts/MasterchefContext';
import { Contract } from '@ethersproject/contracts';
import { ChainId, WETH } from '@arcanefinance/sdk';
import IUniswapV2Pair from '@uniswap/v2-core/build/IUniswapV2Pair.json';
import ENS_ABI from '~/constants/abis/ens-registrar.json';
import ENS_PUBLIC_RESOLVER_ABI from '~/constants/abis/ens-public-resolver.json';
import { ERC20_BYTES32_ABI } from '~/constants/abis/erc20';
import ERC20_ABI from '~/constants/abis/erc20.json';
import WETH_ABI from '~/constants/abis/weth.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '~/constants/multicall';

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useERC20 = (address: string) => {
  const { web3 } = useWeb3();
  return useMemo(() => getBep20Contract(address, web3), [address, web3]);
};

export const useNative = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getNativeContract(web3), [web3]);
};

export const useRxs = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    // @ts-ignore
    return getContract(RuneShards.abi, getAddress(addresses.rxs), web3);
  }, [web3]);
};

export const useRune = (rune: string) => {
  const { web3 } = useWeb3();
  return useMemo(() => getRuneContract(rune, web3), [web3, rune]);
};

export const useRouter = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getRouterContract(web3), [web3]);
};
export const useRouterV2 = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getContract(pancakeRouterAbi, getAddress(addresses.pancakeRouterV2), web3), [web3]);
};

export const useCharacterFactory = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getCharacterFactoryContract(web3), [web3]);
};

export const useArcaneTrader = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    return getContract(ArcaneTraderV1.abi, getAddress(addresses.trader), web3);
  }, [web3]);
};

export const useCharacters = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getArcaneCharacterContract(web3), [web3]);
};

export const useArcaneItems = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getArcaneItemContract(web3), [web3]);
};

export const useBlacksmith = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    return getContract(ArcaneBlacksmithV4.abi, getAddress(addresses.blacksmith), web3);
  }, [web3]);
};

export const useRuneSender = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    return getContract(RuneSenderV1.abi, getAddress(addresses.sender), web3);
  }, [web3]);
};

export const useMarketContract = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    return getContract(RxsMarketplace.abi, getAddress(addresses.market), web3);
  }, [web3]);
};

// export const useWorldstoneMinter = () => {
//   const { web3 } = useWeb3()
//   return useMemo(async () => {
//     const Contract = (await (await fetch('/contracts/ArcaneWorldstoneMinterV1.json')).json()) as any
//     return getContract(Contract.abi, getAddress(addresses.worldstoneMinter), web3)
//   }, [web3])
// }

export const useWorldstoneMinter = () => {
  const { web3 } = useWeb3();
  return useMemo(async () => {
    return getContract(ArcaneWorldstoneMinterV1.abi, getAddress(addresses.worldstoneMinter), web3);
  }, [web3]);
};

export const useItemStorage = () => {
  const { web3 } = useWeb3();
  return useMemo(async () => {
    return getContract(ArcaneItemStorageV1.abi, getAddress(addresses.itemStorage), web3);
  }, [web3]);
};

export const useBarracks = () => {
  const { web3 } = useWeb3();
  return useMemo(() => {
    return getContract(ArcaneBarracksV1.abi, getAddress(addresses.barracks), web3);
  }, [web3]);
};

export const useProfile = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getProfileContract(web3), [web3]);
};

export const useMasterchef = () => {
  const { web3 } = useWeb3();
  const { chefKey, setChefKey } = useContext(MasterchefContext);
  const contract = useMemo(
    () =>
      getContract(
        masterChef,
        getAddress(
          addresses.raid
          // addresses[chefKey.toLowerCase() + 'MasterChef']
          //   ? addresses[chefKey.toLowerCase() + 'MasterChef']
          //   : addresses.masterChef,
        ),
        web3
      ),
    [web3]
  );

  return { contract, chefKey, setChefKey };
};

export const useCharacterSpecialContract = () => {
  const { web3 } = useWeb3();
  return useMemo(() => getCharacterSpecialContract(web3), [web3]);
};

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useWeb3();

  // @ts-ignore
  return useMemo(() => {
    if (!address || !ABI || !library || !account) return null;
    try {
      return getEthersContract(address, ABI, library, account);
    } catch (error) {
      console.error('Failed to use contract', error, address);
      return null;
    }
  }, [address, ABI, library, account]);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useWeb3();
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useWeb3();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      case ChainId.MAINNET:
      case ChainId.BSCTESTNET:
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IUniswapV2Pair.abi, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useWeb3();
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false);
}
