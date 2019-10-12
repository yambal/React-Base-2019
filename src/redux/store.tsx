import { createStore, applyMiddleware, compose } from 'redux'
import reduxThunk from 'redux-thunk'
import reducers from './reducers'

import { iRootState } from './RootState'
import { initialState } from '../redux/RootState'
// import { routerMiddleware } from 'connected-react-router'
// import { createBrowserHistory } from 'history'
import CONFIG from '../config/config'

/** enhancer */
const enhancers:any[] = []

/** Redux Dev Tool */
if(CONFIG.nodeEnv !== 'development' && (window as any).__REDUX_DEVTOOLS_EXTENSION__){
  enhancers.push((window as any).__REDUX_DEVTOOLS_EXTENSION__())
}


// export const history = createBrowserHistory()

/** middle ware */
const middlewares = [
  // routerMiddleware(history),
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