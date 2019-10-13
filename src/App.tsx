import React from 'react';
import { Link, Route, Switch } from 'react-router-dom'

/** Redux Store */
import { connect } from 'react-redux'
import { iRootState } from './redux/RootState'
import { iCounterState } from './modules/counter/counterState'

import addToCount from './modules/counter/counterAction'

import styled from 'styled-components'
const Test = styled.div`
  color: ${'red'};
`

interface iApp{
  count: iCounterState
  addToCount: any
}

const App: React.FC<iApp> = props => {
  const { count, addToCount } = props

  return (
    <React.Fragment>
      <Test>{count.count}</Test>
      <Link to="/test">Test</Link>
      <Switch>
        <Route path="/test" render={() => (
          <Link to="/">back</Link>
        )}/>
      </Switch>
      <div onClick={() => {addToCount(1)}}>test</div>
    </React.Fragment>
  );
}

const mapStateToProps = (state:iRootState) => {
  console.log(state)
  return {
    count: state.counter
  }
}

const mapDispatchToProps = { // あえて関数ではなくオブジェクトにしておきます。
  addToCount
}

export default connect(mapStateToProps, mapDispatchToProps)(App)