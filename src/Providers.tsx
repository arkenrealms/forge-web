import { createWeb3ReactRoot, getWeb3ReactContext, Web3ReactProvider } from '@web3-react/core';
import React, { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { ConfigProvider, theme } from 'antd';
import { ModalProvider } from '~/components/Modal';
import { BlockContextProvider } from '~/contexts/BlockContext';
import { CacheContextProvider } from '~/contexts/CacheContext';
import { InventoryContextProvider } from '~/contexts/InventoryContext';
import { ItemCatalogContextProvider } from '~/contexts/ItemCatalogContext';
import ItemsContext from '~/contexts/ItemsContext';
import { LanguageContextProvider } from '~/contexts/Localisation/languageContext';
import { MarketContextProvider } from '~/contexts/MarketContext';
import { MasterchefContextProvider } from '~/contexts/MasterchefContext';
import { RefreshContextProvider } from '~/contexts/RefreshContext';
import { SettingsContextProvider } from '~/contexts/SettingsContext';
import { ThemeContextProvider } from '~/contexts/ThemeContext';
import { WalletItemsContextProvider } from '~/contexts/WalletItemsContext';
import { getWrappedLibrary } from '~/utils/web3React';
// import { createFeathersClient } from '~/hooks/useFeathers'
import { LiveContextProvider } from '~/contexts/LiveContext';
import useBrand from '~/hooks/useBrand';
import { dark } from '~/theme';

import i18n from '~/config/i18n';
import store from '~/state';

let Web3ProviderNetwork;

try {
  Web3ProviderNetwork = createWeb3ReactRoot('NETWORK');
} catch (e) {
  console.log('Error creating web3 provider', e);
  Web3ProviderNetwork = getWeb3ReactContext('NETWORK');
}

// const client = createFeathersClient()

const Providers: React.FC<any> = ({ children }) => {
  const [itemPreviewed, setItemPreviewed] = useState(null);
  const [itemSelected, setItemSelected] = useState(null);
  const { brand } = useBrand();

  const contextState = {
    setItemSelected,
    itemPreviewed,
    setItemPreviewed,
    itemSelected,
  };

  return (
    <Web3ReactProvider getLibrary={getWrappedLibrary}>
      <Web3ProviderNetwork getLibrary={getWrappedLibrary}>
        {/* <FeathersContext.Provider value={client}> */}
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              colorPrimary: '#606094', // 24253a// 52527f //'#bb955e', //"#7d17ff",
              borderRadius: 0,
              colorBgContainer: 'transparent',
              colorFillContent: 'transparent',
              colorBgBase: '#2c2c44',
            },
          }}>
          <ReduxProvider store={store}>
            <LiveContextProvider>
              <CacheContextProvider>
                <ItemCatalogContextProvider>
                  <WalletItemsContextProvider>
                    <MasterchefContextProvider>
                      <ThemeContextProvider>
                        <LanguageContextProvider>
                          <BlockContextProvider>
                            <InventoryContextProvider>
                              <SettingsContextProvider>
                                <MarketContextProvider>
                                  <RefreshContextProvider>
                                    <I18nextProvider i18n={i18n}>
                                      <ThemeProvider theme={{ ...dark, brand }}>
                                        <ItemsContext.Provider value={contextState}>
                                          <ModalProvider>{children}</ModalProvider>
                                        </ItemsContext.Provider>
                                      </ThemeProvider>
                                    </I18nextProvider>
                                  </RefreshContextProvider>
                                </MarketContextProvider>
                              </SettingsContextProvider>
                            </InventoryContextProvider>
                          </BlockContextProvider>
                        </LanguageContextProvider>
                      </ThemeContextProvider>
                    </MasterchefContextProvider>
                  </WalletItemsContextProvider>
                </ItemCatalogContextProvider>
              </CacheContextProvider>
            </LiveContextProvider>
          </ReduxProvider>
        </ConfigProvider>
        {/* </FeathersContext.Provider> */}
      </Web3ProviderNetwork>
    </Web3ReactProvider>
  );
};

export default Providers;
