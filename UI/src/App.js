import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import createHistory from 'history/createBrowserHistory'
import configureStore from './store/configureStore'
import './App.css'
import './generic.sass'
import { Router } from 'react-router-dom'
import Wrapper from './components/wrapper'
import AppRouter from './router'
import { userInit } from './actions'

const history = createHistory()
const store = configureStore(undefined, history)

window.__APP_STORE__ = store

class _App extends Component {
  componentDidMount() {
    store.dispatch(userInit)
  }

  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Wrapper>
            <AppRouter />
          </Wrapper>
        </Router>
      </Provider>
    )
  }
}

export default DragDropContext(HTML5Backend)(_App)
