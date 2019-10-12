import { iTestState, defaultState as defaultTestState } from '../modules/testState'
// import { RouterState } from 'connected-react-router'

export interface iRootState {
    // router?: RouterState
    test: iTestState
}

export default iRootState


export const initialState: iRootState = {
    test : defaultTestState
}