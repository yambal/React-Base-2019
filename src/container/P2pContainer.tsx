import React, { useState } from 'react';
import { connect } from 'react-redux'
import { iRootState } from '../redux/RootState'
import p2pModule, { iP2PState, tSignalingServerDebug } from '../modules/p2pModule'
import { DataConnection, Room } from 'skyway-js';

const { useEffect } = React

interface iP2pContainerProps {
  p2p: iP2PState
  open: (apiKey: string, id?:string, debug?:tSignalingServerDebug) => void,
  getIpList: () => void,
  connect: (peerId: string) => void,
  send: (dataConnection: DataConnection, data:any) => void
  close:(dataConnection: DataConnection) => void
  destroy: () => void
  disconnect: () => void,
  reconnect: () => void,
  meshJoin: (roomName:string) => void,
  meshSend: (meshName:string, data:any) => void,
  meshClose: (roomName:string) => void

  /*
  destroy: () => void,
  joinToRoom: () => void,
  leaveRoom: () => void
  */
}

const P2pContainer:React.FC<iP2pContainerProps> = (props) => {
  useEffect(() => {
    props.open('da1c5bf6-ad19-4dec-a91f-488cd4e398b5', '', 0)
  
    return () => {
      console.log('un Mount')
    }
  }, [])

  const { isOpen } = props.p2p
  const [dataChannelConnectTo, setDataChannelConnectTo] = useState('');
  const [dataConnectionText, setSataConnectionText] = useState('');

  const handleOnChangeIdList = (e:React.FormEvent<HTMLSelectElement>) => {
    const id = e.currentTarget.value
    setDataChannelConnectTo(id === 'none' ? '' : id)
  }

  const handleOnClickDataChennelConnect = (e:React.MouseEvent<HTMLButtonElement>) => {
    props.connect(dataChannelConnectTo)
  }

  const handleOnClickDataChannelClose = (e:React.MouseEvent<HTMLButtonElement>) => {
    const closingDataConnectionId = e.currentTarget.dataset.id
    props.p2p.dataConnectionStates.map((dataConnectionState) => {
      if(dataConnectionState.dataConnection.id === closingDataConnectionId){
        props.close(dataConnectionState.dataConnection)
        return {
          dataConnection: dataConnectionState.dataConnection
        }
      }
      return null
    })
  }

  const handleOnchengeDataConnectionText = (e:React.FormEvent<HTMLTextAreaElement>) => {
    setSataConnectionText(e.currentTarget.value)
  }

  const handleOnDataChannelSend = (e:React.MouseEvent<HTMLButtonElement>) => {
    const dataConnectionId = e.currentTarget.dataset.dataconnectionid
    props.p2p.dataConnectionStates.map(dataConnectionState => {
      if(dataConnectionState.dataConnection.id === dataConnectionId){
        props.send(dataConnectionState.dataConnection, {
          text: dataConnectionText
        })
        return {
          dataConnection: dataConnectionState.dataConnection.id,
          data: dataConnectionText
        }
      }
      return null
    })
  }

  const handleOnMeshJoin = (e:React.MouseEvent<HTMLButtonElement>) => {
    props.meshJoin('ROOM')
  }

  const handleOnSendDataToMesh = (e:React.MouseEvent<HTMLButtonElement>) => {
    const meshName = e.currentTarget.dataset.meshname
    props.p2p.meshStates.map((meshState) => {
      if(meshState.meshName === meshName){
        props.meshSend(meshState.meshName, 'Hello')
      }
    })
  }

  const handleOnMeshClose = (e:React.MouseEvent<HTMLButtonElement>) => {
    const meshName = e.currentTarget.dataset.meshname
    if(meshName){
      props.meshClose(meshName)
    }
  }

  const selectableIds = () => {
    const remoteIds = props.p2p.dataConnectionStates.map((dataConnectionState) => {
      return dataConnectionState.dataConnection.remoteId
    })
    return props.p2p.ids.filter((id) => {
      return id !== props.p2p.myClientId && !remoteIds.includes(id)
    })
  }

  return (
    <div>
      <div>シグナルサーバ：{props.p2p.isOpen ? 'open' : 'close'}</div>
      <div>{props.p2p.status.code} : {props.p2p.status.message}</div>
      <div>your id : {props.p2p.myClientId}</div>
      <button onClick={props.destroy} disabled={!isOpen}>destroy</button>
      <button onClick={props.disconnect} disabled={!isOpen}>disconnect</button>
      <button onClick={props.reconnect} disabled={isOpen}>reconnect</button>
      <hr />
      <button onClick={props.getIpList} disabled={!isOpen}>getIpList</button>
      <select onChange={handleOnChangeIdList}>
        <option value='none'>ids</option>
        {selectableIds().map(remoteClientId => {
          return <option key={remoteClientId} value={remoteClientId}>id:{remoteClientId}</option>
        })}
      </select>
      <button
        onClick={handleOnClickDataChennelConnect}
        disabled={!isOpen || dataChannelConnectTo.length === 0}
      >
        connect
      </button>
      <div>
        {
          props.p2p.dataConnectionStates.map((dataConnectionState, index:number) => {
            return (
              <div key={index}>
                <div>
                  <div>connection id:{dataConnectionState.dataConnection.id}</div>
                  <div>remote id:{dataConnectionState.dataConnection.remoteId}</div>
                  <button onClick={handleOnClickDataChannelClose} data-id={dataConnectionState.dataConnection.id}>close</button>
                </div>
                <pre>{JSON.stringify(dataConnectionState.datas)}</pre>
                <textarea
                  onChange={handleOnchengeDataConnectionText}
                  value={dataConnectionText}
                />
                <button
                  onClick={handleOnDataChannelSend}
                  data-dataconnectionid={dataConnectionState.dataConnection.id}
                >
                  Send
                </button>
              </div>
            )
          })
        }
      </div>
      <hr />
      <button onClick={handleOnMeshJoin}>Join</button>
      {
        props.p2p.meshStates.map((meshState) => {
          return(
          <div key={meshState.meshName}>
            {meshState.meshName}
            <ul>
              {meshState.clientIds.map((clientId) => {
                return <li key={clientId}>{clientId}</li>
              })}
            </ul>
            <pre>{JSON.stringify(props.p2p.meshStates, null, 2)}</pre>
            <button onClick={handleOnMeshClose} data-meshname={meshState.meshName}>close</button>
            <button onClick={handleOnSendDataToMesh} data-meshname={meshState.meshName}>send</button>
          </div>
          )
        })
      }
      
    </div>
  )
}

const mapStateToProps = (state:iRootState) => {
  return {
    p2p: state.p2p
  }
}
  
const mapDispatchToProps = {
  open:       p2pModule.actionCreators.signalingServer.open,
  getIpList:  p2pModule.actionCreators.signalingServer.getIdList,
  destroy:    p2pModule.actionCreators.signalingServer.destroy,
  disconnect: p2pModule.actionCreators.signalingServer.disconnect,
  reconnect:  p2pModule.actionCreators.signalingServer.reconnect,
  connect:    p2pModule.actionCreators.connections.dataChannel.connect,
  send:       p2pModule.actionCreators.connections.dataChannel.sendData,
  close:      p2pModule.actionCreators.connections.dataChannel.close,
  meshJoin:   p2pModule.actionCreators.connections.mesh.join,
  meshSend:   p2pModule.actionCreators.connections.mesh.sendData,
  meshClose:  p2pModule.actionCreators.connections.mesh.close,

  /*
  destroy:    p2pModule.actionCreators.signalingServer.destroy,
  joinToRoom: p2pModule.actionCreators.Room.join,
  leaveRoom:  p2pModule.actionCreators.Room.leave
  */
}

export default connect(mapStateToProps, mapDispatchToProps)(P2pContainer)