import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import './pages.sass'

import WhyNoRoles from './WhyNoRoles'
import LandingPage from './Landing'
export const Landing = LandingPage // re-export

const isDev = process.env.NODE_ENV === 'development'

const Pages = (props) => {
  return <div className="pages">
    <Scrollbars autoHeight autoHeightMax='calc(100vh - 80px)'>
      <div className="pages-inner">
        <Switch>
          <Route path="/help/why-no-roles" component={WhyNoRoles} />
          {/* { isDev ? <Route path="/p/landing" component={Landing} /> : null } */}
        </Switch>
      </div>
    </Scrollbars>
  </div>
}

export default Pages
