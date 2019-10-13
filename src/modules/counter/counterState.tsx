import CONFIG, { iConfig } from '../../config/config'

export interface iCounterState {
  config: iConfig
  count: number
}

export const defaultCounterState:iCounterState = {
  config: CONFIG,
  count : 0
}