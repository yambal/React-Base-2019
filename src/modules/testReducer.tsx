import { iTestState, defaultState } from './testState'

export default function testReducer(state: iTestState = defaultState, action: any) {
    switch (action.type) {
        default: return state
    }
}