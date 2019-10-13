import { combineReducers, Reducer } from 'redux'
import { History } from 'history'
import { connectRouter } from 'connected-react-router'
import testReducer from '../modules/testReducer'


const reducers = (history: History) => combineReducers<Reducer>({
  router: connectRouter(history),
  test: testReducer
})

export default reducers

