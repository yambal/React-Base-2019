import counterModule, { iCounterState } from '../modules/counterModule'
import configModule, { iConfigState } from '../modules/configModule'
import p2pModule, { iP2PState } from '../modules/p2pModule'
import { RouterState } from 'connected-react-router'

export interface iRootState {
    router?: RouterState
    config: iConfigState
    counter: iCounterState
    p2p: iP2PState
}

export default iRootState


export const initialState: iRootState = {
    config : configModule.initial,
    counter : counterModule.initial,
    p2p: p2pModule.initialP2PState
}