import {
  filter,
  map,
  mapTo,
  pipe,
  scan,
  withLatestFrom,
  skip,
  distinctUntilChanged,
  debounceTime,
  statefulStream,
  publish,
  stream,
  subscribe,
} from '../src'

describe('pipe', () => {
  it('map transforms the output', () => {
    const foo = statefulStream(2)
    const spy = jest.fn()

    subscribe(
      pipe(
        foo,
        map(value => value + 3),
        map(value => value * 2)
      ),
      spy
    )
    expect(spy).toHaveBeenCalledWith(10)
  })

  it('filter omits certain values', () => {
    const foo = statefulStream(2)
    const spy = jest.fn()

    subscribe(
      pipe(
        foo,
        filter(value => !(value % 2))
      ),
      spy
    )

    publish(foo, 3)

    expect(spy).toHaveBeenCalledWith(2)
    expect(spy).not.toHaveBeenCalledWith(3)
  })

  it('withLatestFrom picks the values from the given sources', () => {
    const s1 = stream<string>()
    const s2 = stream<string>()

    const spy = jest.fn()
    subscribe(pipe(s1, withLatestFrom(s2)), spy)
    publish(s2, 'bar')
    publish(s1, 'foo')
    expect(spy).toHaveBeenCalledWith(['foo', 'bar'])
  })

  it('withLatestFrom picks the values from the given sources (reverse order)', () => {
    const s1 = stream<string>()
    const s2 = stream<string>()

    const spy = jest.fn()
    subscribe(pipe(s1, withLatestFrom(s2)), spy)
    publish(s1, 'foo')
    publish(s2, 'bar')
    expect(spy).toHaveBeenCalledWith(['foo', 'bar'])
  })

  it('mapTo swaps to the value', () => {
    const foo = statefulStream('foo')
    const spy = jest.fn()
    subscribe(pipe(foo, mapTo('bar')), spy)
    expect(spy).toHaveBeenCalledWith('bar')
  })

  it('scan passes previous value', () => {
    const s1 = statefulStream(3)

    const scanner = jest.fn((current, next) => current + next)
    const spy = jest.fn()

    subscribe(pipe(s1, scan(scanner, 2)), spy)
    expect(spy).toHaveBeenCalledWith(5)
    expect(scanner).toHaveBeenCalledWith(2, 3)
  })

  it('skip skips the values the specified times', () => {
    const foo = stream<boolean>()
    const spy = jest.fn()

    subscribe(pipe(foo, skip(2)), spy)
    publish(foo, true)
    publish(foo, true)
    publish(foo, true)
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('debounceTime delays the execution', done => {
    const s1 = stream<number>()

    publish(s1, 1)
    setTimeout(() => publish(s1, 2), 20)
    setTimeout(() => publish(s1, 3), 20)

    subscribe(pipe(s1, debounceTime(50)), val => {
      expect(val).toEqual(3)
      done()
    })
  })

  it('distinctUntilChanged skips identical values', () => {
    const foo = stream<boolean>()
    const spy = jest.fn()

    subscribe(pipe(foo, distinctUntilChanged()), spy)
    publish(foo, true)
    publish(foo, true)
    publish(foo, true)
    publish(foo, false)
    publish(foo, false)
    publish(foo, true)
    expect(spy).toHaveBeenCalledTimes(3)
  })
})

it('debounce does not leak', done => {
  const a = statefulStream(0)

  const i = setInterval(() => {
    publish(a, 1)
  }, 50)

  // let's try to clog the queue
  const OPS = 10000
  let ops = 0
  const ii = setInterval(() => {
    ops++
    Array.from({ length: OPS }, () => Math.random())
      .map(k => k * 2)
      .join(',')
      .split(',')
      .join(',')
  }, 10)

  // this should never happen,
  // because `a` consistently publishes, thus delaying
  // the publish
  subscribe(pipe(a, debounceTime(100)), () => {
    clearInterval(i)
    clearInterval(ii)
    done.fail(new Error('debounce leaked'))
  })

  setTimeout(() => {
    console.log('ops count', ops)
    clearInterval(i)
    clearInterval(ii)
    done()
  }, 4000)
})
