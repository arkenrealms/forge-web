import React, { useContext } from 'react'
import useWeb3 from '~/hooks/useWeb3'
import NoWalletConnected from '~/components/account/WalletNotConnected'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'
import Mint from './Mint'
import ProfilePicture from './ProfilePicture'
import TeamSelection from './TeamSelection'
import UserName from './UserName'

const Steps = () => {
  const { isInitialized, currentStep } = useContext(ProfileCreationContext)
  const { address: account } = useWeb3()

  if (!account) {
    return <NoWalletConnected />
  }

  if (!isInitialized) {
    return <div>Loading...</div>
  }

  if (currentStep === 0) {
    return <Mint />
  }

  if (currentStep === 1) {
    return <TeamSelection />
  }

  if (currentStep === 2) {
    return <UserName />
  }

  if (currentStep === 3) {
    return <UserName />
  }

  return null
}

export default Steps
