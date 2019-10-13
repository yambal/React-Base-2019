import counterModule, { iCounterState } from '../modules/counterModule'
import configModule, { iConfigState } from '../modules/configModule'
import { RouterState } from 'connected-react-router'

export interface iRootState {
    router?: RouterState
    config: iConfigState
    counter: iCounterState
}

export default iRootState


export const initialState: iRootState = {
    config : configModule.initial,
    counter : counterModule.initial
}