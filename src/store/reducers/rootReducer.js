import { combineReducers } from 'redux'

import coinsReducer from './coins'
import userReducer from './user'
import newsReducer from './news'
import eventsReducer from './events'
import transactionsReducer from './transactions'

const rootReducer = combineReducers({
  coins: coinsReducer,
  user: userReducer,
  news: newsReducer,
  events: eventsReducer,
  transactions: transactionsReducer,
})

export default rootReducer
