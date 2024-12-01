import React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { Button, Card3, CommunityIcon, Flex, Heading, PrizeIcon, Text } from '~/ui';
import useI18n from '~/hooks/useI18n';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Team } from '~/config/constants/types';
import type * as Arken from '@arken/node';

interface TeamCardProps {
  rank: number;
  team: Arken.Core.Types.Team;
}

const getBackground = (theme: DefaultTheme) => {
  if (theme.isDark) {
    return 'linear-gradient(139.73deg, #142339 0%, #24243D 47.4%, #37273F 100%)';
  }

  return 'linear-gradient(139.73deg, #E6FDFF 0%, #EFF4F5 46.87%, #F3EFFF 100%)';
};

const TeamRank = styled.div`
  align-self: stretch;
  background: ${({ theme }) => getBackground(theme)};
  flex: none;
  padding: 16px 0;
  text-align: center;
  width: 56px;
  border-radius: 10px 0 0 10px;
  margin: 3px;
`;

const Body = styled.div`
  align-items: start;
  display: flex;
  flex: 1;
  flex-direction: column;
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    align-items: center;
    flex-direction: row;
    font-size: 40px;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Avatar = styled.img`
  // filter: contrast(1.5) brightness(0.9) saturate(0.7);
  filter: drop-shadow(2px 4px 6px black);
`;

const TeamName = styled(Heading).attrs({ as: 'h3' })`
  font-size: 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 40px;
  }
`;

const MobileAvatar = styled.div`
  flex: none;
  margin-right: 8px;
  filter: contrast(1.2);

  ${Avatar} {
    height: 64px;
    width: 64px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;

const DesktopAvatar = styled.div`
  display: none;
  position: relative;
  // padding: 16px;
  filter: contrast(1.2);

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
    margin-left: 24px;

    ${Avatar} {
      height: 128px;
      width: 128px;
      // border: 1px solid #623718;
    }
  }
`;

const AvatarBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  // background: url(/images/teams/guild-bg.png) no-repeat 0 0;
  background-size: contain;
  width: 100%;
  height: 100%;
`;

const TeamCard: React.FC<TeamCardProps> = ({ rank, team }) => {
  const { t } = useTranslation();
  const avatar = <></>; // <Avatar src={`/images/teams/${team.images?.md}`} alt="team avatar" />;

  return (
    <Card3 style={{ display: 'flex', marginBottom: 16 }}>
      {/* <TeamRank>
        <Text bold fontSize="24px">
          {rank}
        </Text>
      </TeamRank> */}
      <Body>
        <Info>
          <Flex alignItems="center" mb="16px">
            <MobileAvatar>{avatar}</MobileAvatar>
            <TeamName>
              <RouterLink to={`/guild/${team.id}`}>{team.name}</RouterLink>
            </TeamName>
          </Flex>
          <Text as="p" color="textSubtle" pr="24px" mb="16px">
            {team.description}
          </Text>
          <Flex>
            <Flex>
              {/* alignSelf for Safari fix */}
              <PrizeIcon width="24px" mr="8px" style={{ alignSelf: 'center' }} />
              <Text fontSize="24px" bold>
                {team.points || 0}
              </Text>
            </Flex>
            <Flex ml="24px">
              {/* alignSelf for Safari fix */}
              <CommunityIcon width="24px" mr="8px" style={{ alignSelf: 'center' }} />
              <Text fontSize="24px" bold>
                {team.profiles?.length || 0}
              </Text>
            </Flex>
          </Flex>
        </Info>
        <Button as={Link} to={`/guild/${team?.id}`} variant="secondary" scale="sm">
          {t('See More')}
        </Button>
        <DesktopAvatar>
          <AvatarBg />
          {avatar}
        </DesktopAvatar>
      </Body>
    </Card3>
  );
};

export default TeamCard;
