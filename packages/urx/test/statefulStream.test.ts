import { getValue, statefulStream, subscribe } from '../src'

describe('behavior stream', () => {
  it('creates a next / subscribe function', () => {
    const foo = statefulStream(5)
    const callback = jest.fn()
    subscribe(foo, callback)
    expect(callback).toHaveBeenCalledWith(5)
  })

  it('extracts the value from a stream', () => {
    const foo = statefulStream(5)
    const value = getValue(foo)
    expect(value).toBe(5)
  })
})
