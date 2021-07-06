import React from 'react';
import styled from 'styled-components';
import ButtonPrimary from '../atoms/ButtonPrimary';

const Wrapper = styled.div``

interface iCounterProps {
  count: number
  isBusy: boolean
  handleAdd: () => void
  handleSubtract: () => void
}

const Counter:React.FC<iCounterProps> = props => {
  return (
    <Wrapper>
      {props.count}
      <ButtonPrimary
        onClick={props.handleAdd}
        disabled={props.isBusy}
      >+</ButtonPrimary>
    </Wrapper>
  )
}

export default Counter