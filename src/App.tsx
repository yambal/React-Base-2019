import React from 'react';
// import styled from 'styled-components'
import { RouterState } from 'connected-react-router';
import { Link, Route, Switch } from 'react-router-dom'

/** Redux Store */
import { connect } from 'react-redux'
import { iRootState } from './redux/RootState'
import { iConfigState } from './modules/configModule'

import Counter from './container/Counter'
import PdfMaker from './container/PdfMaker'

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
      <div>
        <h3>router</h3>
        <pre>{JSON.stringify(router, null, 2)}</pre>
        <Link to="/test1">Test 1</Link>
        <div onClick={forward}>forward</div>
        <Switch>
          <Route path="/test1" render={() => (
            <div>
              <h4>test 1</h4>
              <Link to="/">home</Link>
              <div onClick={back}>back</div>
            </div>
          )}/>
        </Switch>
      </div>
      <div>
        <h3>dotenv</h3>
        <div>node env: {config.nodeEnv}</div>
        <div>test: {config.testString}</div>
      </div>
      <Counter />
      <PdfMaker />
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