import { combineReducers } from 'redux'

import { iRootState } from './RootState'

import testReducer from '../modules/testReducer'

const reducers = combineReducers<iRootState>({
  test: testReducer
})

export default reducers
