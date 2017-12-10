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
  } catch(e) {
    console.log(e)
  }
}