import superagent from 'superagent'

export const fetchServers = async dispatch => {
  const rsp = await superagent.get('/api/servers')

  dispatch({
    type: Symbol.for('update servers'),
    data: rsp.body
  })

  dispatch({
    type: Symbol.for('app ready')
  })
}

export const userInit = async dispatch => {
  if (!window.location.pathname.startsWith('/oauth')) {
    try {
      const rsp = await superagent.get('/api/auth/user')

      dispatch({
        type: Symbol.for('set user'),
        data: rsp.body
      })
      
      dispatch(fetchServers)
    } catch (e) {
      dispatch({
        type: Symbol.for('app ready')
      })
      // window.location.href = '/oauth/flow'
    }
  } else {
    dispatch({
      type: Symbol.for('app ready')
    })
  }
}

export const userLogout = async dispatch => {
  await superagent.post('/api/auth/logout')

  dispatch({
    type: Symbol.for('reset user')
  })

  window.location.href = '/'
}
