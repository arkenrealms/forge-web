import React, { useEffect, useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { Layout, Spin, Button } from 'antd';
import queryString from 'query-string';
import _ from 'lodash';
// import { useAuth0 } from '@auth0/auth0-react'
import config from '../config';

const zzz = styled.div``;

const handleTimeout = (expiryInteger: number, func: any) => {
  const expiry = new Date(expiryInteger * 1000);
  const timeout = expiry.getTime() - new Date().getTime();
  console.log(`token expiry time: ${expiry}, logout timer timeout (milliseconds): ${timeout})} `);
  if (timeout <= 0) {
    func();
  } else {
    setTimeout(func, timeout);
  }
};

const NotAuthorized = ({ children, login }: any) => (
  <div
    css={css`
      font-family: Lato, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      font-size: 30px;
      text-align: center;
      padding: 30px;
      padding-top: calc(100vh / 2);
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
    `}>
    <span
      css={css`
        margin-left: 20px;
        color: #1d6495;
        font-weight: bold;
      `}>
      {children}
      <br />
      <Button
        type="primary"
        // size="large"
        onClick={login}
        css={css`
          margin-top: 20px;
        `}
        data-testid="authorize">
        Authorize
      </Button>
    </span>
  </div>
);

const Loading = ({ children }: any) => (
  <div
    css={css`
      font-family: Lato, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      font-size: 30px;
      text-align: center;
      padding: 30px;
      padding-top: calc(100vh / 2);
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
    `}>
    <Spin size="large" />{' '}
    <span
      css={css`
        margin-left: 20px;
        color: #1d6495;
        font-weight: bold;

        &:after {
          animation: dots 2s linear infinite;
          content: '';
          width: 25px;
          display: inline-block;
          text-align: left;
          letter-spacing: 3px;
          margin-left: 3px;
        }

        @keyframes dots {
          0%, 20% {
            content: '.';
          }
          40% {
            content: '..';
          }
          60% {
            content: '...';
          }
          90%, 100% {
            content: '';
          }
      `}>
      {children}
    </span>
  </div>
);

export const getUserType = (user: any = {}): any => {
  if (!Object.prototype.hasOwnProperty.call(user, 'https://schema.asi.sh/userType')) {
    return 'unknown';
  }

  const userElement = user['https://schema.asi.sh/userType'];
  if (userElement === 'internal') {
    return 'internal';
  } else if (userElement === 'external') {
    return 'external';
  } else {
    console.error(`unknown type ${userElement}`);
    return 'unknown';
  }
};

export default (params: any) => {
  // const {
  //   isAuthenticated,
  //   isLoading,
  //   error,
  //   user,
  //   loginWithRedirect,
  //   logout,
  //   getAccessTokenSilently,
  //   getIdTokenClaims,
  // } = useAuth0()
  // const [isTokenParsed, setIsTokenParsed] = useState<boolean>(false)
  // const [userType, setUserType] = useState<any>('unknown')
  // // config.isAuthorizationEnabled = !!localStorage.getItem(config.tokenKey) // TODO: check for auth token in hash
  // useEffect(() => {
  //   async function run() {
  //     // Check for token in URL
  //     const parsed: any = queryString.parse(window.location.hash)
  //     if (parsed.token) {
  //       localStorage.setItem(config.tokenKey, parsed.token)
  //     }
  //     if (config.isAuthorizationEnabled && !isLoading && !user) {
  //       await loginWithRedirect()
  //     }
  //   }
  //   run()
  // }, [isLoading])
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     getIdTokenClaims()
  //       .then((claims: any) => {
  //         localStorage.setItem(config.tokenKey, claims.__raw)
  //         const loggedInUserType = getUserType(user)
  //         if ('internal' === loggedInUserType) {
  //           console.log('internal user detected')
  //           setUserType('internal')
  //         } else if ('external' === loggedInUserType) {
  //           console.log('external user detected')
  //           setUserType('external')
  //         } else {
  //           console.error('unknown user type!')
  //         }
  //         if (claims.exp) {
  //           console.error('Claim exp present', claims)
  //           handleTimeout(claims.exp, logout)
  //         }
  //         setIsTokenParsed(true)
  //       })
  //       .catch((err) => {
  //         console.error('Cannot silently get token', err)
  //         logout()
  //       })
  //   }
  // }, [getAccessTokenSilently, isAuthenticated])
  // if (config.isAuthorizationEnabled) {
  //   if (isLoading) return <Loading>Authorizing</Loading>
  //   if (!isTokenParsed) return <Loading>Logging in, please wait...</Loading>
  //   if (error) return <NotAuthorized>Ow Snap! Close this tab and retry</NotAuthorized>
  //   if (!isAuthenticated) return <NotAuthorized>Access Denied</NotAuthorized>
  // }
  // return (
  //   <Layout css={css``}>
  //     {isAuthenticated || !config.isAuthorizationEnabled ? (
  //       params.children
  //     ) : isLoading ? (
  //       <Loading>Authorizing</Loading>
  //     ) : (
  //       <NotAuthorized login={() => {}} />
  //     )}
  //   </Layout>
  // )
};
