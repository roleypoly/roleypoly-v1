import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import createHistory from 'history/createBrowserHistory'
import configureStore from './store/configureStore'
import './App.css'
import './generic.sass'

import Wrapper from './components/wrapper'
import AppRouter from './router'
import { userInit } from './actions'

const history = createHistory()
const store = configureStore(undefined, history)

window.__APP_STORE__ = store

class _App extends Component {
  componentWillMount() {
    store.dispatch(userInit)
  }

  render() {
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

export default DragDropContext(HTML5Backend)(_App)
