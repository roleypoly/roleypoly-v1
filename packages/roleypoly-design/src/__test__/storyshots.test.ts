/* jest-env jsdom */
import * as path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
import { shallow } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'

// configure({ adapter: new Adapter() })

initStoryshots({
  renderer: shallow,
  configPath: path.resolve(__dirname, '../../.storybook')
})
