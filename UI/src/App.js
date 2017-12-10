import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import './App.css'
import configureStore from './store/configureStore'

import Wrapper from './components/wrapper'
import AppRouter from './router'

const store = configureStore()

window.__APP_STORE__ = store

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Wrapper>
            <AppRouter />
          </Wrapper>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default App
