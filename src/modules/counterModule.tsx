/**
 * interfaces
 */
export interface iCounterState {
  count: number
  isBusy: boolean
}

export interface iAddToCountAction {
  type: string
  add: number
}

/**
 * State
 */
const initial:iCounterState = {
  count: 0,
  isBusy: false
}

/**
 * Action Constructor
 */
const COUNTER_ACTIONS = {
  SET_MESSAGE : 'COUNTER_ACTIONS_SET_MESSAGE',
  GOT_BUSY: 'COUNTER_ACTIONS_GOT_BUSY',
  GOT_FREE: 'COUNTER_ACTIONS_GOT_FREE'
}

/**
 * Reducer
 */
const reducer = (state: iCounterState = initial, action: iAddToCountAction) => {
  switch (action.type) {
    case COUNTER_ACTIONS.SET_MESSAGE:
      return Object.assign({}, state, {count: state.count + action.add})
    case COUNTER_ACTIONS.GOT_BUSY:
      return Object.assign({}, state, {isBusy: true})
    case COUNTER_ACTIONS.GOT_FREE:
        return Object.assign({}, state, {isBusy: false})
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

const isBudy = (flag: boolean) => {
  if (flag) {
    return {
      type: COUNTER_ACTIONS.GOT_BUSY
    };
  } else {
    return {
      type: COUNTER_ACTIONS.GOT_FREE
    };
  }
}

/**
 * Action creator
 */
const add = (add: number) => {
  return (dispatch:any) => {
    dispatch(isBudy(true));
    setTimeout(() => {
      dispatch(addAction(add));
      dispatch(isBudy(false));
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
