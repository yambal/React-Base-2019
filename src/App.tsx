import React from 'react';
// import styled from 'styled-components'
import { RouterState } from 'connected-react-router';

/** Redux Store */
import { connect } from 'react-redux'
import { iRootState } from './redux/RootState'
import { iConfigState } from './modules/configModule'

import P2pContainer from './container/P2pContainer'

/** Modules */
import routerModules from './modules/routerModules'
/*
const Test = styled.div`
  color: ${'red'};
`
*/
interface iApp{
  router?: RouterState
  config: iConfigState
  pushTo: (path:string) => void
  back: () => void
  forward: () => void
}

const App: React.FC<iApp> = props => {
  const { router, config, forward, back } = props

  return (
    <React.Fragment>
      <P2pContainer />
    </React.Fragment>
  );
}

const mapStateToProps = (state:iRootState) => {
  return {
    config: state.config,
    router: state.router,
    count: state.counter
  }
}

const mapDispatchToProps = {
  pushTo: routerModules.actionCreators.routerPush,
  back: routerModules.actionCreators.routerBack,
  forward: routerModules.actionCreators.routerForward
}

export default connect(mapStateToProps, mapDispatchToProps)(App)