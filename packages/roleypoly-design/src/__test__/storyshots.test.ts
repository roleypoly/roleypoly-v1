import * as path from 'path'
import initStoryshots from '@storybook/addon-storyshots'
// import Adapter from 'enzyme-adapter-react-16'

// enzyme.configure({ adapter: new Adapter() })

initStoryshots({
  configPath: path.resolve(__dirname, '../../.storybook')
})