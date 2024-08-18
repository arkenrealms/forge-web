import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import useWeb3 from '~/hooks/useWeb3'

const initialState = {
  profileLink: 'https://arken.gg/profile',
  noProfileLink: 'https://arken.gg/profile',
}

/**
 * Note - this will only work if the app is on the same domain
 */
const useGetLocalProfile = () => {
  const [profile, setProfile] = useState(initialState)
  const { account } = useWeb3()

  useEffect(() => {
    if (account) {
      try {
        const localData = Cookies.get(`profile_${account}`)

        if (localData) {
          const localProfile = JSON.parse(localData)

          setProfile((prevProfile) => ({
            ...prevProfile,
            username: localProfile.username,
            image: localProfile.avatar,
          }))
        }
      } catch (error) {
        setProfile(initialState)
      }
    } else {
      setProfile(initialState)
    }
  }, [account, setProfile])

  return profile
}

export default useGetLocalProfile
