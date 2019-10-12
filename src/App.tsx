import React from 'react';

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
  const { message } = props.test

  return (
    <Test>{message}</Test>
  );
}

const mapStateToProps = (state:iRootState) => {
  return {
    test: state.test
  }
}

export default connect(mapStateToProps)(App)