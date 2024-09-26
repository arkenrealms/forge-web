import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';
import UIKitInput from '~/components/Input/Input';
import Page from '~/components/layout/Page';
import { useConfig } from '~/hooks/useConfig';
import useWeb3 from '~/hooks/useWeb3';
import { getUsername } from '~/state/profiles/getProfile';
import { BaseLayout, Button, Card, CardBody, Flex, Heading, LinkExternal, OpenNewIcon } from '~/ui';

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  grid-gap: 75px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 12;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`;
const Input = styled(UIKitInput)`
  width: 100%;
  font-family: 'Alegreya Sans', sans-serif, monospace;
  text-transform: none;
`;
const BoxHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 16px;
`;

const VerticalCards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;
  align-content: start;

  & > div {
    grid-column: span 12;
    width: 100%;
    background-image: url(/images/background.jpeg);
    background-size: 400px;
  }
`;

const Container = styled.div``;

const InputWrap = styled.div`
  max-width: 600px;
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
  text-align: left;
`;

const MainCard = styled(Card)`
  position: relative;
  font-weight: bold;
  border-width: 15px;
  border-style: solid;
  border-color: transparent;
  border-image: url('/images/frame.png') 80 repeat;
  border-image-width: 80px;
  // transform: scale(0.8);
  text-shadow: 1px 1px 1px black;
  // box-shadow: 0 2px 0 0 rgb(0 0 0 / 80%), inset 0 -1px 0 0 rgb(0 0 0 / 10%), 0 0 66px 66px rgb(0 0 0 / 10%);
  text-align: center;
  color: #bb955e;
  text-shadow: 1px 1px 1px black;
  font-weight: bold;
  padding: 20px;
`;
const Img = styled.img`
  filter: contrast(1.1) drop-shadow(2px 4px 6px black);
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 100%;
  }
