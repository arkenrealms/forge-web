import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Text } from '~/ui'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import { getFullDisplayBalance } from '~/utils/formatBalance'
import { getArcaneProfileAddress } from '~/utils/addressHelpers'
import { useRxs } from '~/hooks/useContract'
import useI18n from '~/hooks/useI18n'
import useWeb3 from '~/hooks/useWeb3'
import { useTranslation } from 'react-i18next'
import { useProfile } from '~/state/hooks'
import useGetProfileCosts from '~/views/account/hooks/useGetProfileCosts'
import useHasRuneBalance from '~/hooks/useHasRuneBalance'
import { UseEditProfileResponse } from './reducer'
import ProfileAvatar from '../ProfileAvatar'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary' })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const StartPage: React.FC<StartPageProps> = ({ goToApprove, goToChange, goToRemove, onDismiss }) => {
  const [needsApproval, setNeedsApproval] = useState(null)
  const { profile } = useProfile()
  const { numberRuneToUpdate, numberRuneToReactivate } = useGetProfileCosts()
  const hasMinimumRuneRequired = useHasRuneBalance(profile?.isActive ? numberRuneToUpdate : numberRuneToReactivate)
  const { t } = useTranslation()
  const { address: account } = useWeb3()
  const runeContract = useRxs()
  const cost = profile?.isActive ? numberRuneToUpdate : numberRuneToReactivate

  /**
   * Check if the wallet has the required RUNE allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const response = await runeContract.methods.allowance(account, getArcaneProfileAddress()).call()
      const currentAllowance = new BigNumber(response)
      setNeedsApproval(currentAllowance.lt(cost))
    }

    if (account) {
      checkApprovalStatus()
    }
  }, [account, cost, setNeedsApproval, runeContract])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <ProfileAvatar profile={profile} />
      <Flex alignItems="center" style={{ height: '48px' }} justifyContent="center">
        <Text as="p" color="failure">
          {!hasMinimumRuneRequired && t(`${getFullDisplayBalance(numberRuneToUpdate)} RXS required to change guild`)}
        </Text>
      </Flex>
      {profile.isActive ? (
        <>
          <Button
            width="100%"
            mb="8px"
            onClick={needsApproval === true ? goToApprove : goToChange}
            disabled={!hasMinimumRuneRequired || needsApproval === null}>
            {t('Change Active Character')}
          </Button>
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Pause Guild Membership')}
          </DangerOutline>
        </>
      ) : (
        <Button
          width="100%"
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={!hasMinimumRuneRequired || needsApproval === null}>
          {t('Reactivate Guild Membership')}
        </Button>
      )}
      <Button variant="text" width="100%" onClick={onDismiss}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default StartPage
