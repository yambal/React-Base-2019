import CONFIG, { iConfig } from '../config/config'

export interface iTestState {
  config: iConfig
  message:string
}

export const defaultState:iTestState = {
  config: CONFIG,
  message : "Hello"
}