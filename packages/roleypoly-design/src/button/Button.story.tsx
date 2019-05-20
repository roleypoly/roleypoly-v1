import * as React from 'react'
import { storiesOf } from '@storybook/react'

import Button from './Button'

const s = storiesOf('Button', module)

s.add('Default', () => <Button>Example</Button>)
s.add('Disabled', () => <Button>Example</Button>)
s.add('Primary', () => <Button>Example</Button>)
s.add('Secondary', () => <Button>Example</Button>)
s.add('Loading', () => <Button>Example</Button>)