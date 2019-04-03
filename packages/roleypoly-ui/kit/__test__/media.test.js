/* eslint-env jest */
import MediaQuery, { xs, sm, md, lg, xl } from '../media'

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

describe('mediaTemplateLiteral', () => {
  it('renders how we expect', () => {
    // this is a weird fixture because of how we render MediaQuery for testing
    const mq = `${xs`font-size: 0.5em;`}
${sm`font-size: 1em;`}
${md`font-size: 1.5em;`}
${lg`font-size: 2em;`}
${xl`font-size: 2.5em;`}`

    expect(mq).toMatchSnapshot()

    const mq2 = MediaQuery({//
      xs: 'font-size: 0.5em;',
      sm: 'font-size: 1em;',
      md: 'font-size: 1.5em;',
      lg: 'font-size: 2em;',
      xl: 'font-size: 2.5em;'
    })

    expect(mq).toEqual(mq2)
  })
})
