import superagent from 'superagent'
import { history } from './router/history'

export const fetchServers = async dispatch => {
  const rsp = await superagent.get('/api/servers')

  dispatch({
    type: Symbol.for('update servers'),
    data: rsp.body,
  })

  dispatch({
    type: Symbol.for('app ready'),
  })
}

export const userInit = async dispatch => {
  if (!window.location.pathname.startsWith('/oauth')) {
    try {
      const rsp = await superagent.get('/api/auth/user')

      dispatch({
        type: Symbol.for('set user'),
        data: rsp.body,
      })

      dispatch(fetchServers)
    } catch (e) {
      dispatch({
        type: Symbol.for('app ready'),
      })
      // window.location.href = '/oauth/flow'
    }
  } else {
    dispatch({
      type: Symbol.for('app ready'),
    })
  }
}

export const userLogout = async dispatch => {
  try {
    await superagent.post('/api/auth/logout')
  } catch (e) {}

  dispatch({
    type: Symbol.for('reset user'),
  })

  window.location.href = '/'
}

export const startServerPolling = dispatch => {
  return poll(window.__APP_STORE__.dispatch, window.__APP_STORE__.getState) // let's not cheat... :c
}

const poll = (dispatch, getState) => {
  const { servers } = getState()
  let stop = false
  const stopPolling = () => {
    stop = true
  }
  const pollFunc = async () => {
    if (stop) {
      return
    }
    try {
      await fetchServers(dispatch)
    } catch (e) {
      console.error(e)
      setTimeout(pollFunc, 5000)
    }

    const newServers = getState().servers
    if (servers.size >= newServers.size) {
      setTimeout(pollFunc, 5000)
    } else {
      const old = servers.keySeq().toSet()
      const upd = newServers.keySeq().toSet()
      const newSrv = upd.subtract(old)
      stopPolling()
      history.push(`/s/${newSrv.toJS()[0]}/edit`)
    }
  }

  pollFunc()
  return stopPolling
}
