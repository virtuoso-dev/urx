import { eventHandler, publish, reset, stream, subscribe } from '../src'

describe('event handler', () => {
  it('creates a single handler subscriber for a stream', () => {
    const str = stream<number>()
    const handler = eventHandler(str)
    const handle1 = jest.fn()
    const handle2 = jest.fn()
    subscribe(handler, handle1)
    publish(str, 10)
    expect(handle1).toHaveBeenCalledWith(10)
    subscribe(handler, handle2)
    publish(str, 20)
    expect(handle2).toHaveBeenCalledWith(20)
    expect(handle1).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes the handle when reset', () => {
    const str = stream<number>()
    const handler = eventHandler(str)
    const handle1 = jest.fn()
    subscribe(handler, handle1)
    publish(str, 10)
    reset(handler)
    publish(str, 20)
    expect(handle1).toHaveBeenCalledTimes(1)
  })

  it('accepts nullish handle as unsubscribe', () => {
    const str = stream<number>()
    const handler = eventHandler(str)
    const handle1 = jest.fn()
    subscribe(handler, handle1)
    publish(str, 10)
    subscribe(handler, undefined as any)
    publish(str, 20)
    expect(handle1).toHaveBeenCalledTimes(1)
  })
})
