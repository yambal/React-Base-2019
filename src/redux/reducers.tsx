// import { History } from 'history'
import { combineReducers } from 'redux'
// import { connectRouter } from 'connected-react-router'

import { iRootState } from './RootState'

import testReducer from '../modules/testReducer'

export default combineReducers<iRootState>({
    test: testReducer
})
