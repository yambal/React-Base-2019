import React from 'react';
import { connect } from 'react-redux'
import counterModule from '../modules/counterModule'
import { iCounterState } from '../modules/counterModule'
import { iRootState } from '../redux/RootState'

interface iCounter{
  counter: iCounterState
  addToCount: (add:number) => void
}

const Counter:React.FC<iCounter> = (props:iCounter) => {
  const { addToCount, counter } = props

  return (
    <div>
      <div>{counter.count}</div>
      <button onClick={() => addToCount(1)}>+</button>
      <button onClick={() => addToCount(-1)}>-</button>
    </div>
  )
}

const mapStateToProps = (state:iRootState) => {
  return {
    counter: state.counter
  }
}

const mapDispatchToProps = {
  addToCount: counterModule.actionCreators.add,
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)