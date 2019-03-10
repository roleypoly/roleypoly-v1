// @flow
import * as React from 'react'

export type CommonProps = {
  children: React.Element<any>
}

const HeaderBarCommon: React.StatelessFunctionalComponent<CommonProps> = ({ children }) => (
  <div>
    { children }
  </div>
)

export default HeaderBarCommon
