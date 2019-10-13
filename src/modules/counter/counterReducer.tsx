import { iCounterState, defaultCounterState } from './counterState'
import { iAddToCountAction } from './counterAction'

export const COUNTER_ACTIONS = {
    SET_MESSAGE : 'COUNTER_ACTIONS_SET_MESSAGE'
}

export default function counterReducer(state: iCounterState = defaultCounterState, action: iAddToCountAction) {
    switch (action.type) {
        case COUNTER_ACTIONS.SET_MESSAGE:
            return Object.assign({}, state, {count: state.count + action.add})
        default: return state
    }
}