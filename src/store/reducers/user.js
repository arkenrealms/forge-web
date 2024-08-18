/* eslint-disable no-case-declarations */
import {
  FOLLOW_COIN,
  UNFOLLOW_COIN,
  SET_THEME,
  SET_BACKGROUND,
  SET_CUSTOM_BACKGROUND,
  TOGGLE_VINTAGE_FONT,
  SET_FONT_SIZE,
  SET_EVENT_SEEN,
  SET_USER_HOLDINGS,
  DELETE_USER_HOLDINGS,
  SORT_USER_HOLDINGS,
  SET_USER_CURRENCY,
  TOGGLE_SCAN_LINES,
  SET_SCAN_LINES_INTENSITY,
  TOGGLE_MATRIX,
  TOGGLE_DISTORTION,
  SET_DISTORTION_INTENSITY,
} from '../actions/actionTypes'

import { saveState, loadState } from '../localStorage'
import Matrix6 from '../../assets/images/backgrounds/Matrix6.gif'

const LOCAL_STORAGE_KEY = 'user'
const persistedState = loadState(LOCAL_STORAGE_KEY) || {}

export const backgrounds = [
  { value: '#000', label: '(Custom)' },
  { value: `url(${Matrix6})`, label: 'Matrix #6', repeat: true, opacity: 0.3 },
]

const themeTest = false //Math.floor(Math.random() * 100) > 80;

const initialState = {
  followed: [],
  wallet: {},
  seenEvents: [],
  currency: 'USD',
  vintageFont: false,
  theme: themeTest ? 'original' : 'original',
  backgrounds,
  background: themeTest ? backgrounds[8] : backgrounds[14],
  fontSize: 0.9,
  scanLines: themeTest ? false : false,
  // scanLinesIntensity in %
  scanLinesIntensity: 20,
  distortion: false,
  distortionIntensity: 30,
  matrix: themeTest ? false : false,
  ...persistedState,
}

const userReducer = (state = initialState, action) => {
  let followed
  const newState = (function () {
    switch (action.type) {
      case FOLLOW_COIN:
        followed = [...new Set([...state.followed, action.payload])]
        return { ...state, followed }
      case UNFOLLOW_COIN:
        followed = state.followed.filter((userCoin) => userCoin !== action.payload)
        return { ...state, followed }
      case SET_THEME:
        return { ...state, theme: action.payload }
      case SET_BACKGROUND:
        return { ...state, background: action.payload }
      case SET_CUSTOM_BACKGROUND:
        const [custom, ...rest] = state.backgrounds
        const customBackground = { ...custom, value: action.payload }
        const newBackgrounds = [customBackground, ...rest]
        return {
          ...state,
          backgrounds: newBackgrounds,
          background: customBackground,
        }
      case TOGGLE_VINTAGE_FONT:
        return { ...state, vintageFont: action.payload }
      case SET_FONT_SIZE:
        return { ...state, fontSize: action.payload }
      case TOGGLE_SCAN_LINES:
        return { ...state, scanLines: action.payload }
      case SET_SCAN_LINES_INTENSITY:
        return { ...state, scanLinesIntensity: action.payload }
      case TOGGLE_MATRIX:
        return { ...state, matrix: action.payload }
      case TOGGLE_DISTORTION:
        return { ...state, distortion: action.payload }
      case SET_DISTORTION_INTENSITY:
        return { ...state, distortionIntensity: action.payload }
      case SET_EVENT_SEEN:
        const eventId = action.payload
        const seenEvents = [...state.seenEvents, eventId]
        return { ...state, seenEvents }
      case SET_USER_HOLDINGS:
        const { amount, coin } = action.payload
        const wallet = { ...state.wallet }
        const order = wallet[coin] ? wallet[coin].order : wallet.length
        wallet[coin] = { symbol: coin, amount, order }
        return { ...state, wallet }
      case DELETE_USER_HOLDINGS: {
        const wallet2 = { ...state.wallet }
        wallet2[action.payload] && delete wallet2[action.payload]
        return { ...state, wallet: wallet2 }
      }
      case SORT_USER_HOLDINGS: {
        const wallet2 = {}
        action.payload.forEach((coin2) => {
          wallet2[coin2] = state.wallet[coin2]
        })
        return { ...state, wallet: wallet2 }
      }
      case SET_USER_CURRENCY:
        return { ...state, currency: action.payload }
      default:
        return state
    }
  })()
  saveState(LOCAL_STORAGE_KEY, newState)
  return { ...newState, backgrounds }
}

export default userReducer
