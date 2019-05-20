import * as React from 'react'
import {
  StyledButton
} from './styled-components'

const Button = ({ children, ...rest }: { children: React.ReactChild | React.ReactChild[] }) => <StyledButton {...rest}>
  {children}
</StyledButton>

export default Button
