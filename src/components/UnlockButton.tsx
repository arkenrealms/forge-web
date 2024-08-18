import React from 'react'
import { Button } from '~/ui'
import ConnectModal from '~/components/WalletModal/ConnectModal'
import AccountModal from '~/components/WalletModal/AccountModal'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import useAuth from '~/hooks/useAuth'
import useI18n from '~/hooks/useI18n'
import { useTranslation } from 'react-i18next'

const UnlockButton = (props) => {
  const { t } = useTranslation()
  const { login, logout } = useAuth()
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {t('Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
