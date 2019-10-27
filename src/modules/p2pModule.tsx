import Peer, { DataConnection } from 'skyway-js';

/**
 * https://webrtc.ecl.ntt.com/skyway-js-sdk-doc/ja/peer/#connectpeerid-options
 */

/* status */
interface iDCStatus {
  code: 'none' | 'opening' | 'opened' | 'disconnected' | 'close' | 'error' | 'dataConnectionClosed' | 'dataConnectionError'
  message: string
}

interface iDCStatuses {
  none: iDCStatus
  opening: iDCStatus
  opened: iDCStatus
  disconnected: iDCStatus
  close: iDCStatus
  error: iDCStatus
  dataConnectionClosed: iDCStatus
  dataConnectionError: iDCStatus
}
const DCStatuses:iDCStatuses = {
  none: {
    code: 'none',
    message: ''
  },
  opening: {
    code: 'opening',
    message: 'シグナリングサーバに接続を開始しました'
  },
  opened: {
    code: 'opened',
    message: 'シグナリングサーバに接続しました'
  },
  disconnected: {
    code: 'disconnected',
    message: 'シグナリングサーバから切断しました'
  },
  close: {
    code: 'close',
    message: '終了しました'
  },
  error: {
    code: 'error',
    message: 'エラーが発生しました'
  },
  dataConnectionClosed: {
    code: 'dataConnectionClosed',
    message: 'データコネクションから切断されました'
  },
  dataConnectionError: {
    code: 'dataConnectionError',
    message: 'データコネクションにエラーが発生しました'
  }
}

/** デバッグフラグ */
export type tSignalingServerDebug = 0 | 1 | 2 | 3 | undefined

interface dataChannelOptions {
  metadata?:any
  serialization?: 'binary' | 'json' | 'none'
  dcInit?: any
  connectionId?: string
}

interface iDataConnectionState {
  dataConnection: DataConnection
  datas: any[]
}

let signalingServer:Peer | undefined = undefined
let dataConnections:DataConnection[] = []
let room:any | undefined = undefined

export interface iP2PState {
  status: iDCStatus
  isOpen: boolean
  ids: string[],
  error?: Error 
  myClientId?: string
  dataConnectionStates: iDataConnectionState[]
  entered: boolean
}

/**
 * Inisial State
 */
const initialP2PState:iP2PState = {
  status: DCStatuses.none,
  isOpen: false,
  ids: [],
  error: undefined,
  myClientId: undefined,
  dataConnectionStates: [],
  entered: false
}

/**
 * Actions
 */
interface iP2PAction {
  type: string
  ids?: string[]
  error?:Error
  peer?: Peer
  peerId?: string
  dataConnection?: DataConnection,
  data?: any
}

const P2P_ACTIONS = {
  SIGNAL_SERVER: {
    OPENING:                'P2P_ACTION_OPENING',
    OPENED:                 'P2P_ACTION_OPENED',
    ON_GET_ID_LIST:         'P2P_ACTION_ON_GET_ID_LIST',
    DISCONNECTED:           'P2P_ACTION_DISCONNECTED',
    CLOSED:                 'P2P_ACTION_CLOSED',
    ERRORED:                'P2P_ACTION_ERRORED',
    CONNECTION: {
      DATA: {
        CONNECTED:          'P2P_ACTION_DATA_CONNECTION_CONNECTED',
        DATA_SENDED:        'P2P_ACTION_DATA_CONNECTION_DATA_SENDED',
        ON_DATA:            'P2P_ACTION_DATA_CONNECTION_ON_DATA',
        CLOSED:             'P2P_ACTION_DATA_CONNECTION_CLOSED',
        ERROR:              'P2P_ACTION_DATA_CONNECTION_ERROR',
      }
    }
  },
  ROOM_JOIN_STARTED: 'P2P_ACTION_ROOM_JOIN_STARTED',
  ROOM_JOINED: 'P2P_ACTION_ROOM_JOINED',
  ROOM_LEAVE_STARTED: 'P2P_ACTION_ROOM_LEAVE_STARTED',
  ROOM_LEAVED: 'P2P_ACTION_ROOM_LEAVED'
}

