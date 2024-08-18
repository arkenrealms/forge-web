import React, { useState } from 'react'
import { CURRENT_FARM_SYMBOL } from '~/config'

const CACHE_KEY = 'CHEF'

const MasterchefContext = React.createContext({ chefKey: CURRENT_FARM_SYMBOL, setChefKey: (key: string) => null })

const MasterchefContextProvider = ({ children }) => {
  const [chefKey, _setChefKey] = useState(() => {
    if (!window.localStorage) return CURRENT_FARM_SYMBOL

    const chefKeyUserSetting = CURRENT_FARM_SYMBOL //window.localStorage.getItem(CACHE_KEY)
    return chefKeyUserSetting || CURRENT_FARM_SYMBOL
  })

  const setChefKey = (key) => {
    _setChefKey(() => {
      // window.localStorage.setItem(CACHE_KEY, key)
      return key
    })
  }

  return <MasterchefContext.Provider value={{ chefKey, setChefKey }}>{children}</MasterchefContext.Provider>
}

export { MasterchefContext, MasterchefContextProvider }
