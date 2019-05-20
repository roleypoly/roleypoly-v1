import { configure } from '@storybook/react'
const req = require.context('../src', true, /\.stor\bies|y\b\.[tj]sx?$/)

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module)
