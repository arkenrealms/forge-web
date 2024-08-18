import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { Card, CardBody, Heading, Tag, Button, ChevronUpIcon, ChevronDownIcon, Text, CardFooter } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { useProfile } from '~/state/hooks'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { Textfit } from 'react-textfit'
import useEditProfile from '~/components/account/EditProfileModal/reducer'
import { Nft } from '~/config/constants/types'
import EditProfileModal from '~/components/account/EditProfileModal'
import InfoRow from '../InfoRow'
import TransferNftModal from '../TransferNftModal'
import ClaimNftModal from '../ClaimNftModal'
import CreateCharacterModal from '../CreateCharacterModal'
import Preview from './Preview'

interface NftCardProps {
  nft: Nft
  canClaim?: boolean
  canMint?: boolean
  tokenIds?: number[]
  onSuccess?: () => void
  autoShowDescription?: boolean
  showCard?: boolean
}

const Header = styled.div`
  min-height: 28px;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  padding: 10px;
`

const DetailsButton = styled(Button).attrs({ variant: 'text' })`
  height: auto;
  padding: 16px 24px;

  &:hover:not(:disabled):not(:active) {
    background-color: transparent;
  }

  &:focus:not(:active) {
    box-shadow: none;
  }
`

const InfoBlock = styled.div`
  // padding: 24px;
`

const NftCard: React.FC<NftCardProps> = ({
  nft,
  onSuccess,
  canClaim = false,
  canMint = false,
  showCard = true,
  autoShowDescription = false,
  tokenIds = [],
}) => {
  const [isOpen, setIsOpen] = useState(autoShowDescription)
  const { t } = useTranslation()
  const { profile } = useProfile()
  const [_showCard, setShowCard] = useState(showCard)
  const { characterId, name, description } = nft
  const walletOwnsNft = tokenIds.length > 0
  const Icon = isOpen ? ChevronUpIcon : ChevronDownIcon

  const handleClick = async () => {
    setIsOpen(!isOpen)
  }

  const handleSuccess = async () => {
    onSuccess?.()
  }

  const [onEditProfileModal] = useModal(<EditProfileModal defaultView="change" />, false)
  const [onPresentTransferModal] = useModal(
    <TransferNftModal nft={nft} tokenIds={tokenIds} onSuccess={handleSuccess} />
  )
  const [onPresentClaimModal] = useModal(<ClaimNftModal nft={nft} onSuccess={handleSuccess} />)
  const [onPresentCreateModal] = useModal(<CreateCharacterModal nft={nft} onSuccess={handleSuccess} />)

  return (
    <div
      onClick={() => setShowCard(!_showCard)}
      css={css`
        div {
          font-size: 1.7rem !important;
        }

        ${_showCard
          ? `
        zoom: 1.8;
        min-width: 200px;
        img {
          transform: scale(1.3);
          filter: drop-shadow(0 0 1px #000) drop-shadow(0 0 50px rgb(255 255 255 / 70%));
        }
      `
          : ''}

        &:hover {
          zoom: 1.8;
          min-width: 200px;
          cursor: url('/images/cursor3.png'), pointer;

          img {
            transform: scale(1.3);
            filter: drop-shadow(0 0 1px #000) drop-shadow(0 0 50px rgb(255 255 255 / 70%));
          }
        }
      `}
    >
      <Preview nft={nft} isOwned={walletOwnsNft} />
      {!_showCard ? <Header>{name}</Header> : null}
      {_showCard ? (
        <Card>
          <CardBody>
            <Header>
              {name}
              {/* {walletOwnsNft && (
              <Tag outline variant="secondary">
                {t('Chosen')}
              </Tag>
            )} */}
              {/* {profile?.nft?.characterId === characterId && (
              <Tag outline variant="success">
                {t('Active')}
              </Tag>
            )} */}
            </Header>
            <InfoBlock>
              <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
                {description}
              </Text>
            </InfoBlock>
            {canClaim && (
              <Button width="100%" mt="24px" onClick={onPresentClaimModal}>
                {t('Claim')}
              </Button>
            )}
            {walletOwnsNft && (
              <Button
                width="100%"
                variant="secondary"
                mt="24px"
                onClick={onPresentTransferModal}
                style={{ fontSize: '13px' }}
              >
                {t('Transfer')}
              </Button>
            )}
            {canMint && (
              <Button
                width="100%"
                variant="secondary"
                mt="24px"
                onClick={onPresentCreateModal}
                style={{ fontSize: '14px' }}
              >
                {t('Create')}
              </Button>
            )}
            {walletOwnsNft && (
              <Button
                width="100%"
                variant="secondary"
                mt="24px"
                onClick={() => {
                  onEditProfileModal()
                }}
                style={{ fontSize: '14px' }}
              >
                {t('Activate')}
              </Button>
            )}
          </CardBody>
          {/* <CardFooter p="0">
          <DetailsButton width="100%" endIcon={<Icon width="24px" color="primary" />} onClick={handleClick}>
            {t('Details')}
          </DetailsButton>
          {isOpen && (
            <InfoBlock>
              <Text as="p" color="textSubtle" style={{ textAlign: 'center' }}>
                {description}
              </Text>
            </InfoBlock>
          )}
        </CardFooter> */}
        </Card>
      ) : null}
    </div>
  )
}

export default NftCard
