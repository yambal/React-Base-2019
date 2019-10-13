/**
 * interfaces
 */
export interface iCounterState {
  count: number
}

export interface iAddToCountAction {
  type: string
  add: number
}

/**
 * State
 */
const initial:iCounterState = {
  count : 0
}

/**
 * Action Constructor
 */
const COUNTER_ACTIONS = {
  SET_MESSAGE : 'COUNTER_ACTIONS_SET_MESSAGE'
}

/**
 * Reducer
 */
const reducer = (state: iCounterState = initial, action: iAddToCountAction) => {
    switch (action.type) {
        case COUNTER_ACTIONS.SET_MESSAGE:
            return Object.assign({}, state, {count: state.count + action.add})
        default: return state
    }
}

/**
 * Actions
 */
const addAction = (add: number):iAddToCountAction => {
  return {
    type: COUNTER_ACTIONS.SET_MESSAGE,
    add,
  };
}

/**
 * Action creator
 */
const add = (add: number) => {
  return (dispatch:any) => {
    setTimeout(() => {
      dispatch(addAction(add));
    }, 1000);
  };
}

const counterModule = {
  initial,
  reducer,
  actionCreators: {
    add
  }
}

export default counterModule
