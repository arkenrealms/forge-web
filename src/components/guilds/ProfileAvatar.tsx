import React from 'react'
import { NoProfileAvatarIcon } from '~/ui'
import { Profile } from '~/state/types'
import styled from 'styled-components'

export interface ProfileAvatarProps {
  profile: Profile
}

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
`
// TODO: replace with no provile avatar icon
const AvatarInactive = styled(NoProfileAvatarIcon)`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  return (
    <AvatarWrapper bg={`/images/nfts/${profile.nft.images.md}`}>
      {!profile.isActive ? <AvatarInactive /> : null}
    </AvatarWrapper>
  )
}

export default ProfileAvatar