/**
 * Reducer
 */
const reducer = (state: iP2PState = initialP2PState, action: iP2PAction) => {
  const { open = false } = signalingServer || {}
  switch (action.type) {
    case P2P_ACTIONS.SIGNAL_SERVER.OPENING:
      /* シグナリングサーバに接続を開始した */
      return Object.assign({}, state, {
        status: DCStatuses.opening,
        isOpen: open,
      })

    case P2P_ACTIONS.SIGNAL_SERVER.OPENED:
      /* シグナリングサーバに接続した */
      return Object.assign({}, state, {
        status: DCStatuses.opened,
        isOpen: open,
        myClientId: action.peerId
      })

    case P2P_ACTIONS.SIGNAL_SERVER.ON_GET_ID_LIST:
      /* シグナリングサーバに接続したIDを取得した */
      return Object.assign({}, state, {
        status: DCStatuses.opened,
        isOpen: open,
        ids: action.ids
      })

    case P2P_ACTIONS.SIGNAL_SERVER.DISCONNECTED:
      /* シグナリングサーバから切断したとき */
      return Object.assign({}, state, {
        status: DCStatuses.disconnected,
        isOpen: open,
        myClientId: action.peerId
      })
    case P2P_ACTIONS.SIGNAL_SERVER.CLOSED:
      /* 全ての接続を終了した */
      return Object.assign({}, state, {
        status: DCStatuses.close,
        isOpen: open,
      })

    case P2P_ACTIONS.SIGNAL_SERVER.ERRORED:
      /* エラーが発生した */
      return Object.assign({}, state, {
        status: DCStatuses.error,
        error: state.error,
        isOpen: open,
      })

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.CONNECTED:
      /** データコネクションに接続した */
      if(action.dataConnection){
        dataConnections.push(action.dataConnection)

        const newDataConnection:iDataConnectionState = {
          dataConnection: action.dataConnection,
          datas: []
        }

        return Object.assign({}, state, {
          dataConnectionStates: state.dataConnectionStates.concat([newDataConnection])
        })
      }
      break;

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.DATA_SENDED:
      /** データを送信した */
      const dataConnectionStates = state.dataConnectionStates.concat([])
      dataConnectionStates.map((dataConnectionState) => {
        if (action.dataConnection && dataConnectionState.dataConnection.id === action.dataConnection.id) {
          dataConnectionState.datas.push(action.data)
          return {
            dataConnection: dataConnectionState.dataConnection,
            data: action.data
          }
        }
        return null
      })

      return Object.assign({}, state, {
        dataConnectionStates
      })
    
    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.ON_DATA:
      /** データを受信した */
      const dataConnectionStatesB = state.dataConnectionStates.concat([])
      dataConnectionStatesB.map((dataConnectionState) => {
        if(action.dataConnection && dataConnectionState.dataConnection.id === action.dataConnection.id){
          dataConnectionState.datas.push(action.data)
          return {
            dataConnection: dataConnectionState.dataConnection,
            data: action.data
          }
        }
        return null
      })

      return Object.assign({}, state, {
        dataConnectionStatesB
      })

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.CLOSED:
      /** データコネクションから切断した */
      if(action.dataConnection){
        dataConnections = dataConnections.filter((dataConnection) => {
          return action.dataConnection && dataConnection.id !== action.dataConnection.id
        })

        const dataConnectionStates = state.dataConnectionStates.filter((dataConnectionState) => {
          return action.dataConnection && dataConnectionState.dataConnection.id !== action.dataConnection.id
        })

        return Object.assign({}, state, {
          status: DCStatuses.dataConnectionClosed,
          isOpen: open,
          dataConnectionStates
        })
      }
      break;
    
    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.ERROR:
      /** データコネクションにエラーが発生した */
      return Object.assign({}, state, {
        status: DCStatuses.dataConnectionError,
        isOpen: open
      })

    case P2P_ACTIONS.ROOM_JOIN_STARTED:
      return Object.assign({}, state, {
        state: 'joinRoom start'
      })

    case P2P_ACTIONS.ROOM_JOINED:
      return Object.assign({}, state, {
        state: 'joinRoom',
        entered: true
      })

    case P2P_ACTIONS.ROOM_LEAVED:
      return Object.assign({}, state, {
        state: 'close',
        entered: false
      })

    default: return state
  }
}

