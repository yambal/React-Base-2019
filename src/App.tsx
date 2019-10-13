import React from 'react';
import { Link, Route, Switch } from 'react-router-dom'

/** Redux Store */
import { connect } from 'react-redux'
import { iRootState } from './redux/RootState'
import { iTestState } from './modules/testState'

import styled from 'styled-components'
const Test = styled.div`
  color: ${'red'};
`

interface iApp{
  test: iTestState
}

const App: React.FC<iApp> = props => {
  const { test: { message, config:{ nodeEnv, testMessage }} } = props

  return (
    <React.Fragment>
      <Test>{message}, {nodeEnv}, {testMessage}</Test>
      <Link to="/test">Test</Link>
      <Switch>
        <Route path="/test" render={() => (
          <Link to="/">back</Link>
        )}/>
      </Switch>
    </React.Fragment>
  );
}

const mapStateToProps = (state:iRootState) => {
  console.log(state)
  return {
    test: state.test
  }
}

export default connect(mapStateToProps)(App)