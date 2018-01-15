import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Scrollbars from 'react-custom-scrollbars'
import './pages.sass'

import WhyNoRoles from './WhyNoRoles'
import Error404 from './Error404'
export { default as Landing } from './Landing'
export { default as ServerLanding } from './ServerLanding'
export { default as Error404 } from './Error404'

const Pages = (props) => {
  return <div className="pages">
    <Scrollbars autoHeight autoHeightMax='calc(100vh - 80px)'>
      <div className="pages-inner">
        <Switch>
          <Route path="/help/why-no-roles" component={WhyNoRoles} />
          {/* { isDev ? <Route path="/p/landing" component={Landing} /> : null } */}
          <Route component={Error404} />
        </Switch>
      </div>
    </Scrollbars>
  </div>
}

export default Pages
