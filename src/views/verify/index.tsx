import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import { CopyToClipboard } from '~/components/CopyToClipboard';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { BaseLayout, Button, Card, Flex, Heading, Text } from '~/ui';

const Cards = styled(BaseLayout)`
  align-items: flex-start;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
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

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
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

const InputWrap = styled.div`
  width: 100%;
`;

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

const Textarea = styled.textarea`
  width: 400px;
  height: 150px;
  text-transform: none;
  border-radius: 5px;
  border: none;
  background-color: #000;
  color: #fff;
  padding: 10px;
  font-family: 'Alegreya Sans', Cambria, Verdana, Arial, Helvetica, sans-serif;
`;

const Evolution: React.FC = () => {
  const location = useLocation();
  const match = parseMatch(location);
  const { t } = useTranslation();
  const [message, setMessage] = useState(match?.params?.message ? match?.params?.message + '' : '');
  const [status, setStatus] = useState('ready');
  const [signature, setSignature] = useState('');
  const { account, library } = useWeb3();
  const { web3 } = useWeb3();
  // const updateHistory = useCallback(
  //   (key, val) => {
  //     setTimeout(() => {
  //       try {
  //         history.push({
  //           pathname: '/evolution',
  //           search:
  //             '?' +
  //             new URLSearchParams({
  //               realm: message.toString(),
  //               [key]: val,
  //             }).toString(),
  //           // state: { detail: 'some_value' }
  //         })
  //       } catch (e) {
  //         console.log(e)
  //       }
  //     }, 500)
  //   },
  //   [history, message],
  // )

  async function getSignature(value) {
    // const value = Math.floor(Math.random() * 999) + ''
    const hash = library?.bnbSign
      ? (await library.bnbSign(account, value))?.signature
      : await web3.eth.personal.sign(value, account, null);

    return hash;
  }

  return (
    <div>
      <ConnectNetwork />

      <Cards>
        <VerticalCards2>
          {message ? (
            <MainCard>
              <Flex flexDirection="column" alignItems="center" justifyContent="center">
                <Heading as="h2" size="xl" color="#fff" mb="24px">
                  Verify Signature
                </Heading>
                <br />
                <p>Message: {message}</p>
                <br />
                <br />
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Button
                    onClick={async () => {
                      setStatus('pending');
                      setSignature(await getSignature(message));
                    }}>
                    {t('Sign')}
                  </Button>
                </Flex>
                <br />
                <br />
                {signature ? (
                  <>
                    <br />
                    <br />
                    <p>Go back to discord and send:</p>
                    <br />
                    <InputWrap>
                      <Textarea rows={10}>{`/verify ${message}|${signature} `}</Textarea>
                      <br />
                      <br />
                      {/* <CopyToClipboard toCopy={`/verify ${message}|${signature} `}>Copy</CopyToClipboard> */}
                    </InputWrap>
                  </>
                ) : status === 'pending' ? (
                  <>
                    <p>Waiting for signature...</p>
                  </>
                ) : null}
              </Flex>
            </MainCard>
          ) : (
            <MainCard>
              <p>Error: no message to sign.</p>
            </MainCard>
          )}
        </VerticalCards2>
      </Cards>
    </div>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
