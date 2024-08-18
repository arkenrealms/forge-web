import React, { useState } from 'react'
import { AutoRenewIcon, Button, Checkbox, Flex, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useProfile, useToast } from '~/state/hooks'
import { fetchProfile } from '~/state/profiles'
import useWeb3 from '~/hooks/useWeb3'
import useGetProfileCosts from '~/views/account/hooks/useGetProfileCosts'
import { getBalanceNumber } from '~/utils/formatBalance'
import { useProfile as useProfileContract } from '~/hooks/useContract'

type PauseProfilePageProps = InjectedModalProps

const PauseProfilePage: React.FC<PauseProfilePageProps> = ({ onDismiss }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const { profile } = useProfile()
  const { numberRuneToReactivate } = useGetProfileCosts()
  const { t } = useTranslation()
  const arcaneProfileContract = useProfileContract()
  const { address: account } = useWeb3()
  const { toastSuccess, toastError } = useToast()
  const dispatch = useDispatch()

  const handleChange = () => setIsAcknowledged(!isAcknowledged)

  const handleDeactivateProfile = () => {
    arcaneProfileContract.methods
      .pauseProfile()
      .send({ from: account })
      .on('sending', () => {
        setIsConfirming(true)
      })
      .on('receipt', async () => {
        // Re-fetch profile
        await dispatch(fetchProfile(account))
        toastSuccess('You left the guild!')

        onDismiss()
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsConfirming(false)
      })
  }

  if (!profile) {
    return null
  }

  return (
    <>
      <Text as="p" color="failure" mb="24px">
        {t(
          'This will pause your guild membership, and bring your character back into your wallet. Your guild membership is linked to this wallet, not the character, so your character will not be in the guild but you will be able to re-join with any character from this wallet later.'
        )}
      </Text>
      {/* <Text as="p" color="textSubtle" mb="24px">
        {t(
          "While your profile is paused, you won't be able to earn points, but your achievements and points will stay associated with your profile",
        )}
      </Text> */}
      <Text as="p" color="textSubtle" mb="24px">
        {t(`Cost to rejoin: ${getBalanceNumber(numberRuneToReactivate)} RXS`)}
      </Text>
      <label
        htmlFor="acknowledgement"
        style={{ cursor: 'url("/images/cursor3.png"), pointer', display: 'block', marginBottom: '24px' }}>
        <Flex alignItems="center">
          <Checkbox id="acknowledgement" checked={isAcknowledged} onChange={handleChange} scale="sm" />
          <Text ml="8px">{t('I understand')}</Text>
        </Flex>
      </label>
      <Button
        width="100%"
        isLoading={isConfirming}
        endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
        disabled={!isAcknowledged || isConfirming}
        onClick={handleDeactivateProfile}
        mb="8px">
        {t('Confirm')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </>
  )
}

export default PauseProfilePage
