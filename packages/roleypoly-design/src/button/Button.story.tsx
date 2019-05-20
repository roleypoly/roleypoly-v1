import * as React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import Button, { PrimaryButton, SecondaryButton } from './Button'

const s = storiesOf('Button', module)

const pressed = action('button pressed!')

s.add('Default', () => <Button onButtonPress={pressed}>Example</Button>)
s.add('Disabled', () => <Button disabled onButtonPress={pressed}>Example</Button>)
s.add('Primary', () => <PrimaryButton onButtonPress={pressed}>Example</PrimaryButton>)
s.add('Secondary', () => <SecondaryButton onButtonPress={pressed}>Example</SecondaryButton>)
s.add('Loading', () => <Button loading onButtonPress={pressed}>Example</Button>)
