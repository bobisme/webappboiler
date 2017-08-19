import { expect } from 'chai'
import 'mocha'

import Hello from '../src/hello'

describe('Hello', () => {
  it('should behave a certain way', () => {
    let res = new Hello().speak()
    expect(res).to.equal('sup!')
  })
})
