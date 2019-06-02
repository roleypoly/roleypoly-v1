const enzyme = require('enzyme')
const Adapter = require('enzyme-adapter-react-16')
// require('babel-plugin-require-context-hook/register')();
enzyme.configure({ adapter: new Adapter() })
