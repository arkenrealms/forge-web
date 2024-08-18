import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useModal } from '~/components/Modal';
import useCache from '~/hooks/useCache';
import useI18n from '~/hooks/useI18n';
import useWeb3 from '~/hooks/useWeb3';
import { useProfile } from '~/state/hooks';
import {
  BlockIcon,
  Button,
  Card,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  Link,
  OpenNewIcon,
  PrizeIcon,
  Tag,
  Text,
} from '~/ui';
import CardHeader from './CardHeader';
import EditProfileAvatar from './EditProfileAvatar';
import EditProfileModal from './EditProfileModal';
import StatBox from './StatBox';

const Content = styled.div`
  flex: 1;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`;

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    line-height: 44px;
  }
`;

const Status = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`;

const ResponsiveText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`;

const AddressLink = styled(Link)`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    width: auto;
  }
`;

const ProfileHeader = ({ address, children }) => {
  const TranslateString = useI18n();
  const { isInitialized, isLoading, hasProfile, profile } = useProfile(address);
  const cache = useCache();
  const { address: account } = useWeb3();
  const { t } = useTranslation();
  // const { canClaim, checkClaimStatus } = useCanClaim()
  // const [onPresentClaimGiftModal] = useModal(<ClaimNftAndRuneModal onSuccess={checkClaimStatus} />)
  const [onEditProfileModal] = useModal(<EditProfileModal />, false);

  const now = new Date().getTime() / 1000;
  const twoMonths = now + 2 * 30 * 24 * 60 * 60;
  console.log(66666, cache.overview[address]);
  return (
    <div style={{ marginTop: 30 }}>
      <Card>
        <Flex
          flexDirection={['column', null, 'row']}
          alignItems={['start', null, 'end']}
          justifyContent="space-between">
          <Heading as="h2" size="xl" style={{ textAlign: 'center', marginLeft: 5, marginTop: 15 }}>
            {t('Account')}
          </Heading>
          {/* <Heading as="h2" size="lg" mb="16px">
              {t('Check your stats and collect achievements')}
            </Heading> */}
          <br />
          {hasProfile && (
            <Button onClick={onEditProfileModal} mt="10px" mr="10px">
              {t('Edit Guild Membership')}
            </Button>
          )}
        </Flex>
        <hr />
        {/* {canClaim && (
            <Button variant="tertiary" onClick={onPresentClaimGiftModal} startIcon={<Won />}>
              {t("You've got a gift to claim!")}
            </Button>
          )} */}
        {hasProfile ? (
          <CardHeader>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <EditProfileAvatar profile={profile} />
              <Content>
                <Username>{`${profile.username}`}</Username>
                {cache.overview[account]?.permissions?.admin?.distributeReward ? (
                  <Flex alignItems="center">
                    <AddressLink href={`https://bscscan.com/address/${address}`} color="text" external>
                      {address}
                    </AddressLink>
                    <OpenNewIcon ml="4px" />
                  </Flex>
                ) : null}
                <ResponsiveText bold>{profile.team?.name}</ResponsiveText>
              </Content>
            </Flex>
            <Status>
              {cache.overview[address]?.isBanned && cache.overview[address]?.banExpireDate < twoMonths ? (
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Restricted')}
                </Tag>
              ) : cache.overview[address]?.isBanned ? (
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Banned')}
                </Tag>
              ) : profile.isActive ? (
                <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                  {t('Active')}
                </Tag>
              ) : (
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Paused')}
                </Tag>
              )}
            </Status>
            <StatBox
              icon={PrizeIcon}
              title={cache.overview[address]?.points || 0}
              subtitle={t('Points')}
              mb="24px"
              style={{ position: 'absolute', bottom: 10, right: 30, zoom: 0.7 }}
            />
          </CardHeader>
        ) : null}
        <br />
        {children}
      </Card>
    </div>
  );
};

export default ProfileHeader;
