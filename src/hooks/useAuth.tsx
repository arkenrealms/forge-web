import { ConnectorNames } from '~/components/WalletModal/types';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import { connectorsByName } from '~/utils/web3React';
import React, { useContext, useState, useCallback, useEffect, createContext } from 'react';
import _ from 'lodash';
import type { NotificationPlacement } from 'antd/es/notification/interface';
// import useSettings from './useSettings';
import { usePrompt } from './usePrompt';
import config from '../config';

interface AuthProviderProps {
  trpc: any;
  children?: React.ReactElement;
}

const AuthContext = createContext({
  profile: null,
  permissions: {} as any,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

const pca = null;

// const scopes = ['profile', 'openid', 'email', 'User.Read'];

const AuthProvider = ({ trpc, children }: AuthProviderProps) => {
  // const { settings } = useSettings();
  const { prompt } = usePrompt();

  const [token, setToken] = useState(
    config.isAuthorizationEnabled ? window.localStorage.getItem(config.tokenKey) : undefined
  );
  const [profile, setProfile] = useState(JSON.parse(window.localStorage.getItem(config.accountKey) || '{}'));
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState({});

  const { mutateAsync: authorize, isLoading: isAuthorizing } = trpc.seer.core.authorize.useMutation();

  async function authSilent() {
    console.log('Refreshing auth');

    const res = await authorize({
      token: window.localStorage.getItem(config.tokenKey) || undefined,
      loginAs: window.localStorage.getItem('LoginAs') || undefined,
    });

    console.log('useAuth res', res);

    if (res) {
      setToken(res.token);
      setProfile(res.profile);
      setPermissions(res.permissions);
    } else {
      prompt.error({
        message: 'Error',
        description: 'Failed to sign in',
        placement: 'topRight' as NotificationPlacement,
        duration: 5,
      });
    }

    setIsLoading(false);
  }

  useEffect(function () {
    authSilent();
  }, []);

  async function login() {
    window.localStorage.removeItem(config.tokenKey);
    window.localStorage.removeItem(config.accountKey);
    window.localStorage.removeItem('LoginAs');
  }

  async function logout() {
    window.localStorage.removeItem(config.tokenKey);
    window.localStorage.removeItem(config.accountKey);
    window.localStorage.removeItem('LoginAs');
  }

  return (
    <AuthContext.Provider value={{ profile, permissions, login, logout, isLoading }}>{children}</AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthContext, AuthProvider, useAuth };

const addBscToMetamask = () => {
  // @ts-ignore
  const { ethereum } = window;
  if (ethereum) {
    // @ts-ignore
    ethereum
      .request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x38',
            chainName: 'Binance Smart Chain Mainnet',
            rpcUrls: ['https://bsc-dataseed1.binance.org'],
            iconUrls: ['https://dex-bin.bnbstatic.com/static/images/networks/chain-icon.svg'],
            blockExplorerUrls: ['https://bscscan.com'],
            nativeCurrency: {
              name: 'BNB Token',
              symbol: 'BNB',
              decimals: 18,
            },
          },
        ], // you must have access to the specified account
      })
      .then((result: any) => {
        window.location.reload();
      })
      .catch((e: any) => {
        alert('An error occurred. Please seek help in Telegram chat. Error code: ' + e.code);
        if (e.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log('We can encrypt anything without the key.');
        } else {
          console.error(e);
        }
      });
  }
};

const useAuthOld = () => {
  const { activate, deactivate, account } = useWeb3();
  const { toastError } = useToast();
  const [error, setError] = useState(null);

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      // if (account) {
      //   addBscToMetamask()
      // }
      // console.log('gggg', connectorID)
      const connector = connectorsByName[connectorID];
      if (connector) {
        activate(connector, (e: Error) => {
          // if (e.name === 'UnsupportedChainIdError' || e.name === 't') {
          //   if (connectorID === ConnectorNames.WalletConnect) {
          //     toastError('Error', 'Please use BSC within the TrustWallet app. Other methods are unstable.')
          //   } else if (connectorID === ConnectorNames.BSC) {
          //     toastError('Error', 'Please make sure your connected to BSC.')
          //   } else {
          //     toastError('Wrong Blockchain', 'Please use Binance Smart Chain (BSC) to access. MetaMask recommended.')
          //   }
          // } else toastError(e.name, e.message)
          addBscToMetamask();
          setError(e);
        });
      } else {
        toastError("Can't find connector", 'The connector config is wriong');
      }
    },
    [activate, toastError]
  );

  return { login, logout: deactivate, error };
};

export default useAuthOld;
