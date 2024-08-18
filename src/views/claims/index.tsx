import React, { useCallback, useEffect, useState, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Button, Heading, Toggle, Text, Flex, BaseLayout, Card } from '~/ui';
import useMatchBreakpoints from '~/hooks/useMatchBreakpoints';
import { useToast } from '~/state/hooks';
import useWeb3 from '~/hooks/useWeb3';
import { parseISO, formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import queryString from 'query-string';
import addresses from 'rune-backend-sdk/build/contractInfo';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import Select, { OptionProps } from '~/components/Select/Select';
import { getUserAddressByUsername } from '~/state/profiles/getProfile';
import { Link as RouterLink, NavLink, useLocation, useNavigate } from 'react-router-dom';

const debug = process.env.NODE_ENV !== 'production';
const playerWhitelist = ['Botter'];

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;

const Container = styled.div`
  width: 100%;
`;

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 0px;

  & > div {
    grid-column: span 12;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 500px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;
const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  padding: 20px;
  padding-bottom: 40px;
  background: none;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  background: #000;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
`;

const VerticalCards2 = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  width: calc(100% - 40px);
  ${({ theme }) => theme.mediaQueries.lg} {
    margin: 20px;
    & > div {
      max-width: 600px;
      margin: 0 auto;
    }
  }

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;

const AdminTools = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.7);
  padding: 20px;
  margin: 20px;
`;

const AdminUserRow = styled.div`
  color: #fff;
  width: 100%;
  margin-bottom: 5px;
`;

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  margin-bottom: 20px;

  justify-content: space-between;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`;

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 100%;
  margin-bottom: 10px;

  ${Text} {
    margin-left: 8px;
  }
`;

const log = (...args) => {
  if (debug) console.log(...args);
};

const config = {
  username: 'Guest' + Math.floor(Math.random() * 999),
  address: '0xc84ce216fef4EC8957bD0Fb966Bb3c3E2c938082',
  isMobile: false,
};

const parseMatch = (location) => {
  const match = {
    params: queryString.parse(location?.search || ''),
  };

  for (const key in match.params) {
    if (match.params[key] === 'false') {
      // @ts-ignore
      match.params[key] = false;
    } else if (match.params[key] === 'true') {
      // @ts-ignore
      match.params[key] = true;
    }
  }

  return match;
};

const GlobalStyles = createGlobalStyle`
#server-menu > div {
  display: block;
}
`;

const Input = styled.input`
  text-transform: none;
  background: #000;
  border: 2px dashed #666;
  padding: 5px;
  border-radius: 4px;
  color: #fff;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
  position: relative !important;
  bottom: auto !important;
`;

const ServerBox = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  margin-bottom: 20px;
  padding: 5px;
  border: 1px solid #fff;
`;

const endpoint = 'https://coordinator.arken.gg';

const contractAddressToKey = {};

for (const contractKey of Object.keys(addresses)) {
  contractAddressToKey[addresses[contractKey][56]] = contractKey;
}

const Evolution: React.FC = () => {
  const location = useLocation();
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  const [claims, setClaims] = useState([]);

  useEffect(
    function () {
      if (!window) return;

      async function init() {
        try {
          const response = await fetch(endpoint + `/data/claimRequests.json`);
          const responseData = await response.json();

          setClaims(responseData.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1)).reverse());
        } catch (e) {
          console.log(e);
        }
      }

      init();

      const inter = setInterval(init, 10 * 60 * 1000);

      return () => {
        clearInterval(inter);
      };
    },
    [account, setClaims]
  );

  async function getSignature(text = null) {
    const value = text || Math.floor(Math.random() * 999) + '';
    const hash = library?.bnbSign
      ? (await library.bnbSign(account, value))?.signature
      : await web3.eth.personal.sign(value, account, null);

    return {
      value,
      hash,
    };
  }

  return (
    <Container>
      <GlobalStyles />
      <Cards>
        <MainCard>
          <Heading color="contrast" size="lg" style={{ textAlign: 'center', marginTop: 20 }}>
            Claims
          </Heading>
          <br />
          <br />
        </MainCard>
        <MainCard>
          {claims.map((claim) => {
            return (
              <ServerBox>
                <p>{claim.id}</p>
                <br />
                <p>
                  <strong>Status:</strong> {claim.status}
                  <br />
                  <br />
                  <strong>Address:</strong> {claim.address}
                  <br />
                  <br />
                  {claim.tokenAddresses.map((tokenAddress, i) => (
                    <>
                      {(claim.tokenAmounts[i] + '').slice(0, 10)} {contractAddressToKey[tokenAddress]}
                      <br />
                    </>
                  ))}
                  <br />
                  <br />
                  {formatDistance(parseISO(new Date(claim.createdAt).toISOString()), new Date(), { addSuffix: true })}
                </p>
                <br />
              </ServerBox>
            );
          })}
        </MainCard>
      </Cards>
    </Container>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
