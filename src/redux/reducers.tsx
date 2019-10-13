import { combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { connectRouter } from 'connected-react-router'
import counterReducer from '../modules/counter/counterReducer'


const reducers = (history: History) => combineReducers<Reducer>({
  router: connectRouter(history),
  counter: counterReducer
})

export default reducers

