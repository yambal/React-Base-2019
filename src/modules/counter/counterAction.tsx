import { COUNTER_ACTIONS } from './counterReducer'

export interface iAddToCountAction {
  type: string
  add: number
}

const addToCountAction = (add: number):iAddToCountAction => {
  return {
    type: COUNTER_ACTIONS.SET_MESSAGE,
    add,
  };
}

// Async Action creator
const addToCount = (add: number) => {
  return (dispatch:any) => {
    setTimeout(() => {
      dispatch(addToCountAction(add));
    }, 1000);
  };
}

export default addToCount