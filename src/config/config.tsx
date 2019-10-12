const dotenv = require('dotenv')
dotenv.config({ debug: true })

export interface iConfig {
    nodeEnv?: string
    testMessage?: string
}

const CONGIG:iConfig = {
    nodeEnv: process.env.NODE_ENV,
    testMessage: process.env.REACT_APP_TEST_MESSAGE
}

export default CONGIG