// App.tsx

import React from 'react';
import { hydrate, render } from 'react-dom';
// import * as Sentry from '@sentry/react'
import AppInner from './AppInner';
import Providers from './Providers';
import ApplicationUpdater from './state/application/updater';
import ListsUpdater from './state/lists/updater';
import MulticallUpdater from './state/multicall/updater';
import TransactionUpdater from './state/transactions/updater';
import ToastListener from './components/ToastListener';
import enUS from 'antd/lib/locale/en_US';
import { ProProvider } from '@ant-design/pro-provider';
import proEnUS from '@ant-design/pro-provider/es/locale/en_US';
// import reportWebVitals from './reportWebVitals'
import { ConfigProvider, theme } from 'antd';
import { ThemeProvider } from 'antd-style';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBrand, useMatchBreakpoints, useSettings } from '@arken/forge-ui/hooks';
import { PromptProvider } from '@arken/forge-ui/hooks/usePrompt';
import { AuthProvider } from '@arken/forge-ui/hooks/useAuth';
import { NavProvider } from '@arken/forge-ui/hooks/useNav';
import { NoticeProvider } from '@arken/forge-ui/hooks/useNotice';
import { lightTheme, darkTheme } from '~/themes';
import { trpc, trpcClient, queryClient } from '~/utils/trpc';
import ResetStyles from '~/reset-styles';
import GlobalStyles from '~/global-styles';
// import { trpc, trpcClient } from '~/utils/trpc'; // Adjust path as needed

// Initialize QueryClients for both core and evolution backends
// Assuming ts exports queryClients
// If not, we can use queryClient.core and queryClient.evolution

window.queryClient = new QueryClient();

// TODO: remove?
// @ts-ignore
// window.cerebro = cerebro

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log)

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({ dsn: 'https://55af693ba6974027b6631c72ec9bfb4e@o556734.ingest.sentry.io/5688112' })
// }

const App = ({ apolloClient }: any) => {
  const { brand } = useBrand();
  const { isMobile } = useMatchBreakpoints();
  const { settings } = useSettings();

  const themeConfig: any = {
    algorithm: settings.DarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm, //theme.compactAlgorithm,
    token: {
      fontFamily:
        "Lato,'Segoe UI','Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
      colorPrimary: settings.DarkMode ? '#000' : '#00598e',
      // colorInfo: '#00598e',
      colorError: '#c72527',
      fontSizeLG: 18,
      // borderRadius: 0,
      colorFillQuaternary: 'rgba(0, 0, 0, 0.04)',
      // colorBgBase: '#fff',
    },
  };

  if (settings.DarkMode) {
    // themeConfig.token.colorBgBase = '#fff'
    themeConfig.token.colorBgContainer = 'transparent';
    themeConfig.token.colorFillContent = 'transparent';
  }

  const themeSettings = {
    ...(settings.DarkMode ? darkTheme[brand] : lightTheme[brand]),
    brand,
    isMobile,
  };

  return (
    <ConfigProvider theme={themeConfig} locale={enUS}>
      {/* <ProProvider value={{ locale: proEnUS }}> */}
      <StyledThemeProvider theme={themeSettings}>
        {/* <ThemeProvider2 theme={themeConfig}> */}
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <PromptProvider>
              <NoticeProvider>
                <>
                  <ResetStyles />
                  <GlobalStyles />
                  <Providers>
                    <>
                      <ListsUpdater />
                      <ApplicationUpdater />
                      <TransactionUpdater />
                      <MulticallUpdater />
                      <ToastListener />
                    </>
                    <AppInner />
                  </Providers>
                  {/* 
                        Uncomment and adjust your routing as needed:
                        <BrowserRouter basename="/">
                          <NavProvider>
                            <TourProvider>
                              <SettingsProvider>
                                <Providers>
                                  <>
                                    <ListsUpdater />
                                    <ApplicationUpdater />
                                    <TransactionUpdater />
                                    <MulticallUpdater />
                                    <ToastListener />
                                  </>
                                  <Routes>
                                    <Route
                                      path="/"
                                      element={
                                        <Authorize permissions={[]}>
                                          <Dashboard themeConfig={themeConfig} />
                                        </Authorize>
                                      }
                                    />
                                    {/* Add other routes here */}
                  {/* </Routes>
                                </Providers>
                              </SettingsProvider>
                            </TourProvider>
                          </NavProvider>
                        </BrowserRouter> 
                        */}
                </>
              </NoticeProvider>
            </PromptProvider>
          </QueryClientProvider>
        </trpc.Provider>

        {/* </ThemeProvider2> */}
      </StyledThemeProvider>
      {/* </ProProvider> */}
    </ConfigProvider>
  );
};

export default App;
