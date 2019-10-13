import { combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { connectRouter } from 'connected-react-router'
import counterModule from '../modules/counterModule'
import configModule from '../modules/configModule'

const reducers = (history: History) => combineReducers<Reducer>({
  router: connectRouter(history),
  config: configModule.reducer,
  counter: counterModule.reducer
})

export default reducers

