// @flow
import * as React from 'react'
import dynamic from 'next/dynamic'
import { withRedux } from '../config/redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { namespaceConfig } from 'fast-redux'
import * as User from './user'

type Props = {
  user: User.User
}

const HeaderBarAuth = dynamic(() => import('../components/header/auth'))
const HeaderBarUnauth = dynamic(() => import('../components/header/unauth'))

const HeaderBar: React.StatelessFunctionalComponent<Props> = () => {
  // if ()
  return null
}

const mapStateToProps = (state): Props => {
  return {}
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({ }, dispatch)
}

export default withRedux(connect(mapStateToProps, mapDispatchToProps)(HeaderBar))
