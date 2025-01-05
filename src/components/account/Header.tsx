import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useAuth } from '~/hooks/useAuth';
import { useModal } from '~/components/Modal';
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
  Card2,
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
  const { t } = useTranslation();
  const auth = useAuth();
  const [onEditProfileModal] = useModal(<EditProfileModal />, false);

  const now = new Date().getTime() / 1000;
  const twoMonths = now + 2 * 30 * 24 * 60 * 60;

  return (
    <div style={{ marginTop: 30 }}>
      <Card2>
        <Card>
          <Flex
            flexDirection={['column', null, 'row']}
            alignItems={['start', null, 'end']}
            justifyContent="space-between">
            <Heading as="h2" size="xl" style={{ textAlign: 'center', marginLeft: 5, marginTop: 15 }}>
              {t('Account')}
            </Heading>
            <br />
            {auth?.profile && (
              <Button onClick={onEditProfileModal} mt="10px" mr="10px" mb="10px" size="sm">
                {t('Edit Guild Membership')}
              </Button>
            )}
          </Flex>
          <hr />
          {auth?.profile ? (
            <CardHeader>
              <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
                <EditProfileAvatar profile={auth?.profile} />
                <Content>
                  <Username>{`${auth?.profile.name}`}</Username>
                  {auth?.permissions?.['Distribute Rewards'] ? (
                    <Flex alignItems="center">
                      <AddressLink href={`https://bscscan.com/address/${address}`} color="text" external>
                        {address}
                      </AddressLink>
                      <OpenNewIcon ml="4px" />
                    </Flex>
                  ) : null}
                  <ResponsiveText bold>{auth?.profile.team?.name}</ResponsiveText>
                </Content>
              </Flex>
              <Status>
                {auth?.profile?.isBanned && auth?.profile?.banExpireDate < twoMonths ? (
                  <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                    {t('Restricted')}
                  </Tag>
                ) : auth?.profile?.isBanned ? (
                  <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                    {t('Banned')}
                  </Tag>
                ) : auth?.profile.status === 'Active' ? (
                  <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                    {t('Active')}
                  </Tag>
                ) : auth?.profile.status === 'Archived' ? (
                  <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                    {t('Paused')}
                  </Tag>
                ) : null}
              </Status>
              <StatBox
                icon={PrizeIcon}
                title={auth?.profile?.points || 0}
                subtitle={t('Points')}
                mb="24px"
                style={{ position: 'absolute', bottom: 10, right: 30, zoom: 0.7 }}
              />
            </CardHeader>
          ) : null}
          <br />
          {children}
        </Card>
      </Card2>
    </div>
  );
};

export default ProfileHeader;
