import { push, replace, go, goBack, goForward } from "connected-react-router"

/**
 * Push
 * @param path 
 * @param state 
 */
const routerPush = (path:string, state?:number) => {
  return (dispatch:any) => {
    dispatch(push(path, state))
  }
}

/**
 * Replace
 * @param path
 * @param state 
 */
const routerReplace = (path:string, state?:number) => {
  return (dispatch:any) => {
    dispatch(replace(path, state))
  }
}

/**
 * Go
 * @param n 
 */
const routerGo = (n:number) => {
  return (dispatch:any) => {
    dispatch(go(n))
  }
}

/**
 * Back
 */
const routerBack = () => {
  return (dispatch:any) => {
    dispatch(goBack())
  }
}

/**
 * Forward
 */
const routerForward = () => {
  return (dispatch:any) => {
    dispatch(goForward())
  }
}

const routerModule = {
  actionCreators: {
    routerPush,
    routerReplace,
    routerGo,
    routerBack,
    routerForward
  }
}

export default routerModule