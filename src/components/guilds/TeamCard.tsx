import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardBody,
  CheckmarkCircleIcon,
  Tag,
  CommunityIcon,
  BlockIcon,
  Flex,
  Heading,
  PrizeIcon,
  Text,
} from '~/ui';
import { Team } from '~/config/constants/types';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import orderBy from 'lodash/orderBy';
import { Link as RouterLink } from 'react-router-dom';
import ComingSoon from '~/components/account/ComingSoon';
import StatBox from '~/components/account/StatBox';
import nfts from '~/config/constants/nfts';
import ProfileAvatar from './ProfileAvatar';

interface TeamCardProps {
  team: Team;
}

const Wrapper = styled.div`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 24px;
  }
`;

const Avatar = styled.img`
  border-radius: 50%;
  height: 64px;
  margin-top: -12px;
  width: 64px;
  border: solid 2px white;

  ${({ theme }) => theme.mediaQueries.md} {
    height: 128px;
    margin-top: -24px;
    width: 128px;
  }
`;

const AvatarWrap = styled.div`
  margin-bottom: 8px;
  text-align: center;
`;

const StyledCard = styled(Card)`
  overflow: visible;
`;

const StyledCardHeader = styled(CardHeader)<{ bg: string }>`
  position: relative;
  background: url(${({ bg }) => bg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background: none;
  padding-top: 0;
  text-align: center;
`;

const TeamName = styled(Heading).attrs({ as: 'h2' })`
  font-size: 24px;
  color: #fff;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`;

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 28px;
    line-height: 44px;
  }
`;

const Status = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`;

const Content = styled.div`
  flex: 1;
  padding: 5px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 5px;
  }
`;

const StatRow = styled.div`
  display: grid;
  grid-gap: 16px;
  grid-template-columns: 1fr;
  margin-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(2, 1fr);
    margin-bottom: 32px;
  }
`;

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const { t } = useTranslation();
  const [info, setInfo] = useState({
    memberCount: 0,
    points: 0,
  });
  const [members, setMembers] = useState([]);
  const membersList = orderBy(members, ['points'], ['desc']);

  useEffect(() => {
    if (!window) return;
    if (!team.id) return;

    async function init() {
      try {
        const rand = Math.floor(Math.random() * Math.floor(999999));
        const response = await fetch(`https://envoy.arken.gg/guilds/${team.id}/memberDetails.json?${rand}`).catch(
          () => {}
        );

        if (response) {
          const responseData = await response.json();

          setMembers(responseData);
        }
      } catch (e) {
        console.log(e);
      }
    }

    init();
  }, [team]);

  return (
    <Wrapper>
      <StyledCard>
        <StyledCardHeader bg={`/images/teams/${team.background}`}>
          <AvatarWrap>
            <Avatar src={`/images/teams/${team.images.md}`} alt="guild avatar" />
          </AvatarWrap>
          <TeamName color={team.textColor}>{team.name}</TeamName>
          <Text as="p" color={team.textColor}>
            {team.description}
          </Text>
        </StyledCardHeader>
        <CardBody>
          <StatRow>
            <StatBox icon={CommunityIcon} title={team.users} subtitle={t('Total Members')} />
            <StatBox icon={CommunityIcon} title={team.activeMemberCount} subtitle={t('Active Members')} />
            <StatBox icon={PrizeIcon} title={team.points} subtitle={t('Guild Points')} />
          </StatRow>
          <Heading as="h3">{t('Guild Achievements')}</Heading>
          <ComingSoon />
          <Heading as="h3">{t('Guild Members')}</Heading>
          {membersList.length === 0 ? (
            <Flex flexDirection="column" alignItems="center" justifyContent="center" p="24px">
              <Heading as="h5" size="md" color="textDisabled">
                {t('Loading...')}
              </Heading>
            </Flex>
          ) : null}
          <br />
          <br />
          {membersList.map((member) => {
            return (
              <Card key={member.username} style={{ marginBottom: 20, zoom: 0.7 }}>
                <CardBody>
                  <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
                    <ProfileAvatar
                      profile={{ ...member, nft: nfts.find((nftItem) => nftItem.characterId === member.characterId) }}
                    />
                    <Content>
                      <Username>
                        <RouterLink to={`/user/${member.username}`}>{member.username}</RouterLink>
                      </Username>
                    </Content>
                    <StatBox icon={PrizeIcon} title={member.points || 0} subtitle={t('Points')} />
                  </Flex>
                </CardBody>
              </Card>
            );
          })}
        </CardBody>
      </StyledCard>
    </Wrapper>
  );
};

export default TeamCard;
