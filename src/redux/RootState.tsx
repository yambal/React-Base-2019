import { iTestState, defaultState as defaultTestState } from '../modules/testState'

export interface iRootState {
    test: iTestState
}

export const initialState: iRootState = {
    test : defaultTestState
}