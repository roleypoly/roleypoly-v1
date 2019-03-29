/* eslint-env jest */
import MediaQuery from '../media'

describe('MediaQuery', () => {
  it('outputs media queries', () => {
    const mq = MediaQuery({
      xs: 'font-size: 0.5em;',
      sm: 'font-size: 1em;',
      md: 'font-size: 1.5em;',
      lg: 'font-size: 2em;',
      xl: 'font-size: 2.5em;'
    })

    expect(mq).toMatchSnapshot()
  })
})
