import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
// import { routerMiddleware } from 'connected-react-router'
//import { createBrowserHistory } from 'history'
import reducers from './reducers'

import { iRootState } from './RootState'
import { initialState } from '../redux/RootState'

const enhancers:any[] = []
//export const history = createBrowserHistory()

/** middle ware */
const middlewares = [
  //routerMiddleware(history),
  reduxThunk
]

const composedEnhancers = compose(
  applyMiddleware(...middlewares),
  ...enhancers
)

const store = createStore<iRootState, any, any, any>(
  reducers,
  initialState,
  composedEnhancers
)
  
export default store