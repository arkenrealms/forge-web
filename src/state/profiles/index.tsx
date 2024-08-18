/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ProfilesState, ProfileState, Profile } from '~/state/types'
import getProfile, { GetProfileResponse } from './getProfile'

const initialState: ProfilesState = {
  defaultProfile: {
    hasRegistered: false,
    isInitialized: false,
    isLoading: false,
    address: null,
    data: {} as Profile,
  },
  list: [],
}
// isInitialized: false,
// isLoading: true,
// data: null,

export const profileSlice = createSlice({
  name: 'profiles',
  initialState,
  reducers: {
    profileFetchStart: (state) => {
      // state.isLoading = true
    },
    profileFetchSucceeded: (state, action: PayloadAction<GetProfileResponse>) => {
      const { profile, hasRegistered, address } = action.payload

      // console.log('bbbb', action, [...state.list])
      const pp = state.list.find((p) => p.address === address)

      if (pp) {
        // console.log('Using profile', pp, address, state.list)
        for (const key of Object.keys(profile)) {
          pp.address = profile.address
          pp.isInitialized = true
          pp.isLoading = false
          pp.data[key] = profile[key]
        }
      } else {
        state.list.push({
          hasRegistered,
          isInitialized: true,
          isLoading: false,
          address,
          data: profile || initialState.defaultProfile,
        } as ProfileState)
      }

      // console.log('bbbb2', action, [...state.list])
      return state
    },
    profileFetchFailed: (state) => {
      // state.isLoading = false
      // state.isInitialized = true
    },
    addPoints: (state, action: PayloadAction<number>) => {
      // state.data.points += action.payload
    },
  },
})

// Actions
export const { profileFetchStart, profileFetchSucceeded, profileFetchFailed, addPoints } = profileSlice.actions

// Thunks
export const fetchProfile = (address: string) => async (dispatch) => {
  console.log('Fetching profile for', address)
  try {
    dispatch(profileFetchStart())
    const response = await getProfile(address)
    dispatch(profileFetchSucceeded(response))
  } catch (error) {
    dispatch(profileFetchFailed())
  }
}

export default profileSlice.reducer
