import React from 'react';
import { NoProfileAvatarIcon } from '~/ui';
import { Profile } from '~/state/types';
import styled from 'styled-components';

export interface ProfileAvatarProps {
  profile: Profile;
}

const TeamAvatar = styled.img`
  // border: 1px solid ${({ theme }) => theme.card.background};
  // border-radius: 50%;

  height: 24px;
  position: absolute;
  right: 0px;
  bottom: 0px;
  width: 24px;
  z-index: 5;
  filter: contrast(2) brightness(0.9) saturate(0.7);

  ${({ theme }) => theme.mediaQueries.sm} {
    filter: drop-shadow(2px 4px 6px black);
    // border-width: 2px;
    height: calc(256px / 6);
    width: calc(256px / 6);
  }
`;

const AvatarWrapper = styled.div<{ bg: string }>`
  background: url('${({ bg }) => bg}');
  background-repeat: no-repeat;
  background-size: 200%;
  background-position: 50% 10%;
  border-radius: 50%;
  height: 64px;
  position: relative;
  width: 64px;
  filter: contrast(1.1);

  & > img {
    // border-radius: 50%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`;
// TODO: replace with no provile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`;

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  return (
    <AvatarWrapper bg={`/images/character-classes/${profile.nft?.images?.md}`}>
      {!profile.isActive ? <AvatarInactive /> : null}
      {profile.team ? <TeamAvatar src={`/images/teams/${profile.team.images.alt}`} alt={profile.team.name} /> : null}
    </AvatarWrapper>
  );
};

export default ProfileAvatar;
