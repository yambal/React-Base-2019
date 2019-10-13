const dotenv = require('dotenv')
dotenv.config({ debug: true })

export interface iConfigState {
    nodeEnv?: string
    testString?: string
}

export const initial:iConfigState = {
    nodeEnv: process.env.NODE_ENV,
    testString: process.env.REACT_APP_TEST_STRING
}

/**
 * Reducer
 */
const reducer = (state: iConfigState = initial, action: any) => {
    switch (action.type) {
        default: return state
    }
}


const configModule = {
    initial,
    reducer
}

export default configModule

