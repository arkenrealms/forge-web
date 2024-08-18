import React, { useState } from 'react'
import { ethers } from 'ethers'
import { AutoRenewIcon, Button, Flex, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useRxs } from '~/hooks/useContract'
import { useProfile, useToast } from '~/state/hooks'
import useWeb3 from '~/hooks/useWeb3'
import { getArcaneProfileAddress } from '~/utils/addressHelpers'
import { getFullDisplayBalance } from '~/utils/formatBalance'
import useGetProfileCosts from '~/views/account/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveRunePageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveRunePage: React.FC<ApproveRunePageProps> = ({ goToChange, onDismiss }) => {
  const [isApproving, setIsApproving] = useState(false)
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const { numberRuneToUpdate, numberRuneToReactivate } = useGetProfileCosts()
  const runeContract = useRxs()
  const { toastError } = useToast()
  const cost = profile.isActive ? numberRuneToUpdate : numberRuneToReactivate

  const handleApprove = () => {
    runeContract.methods
      .approve(getArcaneProfileAddress(), ethers.constants.MaxUint256) //cost.times(2).toJSON())
      .send({ from: account })
      .on('sending', () => {
        setIsApproving(true)
      })
      .on('receipt', () => {
        goToChange()
      })
      .on('error', (error) => {
        toastError('Error', error?.message)
        setIsApproving(false)
      })
  }

  if (!profile) {
    return null
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to rejoin:')}</Text>
        <Text>{t(`${getFullDisplayBalance(cost)} RXS`)}</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}>
        {t('Approve')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveRunePage
