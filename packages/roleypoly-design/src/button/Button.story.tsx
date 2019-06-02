import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { number, withKnobs } from '@storybook/addon-knobs'

import Button, {
  PrimaryButton,
  SecondaryButton,
  LoadingButton
} from './Button'

const s = storiesOf('Button', module)
s.addDecorator(withKnobs)

const pressed = action('button pressed!')

s.add('Default', () => <Button onButtonPress={pressed}>Example</Button>)
s.add('Disabled', () => <Button disabled onButtonPress={pressed}>Example</Button>)
s.add('Primary', () => <PrimaryButton onButtonPress={pressed}>Example</PrimaryButton>)
s.add('Secondary', () => <SecondaryButton onButtonPress={pressed}>Example</SecondaryButton>)
s.add('Loading', () => <LoadingButton onButtonPress={pressed} loadingPct={number('Loading percentage', 100, ({ max: 100, min: 0, step: 1 } as any))}>Example</LoadingButton>)
