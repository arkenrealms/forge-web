import React from 'react'
import { Button, ButtonProps } from '~/ui'
import useI18n from '~/hooks/useI18n'
import useAuth from '~/hooks/useAuth'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import ConnectModal from '~/components/WalletModal/ConnectModal'
import AccountModal from '~/components/WalletModal/AccountModal'

const UnlockButton: React.FC<ButtonProps> = (props) => {
  const TranslateString = useI18n()
  const { login, logout } = useAuth()
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />)

  return (
    <Button onClick={onPresentConnectModal} {...props}>
      {TranslateString(292, 'Unlock Wallet')}
    </Button>
  )
}

export default UnlockButton
