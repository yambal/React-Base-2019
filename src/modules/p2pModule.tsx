import Peer, { DataConnection, MeshRoom, Room } from 'skyway-js';
import { idea } from 'react-syntax-highlighter/dist/styles/hljs';

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

interface meshOptions {
  mode?: 'sfu' | 'mesh'
  stream?: MediaStream
  videoBandwidth?: number
  audioBandwidth?: number
  videoCodec?:string
  audioCodec?:string
  videoReceiveEnabled?: boolean
  audioReceiveEnabled?: boolean
}

interface iDataConnectionState {
  dataConnection: DataConnection
  datas: any[]
}

interface iMeshState {
  meshName: string
  clientIds: string[]
  datas: {
    clientId: string
    data: any
  }[]
}

let signalingServer:Peer | undefined = undefined
let dataConnections:DataConnection[] = []
let meshs:MeshRoom[] = []

export interface iP2PState {
  status: iDCStatus
  isOpen: boolean
  ids: string[],
  error?: Error 
  myClientId?: string
  dataConnectionStates: iDataConnectionState[]
  meshStates: iMeshState[]
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
  meshStates: []
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
  mesh?: MeshRoom,
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
      },
      MESH: {
        JOINED:             'P2P_ACTION_MESH_JOINED',
        JOINED_OTHER:       'P2P_ACTION_MESH_JOINED_OTHER',
        CLIENT_ID_CHANGED:  'P2P_ACTION_MESH_CLIENT_ID_CHANGED',
        DATA_RECEIVED:      'P2P_ACTION_MESH_CLIENT_DATA_RECEIVED',
        CLOSED:             'P2P_ACTION_MESH_CLOSED',
        DATA_SENDED:        'P2P_ACTION_MESH_DATA_SENDED',
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

    /** Meah */
    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.JOINED:
      /** Meshへの参加 */
      if(action.mesh){
        meshs.push(action.mesh)
        const meshState:iMeshState = {
          meshName: action.mesh.name,
          clientIds: [],
          datas: []
        }
        return Object.assign({}, state, {
          meshStates: state.meshStates.concat([meshState])
        })
      }
    break

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.JOINED_OTHER:
      /** 他のClientがMeshへ参加 */
      return state

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.CLIENT_ID_CHANGED:
      /** Meshへの参加 clientId が変化したとき：遅延して呼ぶ */
      if(action.mesh){
        const ms = state.meshStates.map((meshState) => {
          if(action.mesh && meshState.meshName === action.mesh.name){
            meshState.clientIds = Object.keys(action.mesh.connections)
          }
          return meshState
        })
        return Object.assign({}, state, {
          meshStates: ms
        })
      }
      return state

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.DATA_SENDED:
      /** 全てのユーザーにデータを送信した */
      if(action.mesh){
        const ms = state.meshStates.map((meshState) => {
          if(action.mesh && signalingServer && meshState.meshName === action.mesh.name){
            meshState.datas.push({
              clientId: signalingServer.id,
              data: action.data
            })
          }
          return meshState
        })
        return Object.assign({}, state, {
          meshStates: ms
        })
      }
      return state

    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.DATA_RECEIVED:
      if(action.mesh){
        const ms = state.meshStates.map((meshState) => {
          if(action.mesh && action.peerId && meshState.meshName === action.mesh.name){
            meshState.datas.push({
              clientId: action.peerId,
              data: action.data
            })
          }
          return meshState
        })
        return Object.assign({}, state, {
          meshStates: ms
        })
      }
      return state
    
    case P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.CLOSED:
      if(action.mesh){
        meshs = meshs.filter((mesh) =>{
          return action.mesh && mesh.name !== action.mesh.name
        })
        const deletedMeshStates = state.meshStates.filter((meshState) => {
          return action.mesh && meshState.meshName !== action.mesh.name
        })
        return Object.assign({}, state, {
          meshStates: deletedMeshStates
        })
      }

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
    },
    mesh: {
      joined : (mesh: MeshRoom) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.JOINED,
          mesh
        }
      },
      joinedOtherClient: (mesh: MeshRoom, clientId:string) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.JOINED_OTHER,
          mesh,
          peerId: clientId
        }
      },
      changeClientId: (mesh: MeshRoom, clientId:string) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.CLIENT_ID_CHANGED,
          mesh
        }
      },
      dataSended: (mesh: MeshRoom, data:any) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.DATA_SENDED,
          mesh,
          data
        }
      },
      dataReceived: (mesh: MeshRoom, clientId: string, data: any) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.DATA_RECEIVED,
          mesh,
          peerId: clientId,
          data
        }
      },
      closed: (mesh: MeshRoom) => {
        return {
          type: P2P_ACTIONS.SIGNAL_SERVER.CONNECTION.MESH.CLOSED,
          mesh
        }
      }
    }
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
        })
    
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
    dataChannel: {
      /** 指定したPeerにデータチャネルで接続する */
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
    },
    mesh: {
      join: (roomName: string, meshOption: meshOptions = {mode: 'mesh'} ) => {
        /** Mesh にs接続する */
        return (dispatch:any) => {
          if (signalingServer) {
            const mesh:MeshRoom = signalingServer.joinRoom(roomName, meshOption)

            mesh.on('close', () => {
              dispatch(ssActions.connection.mesh.closed(mesh))
            });

            mesh.on('data', ({ src, data }) => {
              // 他のユーザーから送信されたデータを受信した時
              dispatch(ssActions.connection.mesh.dataReceived(mesh, src, data))
            });

            mesh.on('peerLeave', clientId => {
              setTimeout(()=>{
                // メンバー更新を遅延して呼ぶ
                dispatch(ssActions.connection.mesh.changeClientId(mesh, clientId))
              }, 500)
            });

            mesh.on('peerJoin', clientId => {
              dispatch(ssActions.connection.mesh.joinedOtherClient(mesh, clientId))
              setTimeout(()=>{
                // メンバー更新を遅延して呼ぶ
                dispatch(ssActions.connection.mesh.changeClientId(mesh, clientId))
              }, 500)
            });

            dispatch(ssActions.connection.mesh.joined(mesh))
            setTimeout(()=>{
              // メンバー更新を遅延して呼ぶ
              if(signalingServer){
                dispatch(ssActions.connection.mesh.changeClientId(mesh, signalingServer.id))
              }
            },500)

            
          }
        }
      },
      sendData: (meshName:string, data:any) => {
        /** Mesh にデータを送信する */
        return (dispatch:any) => {
          const sMesh = meshs.filter((mesh) => {
            return mesh.name === meshName
          })[0]

          if(sMesh){
            sMesh.send(data)
            dispatch(ssActions.connection.mesh.dataSended(sMesh, data))
          }
        }
      },
      close: (roomName: string) => {
        /** Mesh から退出する */
        return (dispatch:any) => {
          meshs.map((mesh) => {
            if(mesh.name === roomName){
              mesh.close()
            }
          })
        }
      }
    }
  },
}

const p2pModule = {
  initialP2PState,
  reducer,
  actionCreators
}

export default p2pModule