`;

const Refer = () => {
  const { address: account } = useWeb3();
  const { t } = useTranslation();
  const [username, setUsername] = useState(null);
  const [refers, setRefers] = useState([]);
  const { mintCost, registerCost } = useConfig();

  useEffect(
    function () {
      if (!account) return;

      // accountInitialized = true

      async function init() {
        try {
          const res = await getUsername(account);
          // @ts-ignore
          if (res) {
            setUsername(res);
          } else {
            // setUsername(account.slice(0, 5))
          }
        } catch (e) {
          // @ts-ignore
          // setUsername(account.slice(0, 5))
        }

        try {
          const rand = Math.floor(Math.random() * Math.floor(999999));
          const data = (await (await fetch('https://s1.relay.arken.asi.sh/data/refers.json?' + rand)).json()) as any; // https://s1.envoy.arken.asi.sh/affiliate/refers.json

          setRefers(data);
        } catch (e) {
          console.log(e);
        }
      }

      init();
    },
    [account, setUsername]
  );

  const referralCount = refers.filter((r) => r.referrer === username).length;

  const referer = Cookies.get(`referer`);

  return (
    <Page>
      <Container>
        {!username && referer ? (
          <CardBody style={{ background: 'rgba(255, 255, 255, 0.1)', marginBottom: 50 }}>
            <BoxHeading as="h2" size="xl">
              {t(`You've been referred by`) + ' ' + referer}
            </BoxHeading>
            <p>
              You've been chosen to be among the elite.
              <br />
              <br />
              After you join, you'll receive a 20% refund on your account creation cost.
            </p>
            <br />
            <br />
            <Flex flexDirection="column" alignItems="center" justifyContent="center">
              <Button
                as={RouterLink}
                to={'/user/' + referer}
                style={{ zoom: 1, padding: '6px 20px', textAlign: 'center' }}
                onClick={() => {
                  window.scrollTo(0, 0);
                }}>
                View {referer}'s Profile
                <OpenNewIcon color="white" ml="4px" />
              </Button>
            </Flex>
          </CardBody>
        ) : null}
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Heading size="xl" mb="24px" style={{ fontSize: '3rem', textAlign: 'center' }}>
            {t('Referral Program')}
          </Heading>
        </Flex>
        <br />
        <br />
        <MainCard>
          <p style={{ textAlign: 'left' }}>
            Share one of these links with your friends, and you'll receive RXS rewards directly to you.
            <br />
            <br />
            They will receive a 20% refund on their account creation cost, and you'll receive bonuses.
            <br />
            <br />
            The more they play, the more you earn!
            <br />
            <br />
            <ol style={{ lineHeight: '2rem' }}>
              <li>
                Account creation = 20% of their account creation cost (currently{' '}
                {((mintCost + registerCost) / 5).toFixed(3)} RXS)
              </li>
              <li>Evolution rewards = 1% of winnings (bonus)</li>
              <li>... and more coming soon!</li>
            </ol>
            <br />
            <br />
            In addition to this, for a limited time, you will receive a bonus amount of VEX for every new account
            referral.
            <br />
            <br />
            It's an exclusive rune and the only way to get it right now is by referring a friend.
          </p>
        </MainCard>
        <br />
        <br />
        {username ? (
          <>
            <Cards>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading size="lg" mb="24px" style={{ fontSize: '3rem' }}>
                    {t('Your Links')}
                  </Heading>
                  <br />
                  <br />
                  <InputWrap>
                    <Input value={`https://arken.gg/#u=${username.replace(' ', '%20')}`} />
                  </InputWrap>
                  <br />
                  <InputWrap>
                    <Input value={`https://arken.gg/guide/#u=${username.replace(' ', '%20')}`} />
                  </InputWrap>
                  <br />
                  <InputWrap>
                    <Input value={`https://arken.gg/evolution/#u=${username.replace(' ', '%20')}`} />
                  </InputWrap>
                  <br />
                  <InputWrap>
                    <Input value={`https://arken.gg/profile/#u=${username.replace(' ', '%20')}`} />
                  </InputWrap>
                </Flex>
              </MainCard>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading size="lg" mb="24px" style={{ fontSize: '3rem' }}>
                    {t('Your Stats')}
                  </Heading>
                  <br />
                  <br />
                  <p>
                    <strong>Referrals:</strong> {referralCount}
                  </p>
                  <br />
                  <br />
                  <p>
                    <strong>Rewards:</strong>
                  </p>
                  <br />
                  <br />
                  <p>{referralCount} VEX</p>
                  <br />
                  <br />
                  <p>- RXS (calculating soon)</p>
                </Flex>
              </MainCard>
              <MainCard>
                <Flex flexDirection="column" alignItems="center" justifyContent="center">
                  <Heading as="h2" size="lg" color="#fff" mb="24px">
                    Rune Press Kit
                  </Heading>
                  <br />
                  <Img src="/images/chars.png" />
                  <br />
                  <br />
                  <LinkExternal href="https://drive.google.com/file/d/1uxUZq7o5fW3_feDqDuMH0pzPvgJWSAJc/view?usp=sharing">
                    Download
                  </LinkExternal>
                </Flex>
              </MainCard>
              <MainCard>
                <Heading as="h2" size="lg" color="#fff" mb="24px">
                  Embed HTML
                </Heading>
                <br />
                <br />
                <h2>Mobile:</h2>
                <br />
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<iframe title="arken.gg" src="https://arken.gg/ads/1/mobile/#u=${username.replace(
                      ' ',
                      '%20'
                    )}" style="width: 100%; height: 75px;"></iframe>`,
                  }}
                />
                <br />
                <Textarea rows={10}>{`
                    <iframe title="arken.gg" src="https://arken.gg/ads/1/mobile/#u=${username.replace(
                      ' ',
                      '%20'
                    )}" style="width: 100%; height: 75px;"></iframe>
                    `}</Textarea>
                <br />
                <br />
                <h2>Desktop:</h2>
                <br />
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<iframe title="arken.gg" src="https://arken.gg/ads/1/desktop/#u=${username.replace(
                      ' ',
                      '%20'
                    )}" style="width: 100%; height: 48px;"></iframe>`,
                  }}
                />
                <br />
                <Textarea rows={10}>{`
                    <iframe title="arken.gg" src="https://arken.gg/ads/1/desktop/#u=${username.replace(
                      ' ',
                      '%20'
                    )}" style="width: 100%; height: 48px;"></iframe>
                    `}</Textarea>
              </MainCard>
            </Cards>
          </>
        ) : (
          <>
            <Flex
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              style={{ fontSize: '1.3rem', textAlign: 'center' }}>
              You don't have an account yet.
              <br />
              <br />
              You will need that first.
              <br />
              <br />
              Fee: {mintCost + registerCost + ''} RXS
              <br />
              <br />
              <Button
                scale="md"
                as={RouterLink}
                to="/account"
                onClick={() => {
                  window.scrollTo(0, 0);
                }}>
                Create Account
              </Button>
            </Flex>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <p>
              <em>
                Note: Every referred account must have created a character after July 23rd, 2021 to be considered a
                referral.
              </em>
            </p>
            <br />
            <p>
              <em>Note: Initial payouts may not be until end of August. After that they will be every 1-2 weeks.</em>
            </p>
            <br />
            <p>
              <em>More stats coming soon!</em>
            </p>
          </>
        )}

        <br />
        <br />
        <br />
        <br />
        {/* <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <Button as={RouterLink} to="/press">Get Press Kit</Button>
          <br />
          <br />
          <br />
          <hr />
          <br />
          <br />
        </Flex> */}
        <br />
        <br />
        <br />
        <br />
      </Container>
    </Page>
  );
};

export default Refer;
