import QRCode from 'qrcode.react';
import queryString from 'query-string';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import { CopyToClipboard } from '~/components/CopyToClipboard';
import useCache from '~/hooks/useCache';
import useWeb3 from '~/hooks/useWeb3';
import { useProfile } from '~/state/hooks';
import { BaseLayout, Button, Card, CardBody, Flex, Heading } from '~/ui';

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
  }
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

const QRWrapper = styled.div`
  background: #000;
  border-radius: 7px;
  padding: 25px;
`;

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

const Evolution: React.FC<any> = () => {
  const location = useLocation();
  const history = useNavigate();
  const cache = useCache();
  const { profile } = useProfile();
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

  async function getSignature(account2, value) {
    // const value = Math.floor(Math.random() * 999) + ''
    const hash = library?.bnbSign
      ? (await library.bnbSign(account2, value))?.signature
      : await web3.eth.personal.sign(value, account2, null);

    return hash;
  }

  return (
    <div>
      <ConnectNetwork />

      <Cards>
        <VerticalCards2>
          {!account || !profile?.nft ? (
            <Card>
              <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                Connect
              </Heading>
              <hr />
              <CardBody>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <p>Please connect your wallet with your Rune account.</p>
                  <br />
                  <br />
                  <Button
                    scale="sm"
                    as={RouterLink}
                    to="/account"
                    onClick={() => {
                      window.scrollTo(0, 0);
                    }}>
                    Create Account
                  </Button>
                </Flex>
              </CardBody>
            </Card>
          ) : null}

          {message ? (
            <Card>
              <Heading as="h2" size="xl" style={{ textAlign: 'center', marginTop: 15 }}>
                Sign Message
              </Heading>
              <hr />
              <CardBody>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <p>{message}</p>
                  <br />
                  <br />
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    <Button
                      onClick={async () => {
                        setStatus('pending');
                        setSignature(await getSignature(account, message));
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
                      <p>{/* Address <CopyToClipboard toCopy={account}>Copy</CopyToClipboard> */}</p>
                      <br />
                      <InputWrap style={{ border: '1px solid #fff' }}>
                        <Textarea rows={10} style={{ width: '100%' }}>
                          {account}
                        </Textarea>
                      </InputWrap>
                      <br />
                      <br />
                      <p>{/* Signature <CopyToClipboard toCopy={signature}>Copy</CopyToClipboard> */}</p>
                      <br />
                      <InputWrap style={{ border: '1px solid #fff' }}>
                        <Textarea rows={10} style={{ width: '100%' }}>
                          {signature}
                        </Textarea>
                      </InputWrap>
                      <br />
                      <br />
                      <p>QR (for mobile):</p>
                      <br />
                      <QRWrapper>
                        <QRCode
                          size={250}
                          value={`${account},${signature}`}
                          fgColor="#ffffff"
                          bgColor="#000000"
                          includeMargin
                        />
                      </QRWrapper>
                    </>
                  ) : status === 'pending' ? (
                    <>
                      <p>Waiting for signature...</p>
                    </>
                  ) : null}
                </Flex>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <p>Error: no message to sign.</p>
              </CardBody>
            </Card>
          )}
        </VerticalCards2>
      </Cards>
    </div>
  );
};

export default Evolution;

// {/* <p>Loading {progression * 100} percent...</p> */}
