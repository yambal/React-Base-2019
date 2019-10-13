import { iCounterState, defaultCounterState } from '../modules/counter/counterState'
// import { RouterState } from 'connected-react-router'

export interface iRootState {
    // router?: RouterState
    counter: iCounterState
}

export default iRootState


export const initialState: iRootState = {
    counter : defaultCounterState
}