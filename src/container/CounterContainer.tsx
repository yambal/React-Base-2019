import React from 'react';
import { connect } from 'react-redux'
import counterModule from '../modules/counterModule'
import { iCounterState } from '../modules/counterModule'
import { iRootState } from '../redux/RootState'
import Counter from '../components/organisms/Counter';

interface iCounter{
  counter: iCounterState
  addToCount: (add:number) => void
}

const CounterContainer:React.FC<iCounter> = (props:iCounter) => {
  const { addToCount, counter } = props

  const handleAdd = () => {
    addToCount(1)
  }

  const handleSubtract = () => {
    addToCount(-1)
  }

  return (
    <Counter
      count={counter.count}
      isBusy={counter.isBusy}
      handleAdd={handleAdd}
      handleSubtract={handleSubtract}
    />
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

export default connect(mapStateToProps, mapDispatchToProps)(CounterContainer)