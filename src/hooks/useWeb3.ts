import { useEffect, useState, useRef } from 'react';
import ethers from 'ethers';
import { ChainId } from '@arcanefinance/sdk';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import Web3 from 'web3';
import { useWeb3React } from '@web3-react/core';
import { getWeb3NoAccount } from '~/utils/web3';
import { NetworkContextName } from '~/constants';

/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the provider change
 */
const useWeb3 = () => {
  const context = useWeb3React();
  const activeContext = useWeb3React(NetworkContextName);
  const { account: address } = context;
  const { connector, activate, deactivate } = activeContext;
  const library = activeContext.active ? activeContext.library : context.library;
  const provider = library?.provider;
  const refEth = useRef(provider);
  const [web3, setweb3] = useState(provider ? new Web3(provider) : getWeb3NoAccount());

  useEffect(() => {
    if (provider !== refEth.current) {
      // // @ts-ignore
      // if (window.ethereum && window.ethereum.isFlame) {
      //   // @ts-ignore
      //   window.ethereum.request({ method: 'eth_accounts' });
      //   // @ts-ignore
      //   refEth.current = window.ethereum
      // } else {
      refEth.current = provider;
      // }

      setweb3(refEth.current ? new Web3(refEth.current) : getWeb3NoAccount());
    }
  }, [provider]);

  const account = address;
  const chainId = window?.location?.hostname === 'testnet.arken.gg' ? 97 : parseInt(process.env.REACT_APP_CHAIN_ID);

  return { web3, library, provider, address, account, chainId, connector, activate, deactivate };
};

export default useWeb3;
