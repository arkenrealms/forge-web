import React from 'react';
import styled from 'styled-components';
import { Card, CardBody, CardHeader, Flex, Heading, Text } from '~/ui';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useToast, useProfile, useFetchProfile } from '~/state/hooks';
import Page from '~/components/layout/Page';
import useWeb3 from '~/hooks/useWeb3';
import PageLoader from '~/components/PageLoader';
import { ConnectNetwork } from '~/components/ConnectNetwork';
import AchievementsList from '~/components/AchievementsList';
import WalletNotConnected from '~/components/account/WalletNotConnected';
import ComingSoon from '~/components/account/ComingSoon';
import Menu from '~/components/account/Menu';
import Header from '~/components/account/Header';
import ProfileCreation from './ProfileCreation';

const gemoji = styled.span<{ gemoji: string }>``;

const QuestsContainer = styled.div`
  a {
    border-bottom: 1px solid #fff;
  }
`;

const TaskCenter = ({ match }) => {
  const { id }: { id: string } = match.params;
  const { address: _account, library } = useWeb3();
  const account = id ? id : _account;
  useFetchProfile(account);
  const { profile, hasProfile } = useProfile(account);
  const { t } = useTranslation();

  // if (!account) {
  //   return <Page><WalletNotConnected /></Page>
  // }

  if (account && !hasProfile) {
    return (
      <Page>
        <ProfileCreation />
      </Page>
    );
  }

  return (
    <Page>
      <ConnectNetwork />

      <Header address={account}>
        <Menu params={match.params} activeIndex={3} />
      </Header>
      <br />
      <Card>
        <CardHeader>
          <Flex alignItems="center" justifyContent="space-between">
            <Heading size="lg" mb="8px">
              {t('Quests')}
            </Heading>
            <Text as="p">{t('Earn points by completing quests!')}</Text>
          </Flex>
        </CardHeader>
        <CardBody>
          <QuestsContainer>
            {account ? (
              <>
                <a href="https://www.google.com/search?q=rune+metaverse" target="_blank" rel="noreferrer noopener">
                  Rune on Google
                </a>{' '}
                - Just click
                <br />
                <br />
                <a href="https://www.youtube.com/arkenrealms" target="_blank" rel="noreferrer noopener">
                  Rune on YouTube
                </a>{' '}
                - View latest videos, SUBSCRIBE &amp; click LIKE
                <br />
                <br />
                <a href="https://www.coingecko.com/en/coins/rune-shards" target="_blank" rel="noreferrer noopener">
                  Rune on CoinGecko
                </a>{' '}
                - Vote GOOD &amp; click the STAR
                <br />
                <br />
                <a href="https://www.certik.com/projects/rune" target="_blank" rel="noreferrer noopener">
                  Rune on CertiK
                </a>{' '}
                - Vote SECURE &amp; click the STAR
                <br />
                <br />
                <a href="https://coinmarketcap.com/currencies/rune-shards/" target="_blank" rel="noreferrer noopener">
                  Rune on CMC
                </a>{' '}
                +{' '}
                <a
                  href="https://coinmarketcap.com/watchlist/6155d7e5bea8737592b2b8a6"
                  target="_blank"
                  rel="noreferrer noopener">
                  Rune Watchlist
                </a>{' '}
                - Click the STAR &amp; scroll down to vote GOOD
                <br />
                <br />
                <a href="https://coinsniper.net/coin/17785" target="_blank" rel="noreferrer noopener">
                  Rune on CoinSniper
                </a>{' '}
                +{' '}
                <a href="https://coinhunt.cc/coin/1974863351" target="_blank" rel="noreferrer noopener">
                  Rune on CoinHunt
                </a>{' '}
                +{' '}
                <a
                  href="https://spintop.network/gamepedia/games/rune-evolution"
                  target="_blank"
                  rel="noreferrer noopener">
                  Rune on SpinTop
                </a>
                <br />
                <br />
                <a href="https://twitch.arken.gg" target="_blank" rel="noreferrer noopener">
                  Rune on Twitch
                </a>{' '}
                +{' '}
                <a
                  href="https://www.twitch.tv/directory/game/Rune%20Evolution"
                  target="_blank"
                  rel="noreferrer noopener">
                  Evolution on Twitch
                </a>{' '}
                +{' '}
                <a
                  href="https://www.twitch.tv/directory/game/Rune%20Infinite"
                  target="_blank"
                  rel="noreferrer noopener">
                  Infinite on Twitch
                </a>{' '}
                - Follow
                <br />
                <br />
                <a href="https://discord.arken.gg" target="_blank" rel="noreferrer noopener">
                  Rune on Discord
                </a>{' '}
                - Join &amp; LIKE announcements
                <br />
                <br />
                <a href="https://www.reddit.com/r/ArkenRealms/" target="_blank" rel="noreferrer noopener">
                  Rune on Reddit
                </a>{' '}
                - UPVOTE and comment all the posts!
                <br />
                <br />
                <a
                  href="https://play.google.com/store/apps/details?id=com.DefaultCompany.Evolution_2___Client"
                  target="_blank"
                  rel="noreferrer noopener">
                  Rune on Google Play
                </a>{' '}
                - Review
                <br />
                <br />
                <a href="https://twitter.arken.gg" target="_blank" rel="noreferrer noopener">
                  Rune on Twitter
                </a>{' '}
                - Tweet about Rune! Use the tag #ArkenRealms
              </>
            ) : (
              <WalletNotConnected />
            )}
          </QuestsContainer>
        </CardBody>
      </Card>
    </Page>
  );
};

export default TaskCenter;