/**
 * Actions
 */
const ssActions = {
  started : ():iP2PAction => {
    /** 接続を開始した */
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.OPENING,
    };
  },
  opened: (peerId:string):iP2PAction => {
    /** 接続した */
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.OPENED,
      peerId
    };
  },
  onGetIds: (peerIds: string[]) => {
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.ON_GET_ID_LIST,
      ids: peerIds
    }
  },
  connection: {
    data: {
      connected: (dataConnection:DataConnection) => {
        /** データコネクションに接続した */
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.CONNECTED,
          dataConnection
        }
      },
      dataSended: (dataConnection:DataConnection, data:any) => {
        /** データを送信した */
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.DATA_SENDED,
          dataConnection,
          data
        }
      },
      onData: (dataConnection:DataConnection, data:any) => {
        /** データを受信した */
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.ON_DATA,
          dataConnection,
          data
        }
      },
      closed: (dataConnection:DataConnection) => {
        /** データコネクションが切断した */
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.CLOSED,
          dataConnection: dataConnection
        }
      },
      error: (dataConnection:DataConnection) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.DATA.ERROR,
          dataConnection: dataConnection
        }
      }
    }
  },
  disconnected : (peerId:string) => {
    /* シグナリングサーバから切断したとき */
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.DISCONNECTED,
      peerId
    }
  },
  closed : () => {
    /* Peerに対する全ての接続を終了したとき */
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.CLOSED,
    }
  },
  errored : (error: Error) => {
    /* エラーが発生したとき */
    return {
      type: P2P_ACTIONS.SIGNAL_SERVER.ERRORED,
      error
    }
  }
}

const joinStarted = () => {
  return {
    type: P2P_ACTIONS.ROOM_JOIN_STARTED
  }
}

const roomJoined = () => {
  return {
    type: P2P_ACTIONS.ROOM_JOINED
  }
}

const roomLeaved = () => {
  return {
    type: P2P_ACTIONS.ROOM_LEAVED
  }
}

/**
 * Action creator
 */

const addListenerTpDataConnection = (dispatch: any, dataConnection:DataConnection) => {
  dataConnection.on('close', () => {
    /** データコネクションが切断された */
    dispatch(ssActions.connection.data.closed(dataConnection))
  });

  dataConnection.on('data', (data:any) => {
    /** データを受信したとき */
    dispatch(ssActions.connection.data.onData(dataConnection, data))
  });

  dataConnection.on('open', () => {
    console.log('dataConnection open')
  });

  dataConnection.on('error', () => {
    dispatch(ssActions.connection.data.error(dataConnection))
  });
}

