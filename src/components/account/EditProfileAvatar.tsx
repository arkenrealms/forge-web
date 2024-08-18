import React from 'react'
import styled from 'styled-components'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import EditProfileModal from './EditProfileModal'
import ProfileAvatar, { ProfileAvatarProps } from './ProfileAvatar'

const EditOverlay = styled.div`
  background: rgba(0, 0, 0, 0.6) url('/images/edit-icon.png') no-repeat center center;
  background-size: 24px;
  border-radius: 50%;
  left: 0;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity 300ms;
  width: 100%;
  z-index: 3;
  background-position: 60% 50%;

  ${({ theme }) => theme.mediaQueries.sm} {
    background-size: 48px;
  }
`

const StyledEditProfileAvatar = styled.div`
  position: relative;

  &:hover {
    cursor: url('/images/cursor3.png'), pointer;

    ${EditOverlay} {
      opacity: 1;
    }
  }
`

const EditProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile }) => {
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)

  return (
    <StyledEditProfileAvatar onClick={onEditProfileModal}>
      <ProfileAvatar profile={profile} />
      <EditOverlay />
    </StyledEditProfileAvatar>
  )
}

export default EditProfileAvatar
