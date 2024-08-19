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
// import reportWebVitals from './reportWebVitals'
import { ConfigProvider, theme, notification } from 'antd';
import { ThemeProvider } from 'antd-style';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBrand, useMatchBreakpoints, useSettings } from '@arken/forge-ui/hooks';
import { PromptProvider } from '@arken/forge-ui/hooks/usePrompt';
import { AuthProvider } from '@arken/forge-ui/hooks/useAuth';
import { NavProvider } from '@arken/forge-ui/hooks/useNav';
import { NoticeProvider } from '@arken/forge-ui/hooks/useNotice';
// import cerebro from '@arken/forge-ui'
import { lightTheme, darkTheme } from '~/themes';
import ResetStyles from '~/reset-styles';
import GlobalStyles from '~/global-styles';
import Authorize from './components/Authorize';
import { TourProvider } from './hooks/useTour';
import { SettingsProvider } from './hooks/useSettings';
import FormPage from './components/FormPage';
import ModelPage from './components/ModelPage';

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

  // const ThemeProvider2 = ThemeProvider as any

  return (
    <ConfigProvider theme={themeConfig}>
      <StyledThemeProvider theme={themeSettings}>
        {/* <ThemeProvider2 theme={themeConfig}> */}
        <QueryClientProvider client={window.queryClient}>
          <PromptProvider>
            <NoticeProvider>
              <ApolloProvider client={apolloClient}>
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
                  {/* <BrowserRouter basename="/">
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
                                <Route
                                  path="/realms"
                                  element={
                                    <Authorize permissions={[]}>
                                      <AppInner />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/settings"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Settings themeConfig={themeConfig} />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/users"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Users themeConfig={themeConfig} />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/roles"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Roles themeConfig={themeConfig} />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/forms"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Forms themeConfig={themeConfig} />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/groups"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Groups themeConfig={themeConfig} />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/templates"
                                  element={
                                    <Authorize permissions={[]}>
                                      <Templates />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/game/achievements"
                                  element={
                                    <Authorize permissions={[]}>
                                      <FormPage formKey="game-achievements" />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/crypto/tokens"
                                  element={
                                    <Authorize permissions={[]}>
                                      <ModelPage modelKey="CollectibleCard" />
                                    </Authorize>
                                  }
                                />
                                <Route
                                  path="/collectible/cards"
                                  element={
                                    <Authorize permissions={[]}>
                                      <ModelPage modelKey="CollectibleCard" />
                                    </Authorize>
                                  }
                                />
                                <Route path="*" element={<PageNotFound defaultNotFoundValue={false} />} />
                              </Routes>
                            </Providers>
                          </SettingsProvider>
                        </TourProvider>
                      </NavProvider>
                    </BrowserRouter> */}
                </>
              </ApolloProvider>
            </NoticeProvider>
          </PromptProvider>
        </QueryClientProvider>
        {/* </ThemeProvider2> */}
      </StyledThemeProvider>
    </ConfigProvider>
  );
};

export default App;