const actionCreators = {
  signalingServer: {
    open : (apiKey:string, id?:string | null, debug?:tSignalingServerDebug) => {
      return (dispatch:any) => {
        dispatch(ssActions.started);
    
        /** シグナリングサーバに接続する */
        signalingServer = new Peer(id || '', {
          key: apiKey,
          debug,
        });
    
        signalingServer.on('error', (error:Error) => {
          /* Error */
          dispatch(ssActions.errored(error));
        })
    
        signalingServer.on('open', (peerId:string) => {
          /* シグナリングサーバへ正常に接続できたとき */
          dispatch(ssActions.opened(peerId));
        });
    
        signalingServer.on('disconnected', (peerId:string) => {
          /* シグナリングサーバから切断したとき */
          dispatch(ssActions.disconnected(peerId));
        });

        signalingServer.on('close', () => {
          /* Peerに対する全ての接続を終了したとき */
          dispatch(ssActions.closed());
        });

        signalingServer.on('connection', (dataConnection:DataConnection) => {
          /* DataChannelの接続を受信したとき（接続要求側は発生しない） */
          addListenerTpDataConnection(dispatch, dataConnection)
          dispatch(ssActions.connection.data.connected(dataConnection));
        });
      };
    },
    getIdList: () => {
      /* Peer ID一覧を取得 */
      return (dispatch:any) => {
        if (signalingServer) {
          signalingServer.listAllPeers(peers => {
            dispatch(ssActions.onGetIds(peers));
          });
        }
      }
    },
    destroy: () => {
      /* 全てのコネクションを閉じ、シグナリングサーバへの接続を切断します */
      return (dispatch:any) => {
        if (signalingServer) {
          signalingServer.destroy()
        }
      }
    },
    disconnect: () => {
      /* シグナリングサーバへの接続を閉じ、disconnectedイベントを送出 */
      return (dispatch:any) => {
        if (signalingServer) {
          signalingServer.disconnect()
        }
      }
    },
    reconnect: () => {
      /* シグナリングサーバへ再接続 */
      return (dispatch:any) => {
        if (signalingServer) {
          signalingServer.reconnect()
        }
      }
    }
  },
  connections: {
    /** 指定したPeerにデータチャネルで接続する */
    dataChannel: {
      connect: (remoteClientId:string, options?: dataChannelOptions) => {
        return (dispatch:any) => {
          if (signalingServer) {
            // 指定ClientId が存在するか
            signalingServer.listAllPeers(clientIds => {
              if(clientIds.includes(remoteClientId) && signalingServer){
                const dataConnection:DataConnection = signalingServer.connect(remoteClientId, options)
                addListenerTpDataConnection(dispatch, dataConnection)
                dispatch(ssActions.onGetIds(clientIds));
                dispatch(ssActions.connection.data.connected(dataConnection))
              } else {
                const a:Error = new Error()
                dispatch(ssActions.errored(a))
              }
            });
          } else {
            const a:Error = new Error()
            dispatch(ssActions.errored(a))
          }
        }
      },
      sendData: (sendDataConnection: DataConnection, data: any) => {
        return (dispatch:any) => {
          dataConnections.map((dataConnection) => {
            if(dataConnection.id === sendDataConnection.id){
              dataConnection.send(data)
              dispatch(ssActions.connection.data.dataSended(dataConnection, data))
              return {
                dataConnection,
                data: data
              }
            }
            return null
          })
        }
      },
      close: (closeDataConnection: DataConnection) => {
        return (dispatch:any) => {
          dataConnections.map((dataConnection) => {
            if(dataConnection.id === closeDataConnection.id){
              dataConnection.close()
              return {
                dataConnection,
              }
            }
            return null
          })
        }
      }
    }
  },
  pend: {
    destroy: () => {
      /* 全てのコネクションを閉じ、シグナリングサーバへの接続を切断 */
      return (dispatch:any) => {
        if (signalingServer) {
          signalingServer.destroy()
        }
      }
    },
  },
  Room: {
    join: () => {
      return (dispatch:any) => {
        dispatch(joinStarted());
        if(signalingServer) {
          
          room = signalingServer.joinRoom('room', {
            mode: 'mesh'
          })
    
          room.on('open', () => {
            /* 新規にルームへ入室したとき */
            console.info('room on open')
            dispatch(roomJoined())
          });
    
          room.on('data', (peerId:string, data:any) => {
            /* データを受信したとき */
            console.log('room on data', peerId, data)
          })
    
          room.on('peerJoin', (peerId: string) => {
            /* ルームに新しいメンバが参加したとき */
            console.log('room on peerJoin', peerId)
          })
    
          room.on('peerLeave', (peerId: string) => {
            /* ルームからメンバが退出したとき */
            console.log('room on peerLeave', peerId)
          });
    
          room.on('close', () => {
            /* ルームをclose(退出))したとき */
            console.info('room on close')
            room = undefined
            dispatch(roomLeaved())
          });
        }
      }
    },
    leave: () => {
      return (dispatch:any) => {
        room.close()
      }
    }
  }
}

const p2pModule = {
  initialP2PState,
  reducer,
  actionCreators
}

export default p2pModule