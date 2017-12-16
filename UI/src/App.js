import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'
import configureStore from './store/configureStore'
import './App.css'

import Wrapper from './components/wrapper'
import AppRouter from './router'
import { userInit } from './actions'

const history = createHistory()
const store = configureStore(undefined, history)

window.__APP_STORE__ = store

class App extends Component {
  componentWillMount () {
    store.dispatch(userInit)
  }

  render () {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Wrapper>
            <AppRouter />
          </Wrapper>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default App
