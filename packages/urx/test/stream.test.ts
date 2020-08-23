import { subscribe, stream, publish } from '../src'

describe('stream', () => {
  it('creates a next / subscribe function', () => {
    const foo = stream<number>()
    const callback = jest.fn()
    subscribe(foo, callback)
    publish(foo, 4)
    expect(callback).toHaveBeenCalledWith(4)
  })
})
