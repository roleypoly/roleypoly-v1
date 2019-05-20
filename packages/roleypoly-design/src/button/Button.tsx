import * as React from 'react'
import {
  getOverrides
} from '../helpers/overrides'
import {
  StyledButton,
  StyledPrimaryButton,
  StyledSecondaryButton
} from './styled'
import {
  ButtonProps
} from './types'

export default class Button extends React.Component<ButtonProps> {
  static defaultProps: ButtonProps = {
    disabled: false,
    primary: false,
    secondary: false,
    loading: false,
    loadingPct: 0,
    children: 'Button',
    overrides: {}
  }

  handleClick = () => {
    if (this.props.disabled === true || typeof this.props.onButtonPress !== 'function') {
      return
    }

    this.props.onButtonPress()
  }

  render () {
    const {
      overrides = {},
      children,
      // removing from rest
      loading,
      onButtonPress,
      ...rest
    } = this.props

    const [BaseButton, baseButtonProps] = getOverrides(
      overrides.BaseButton,
      StyledButton
    )

    console.log({ overrides, BaseButton, baseButtonProps })

    return <BaseButton {...rest} {...baseButtonProps} onClick={this.handleClick}>
      {children}
    </BaseButton>
  }
}

export const PrimaryButton = (props: ButtonProps) => <Button {...props} overrides={{
  BaseButton: {
    component: StyledPrimaryButton
  }
}} />

export const SecondaryButton = (props: ButtonProps) => <Button {...props} overrides={{
  BaseButton: {
    component: StyledSecondaryButton
  }
}} />
