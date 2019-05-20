import {
  OverridesT
} from '../helpers/overrides'
// import Button from './Button'

export type ButtonProps = {
  overrides?: OverridesT<any>,
  children: React.ReactChild | React.ReactChild[], // children is required
  onButtonPress?: () => void,
  disabled?: boolean,
  primary?: boolean,
  secondary?: boolean,
  loading?: boolean,
  loadingPct?: number
}
