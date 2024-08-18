/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import farmsConfig from 'rune-backend-sdk/build/farmInfo'
import fetchFarms from './fetchFarms'
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
  fetchPreviousFarmUserEarnings,
} from './fetchFarmUser'
import { FarmsState, Farm } from '../types'

const initialState: FarmsState = { data: [...farmsConfig] }

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      const liveFarmsData: Farm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.chefKey === farm.chefKey && f.pid === farm.pid)
        return { ...farm, ...liveFarmData }
      })
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload
      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { index } = userDataEl
        state.data[index] = { ...state.data[index], userData: userDataEl }
      })
    },
  },
})

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions

// Thunks
export const fetchFarmsPublicDataAsync = (chefKey: string) => async (dispatch) => {
  const farms = await fetchFarms(chefKey)
  dispatch(setFarmsPublicData(farms))
}
export const fetchFarmUserDataAsync = (account, chefKey) => async (dispatch) => {
  const userFarmAllowances = await fetchFarmUserAllowances(account, chefKey)
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(account, chefKey)
  const userStakedBalances = await fetchFarmUserStakedBalances(account, chefKey)
  const userFarmEarnings = await fetchFarmUserEarnings(account, chefKey)
  const userPreviousFarmEarnings = await fetchPreviousFarmUserEarnings(account, chefKey)

  const arrayOfUserDataObjects = userFarmAllowances.map((farmAllowance, index) => {
    return {
      index,
      allowance: userFarmAllowances[index],
      tokenBalance: userFarmTokenBalances[index],
      stakedBalance: userStakedBalances[index],
      earnings: userFarmEarnings[index],
      previousEarnings: userPreviousFarmEarnings[index],
    }
  })

  // console.log(66666, arrayOfUserDataObjects)

  dispatch(setFarmUserData({ arrayOfUserDataObjects }))
}

export default farmsSlice.reducer
