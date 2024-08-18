import React, { useContext, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Tag, Checkbox } from '~/ui'
import { Modal, useModal, InjectedModalProps, ModalProvider } from '~/components/Modal'
import { Nft } from '~/config/constants/types'
import useTextFit from '~/hooks/useTextFit'
import { Textfit } from 'react-textfit'
import useEditProfile from '~/components/account/EditProfileModal/reducer'
import EditProfileModal from '~/components/account/EditProfileModal'
import { useProfile } from '~/state/hooks'

interface CollectibleCardProps {
  nft: Nft
  hideDescription?: boolean
}

const PreviewImage = styled.img`
  border-radius: 4px;
  margin-bottom: 8px;
`

const Container = styled.div<{ active: boolean }>`
  padding: 5px;
  position: relative;

  //   ${({ active }) =>
    active
      ? `
//   border: 2px solid #31D0AA;
//   border-radius: 16px;
//   color: #31D0AA;
// `
      : ''}
`

const Active = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  opacity: 0.5;
`

const CollectibleCard: React.FC<CollectibleCardProps> = ({ nft, hideDescription = false }) => {
  // const { setCloseOnOverlayClick } = useContext(ModalProvider.Context);
  const [onEditProfileModal] = useModal(<EditProfileModal defaultView="change" />, false)
  const { fontSize, ref } = useTextFit()
  const { profile } = useProfile()

  // useEffect(() => {
  //   setCloseOnOverlayClick(true)
  // }, [setCloseOnOverlayClick])
  return (
    <Container
      active={profile?.nft?.characterId === nft.characterId}
      onClick={() => {
        onEditProfileModal()
      }}
    >
      {profile?.nft?.characterId === nft.characterId && (
        <Active>
          <Checkbox checked scale="sm" readOnly />
        </Active>
      )}
      <PreviewImage src={`/images/nfts/${nft.images.lg}`} />
      <Text bold mb="8px" fontSize="13px" style={{ textAlign: 'center' }}>
        {nft.name}
      </Text>
      {!hideDescription ? (
        <Text as="p" fontSize="12px" color="textSubtle">
          {nft.description}
        </Text>
      ) : null}
    </Container>
  )
}

export default CollectibleCard
