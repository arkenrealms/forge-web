import React from 'react'
import useSettings from '~/hooks/useSettings'
import { Modal, useModal, InjectedModalProps } from '~/components/Modal'
import ConnectModal from '~/components/WalletModal/ConnectModal'
import AccountModal from '~/components/WalletModal/AccountModal'
import Button from '../../Button/Button'
import { Login } from '../../WalletModal/types'

interface Props {
  username?: string
  account?: string
  login: Login
  logout: () => void
}

const UserBlock: React.FC<Props> = ({ username, account, login, logout }) => {
  const [onPresentConnectModal] = useModal(<ConnectModal login={login} />)
  const [onPresentAccountModal] = useModal(<AccountModal account={account || ''} logout={logout} />)
  const settings = useSettings()

  // @ts-ignore
  const isFlame = window.ethereum && window.ethereum.isFlame

  if (isFlame) return <></>

  const accountEllipsis = username
    ? username
    : account
    ? `${account.substring(0, 2)}...${account.substring(account.length - 4)}`
    : null
  // console.log(9999, username)
  return (
    <div>
      {account ? (
        <Button
          scale="sm"
          variant="tertiary"
          onClick={() => {
            onPresentAccountModal()
          }}
        >
          {accountEllipsis}
        </Button>
      ) : settings.isCrypto ? (
        <Button
          scale="sm"
          onClick={() => {
            onPresentConnectModal()
          }}
        >
          Connect
        </Button>
      ) : (
        <Button
          scale="sm"
          onClick={() => {
            // onPresentLoginModal()
          }}
        >
          Login
        </Button>
      )}
    </div>
  )
}

export default React.memo(UserBlock, (prevProps, nextProps) => prevProps.account === nextProps.account)
