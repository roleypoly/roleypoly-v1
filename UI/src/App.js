import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'

import Wrapper from './components/wrapper'
import AppRouter from './router'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <Wrapper>
          <AppRouter />
        </Wrapper>
      </BrowserRouter>
    )
  }
}

export default App
