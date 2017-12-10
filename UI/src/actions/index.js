import superagent from 'superagent'

export const fetchServers = async dispatch => {
  const rsp = await superagent.get('/api/servers')

  dispatch({
    type: Symbol.for('update servers'),
    data: rsp.body
  })
}

export const userInit = async dispatch => {
  try {
    const rsp = await superagent.get('/api/auth/user')
    
    dispatch({
      type: Symbol.for('set user'),
      data: rsp.body
    })

    dispatch(fetchServers)
  } catch (e) {
    if (!window.location.pathname.startsWith('/oauth')) {
      window.location.href = '/oauth/flow'
    }
  }
}

export const userLogout = async dispatch => {
  await superagent.post('/api/auth/logout')

  dispatch({
    type: Symbol.for('reset user')
  })

  window.location.href = '/'
}
