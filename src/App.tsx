import React from 'react';
import styled from 'styled-components'
import { RouterState } from 'connected-react-router';
import { Link, Route, Switch } from 'react-router-dom'

/** Redux Store */
import { connect } from 'react-redux'
import { iRootState } from './redux/RootState'
import { iCounterState } from './modules/counterModule'
import { iConfigState } from './modules/configModule'

/** Modules */
import counterModule from './modules/counterModule'
import routerModules from './modules/routerModules'

const Test = styled.div`
  color: ${'red'};
`

interface iApp{
  router?: RouterState
  config: iConfigState
  count: iCounterState
  addToCount: (add:number) => void
  pushTo: (path:string) => void
  back: () => void
  forward: () => void
}

const App: React.FC<iApp> = props => {
  const { router, config, count, addToCount, forward, back } = props

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
      <div>
        <h3>redux</h3>
        <Test>{count.count}</Test>
        <button type="button" onClick={() => {addToCount(1)}}>test</button>
      </div>
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
  addToCount: counterModule.actionCreators.add,
  pushTo: routerModules.actionCreators.routerPush,
  back: routerModules.actionCreators.routerBack,
  forward: routerModules.actionCreators.routerForward
}

export default connect(mapStateToProps, mapDispatchToProps)(App)