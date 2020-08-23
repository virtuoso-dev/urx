import { compose } from './utils'
import { Emitter } from './interfaces'
import { subscribe } from './actions'

export interface Operator<T, K = T> {
  (done: (result: K) => void): (value: T) => void
}

export function debounceTime<T>(interval: number): Operator<T> {
  let currentValue: T | undefined
  let timeout: any

  return done => value => {
    currentValue = value
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      done(currentValue!)
    }, interval)
  }
}

export interface Comparator<T> {
  (a: T, b: T): boolean
}

export function defaultComparator<T>(a: T, b: T) {
  return a === b
}

export function distinctUntilChanged<T>(comparator: Comparator<T> = defaultComparator): Operator<T> {
  let current: T
  return done => next => {
    if (!comparator(current, next)) {
      current = next
      done(next)
    }
  }
}

export function filter<T>(predicate: (value: T) => boolean): Operator<T> {
  return done => value => {
    predicate(value) && done(value)
  }
}

export function map<T, K>(project: (value: T) => K): Operator<T, K> {
  return done => compose(done, project)
}

export function mapTo<T>(value: T): Operator<any, T> {
  return done => () => done(value)
}

export function scan<T, K>(scanner: (current: T, value: K) => T, initial: T): Operator<K, T> {
  return done => value => done((initial = scanner(initial, value)))
}

export function skip<T>(times: number): Operator<T> {
  return done => value => {
    times > 0 ? times-- : done(value)
  }
}

export function throttleTime<T>(interval: number): Operator<T> {
  let currentValue: T | undefined
  let timeout: any

  return done => value => {
    currentValue = value

    if (timeout) {
      return
    }

    timeout = setTimeout(() => {
      timeout = undefined
      done(currentValue!)
    }, interval)
  }
}

export function withLatestFrom<T, R1>(...s: [Emitter<R1>]): Operator<T, [T, R1]> // prettier-ignore
export function withLatestFrom<T, R1, R2>(...s: [Emitter<R1>, Emitter<R2>]): Operator<T, [T, R1, R2]> // prettier-ignore
export function withLatestFrom<T, R1, R2, R3>( ...s: [Emitter<R1>, Emitter<R2>, Emitter<R3>]): Operator<T, [T, R1, R2, R3]> // prettier-ignore
export function withLatestFrom<T, R1, R2, R3, R4>( ...s: [Emitter<R1>, Emitter<R2>, Emitter<R3>, Emitter<R4>]): Operator<T, [T, R1, R2, R3, R4]> // prettier-ignore
export function withLatestFrom<T, R1, R2, R3, R4, R5>( ...s: [Emitter<R1>, Emitter<R2>, Emitter<R3>, Emitter<R4>, Emitter<R5>]): Operator<T, [T, R1, R2, R3, R4, R5]> // prettier-ignore
export function withLatestFrom<T, R1, R2, R3, R4, R5, R6>( ...s: [Emitter<R1>, Emitter<R2>, Emitter<R3>, Emitter<R4>, Emitter<R5>, Emitter<R6>]): Operator<T, [T, R1, R2, R3, R4, R5, R6]> // prettier-ignore
export function withLatestFrom<T, R1, R2, R3, R4, R5, R6, R7>( ...s: [Emitter<R1>, Emitter<R2>, Emitter<R3>, Emitter<R4>, Emitter<R5>, Emitter<R6>, Emitter<R7>]): Operator<T, [T, R1, R2, R3, R4, R5, R6, R7]> // prettier-ignore
export function withLatestFrom(...sources: Emitter<any>[]): Operator<any, any> {
  const values = new Array(sources.length)
  let called = 0
  const allCalled = Math.pow(2, sources.length) - 1

  sources.forEach((source, index) => {
    const bit = Math.pow(2, index)
    subscribe(source, value => {
      called = called | bit
      values[index] = value
    })
  })

  return done => value => {
    if (called === allCalled) {
      done([value].concat(values))
    }
  }
}
