import { compose } from './utils'
import { Emitter } from './interfaces'
import { subscribe } from './actions'

/**
 * Operators transform and control the flow of values.
 * The [[pipe]] transformer is used to transform one Emitter into another by stacking operators to its values.
 */
export interface Operator<Input, Output = Input> {
  (done: (value: Output) => void): (value: Input) => void
}

/**
 * Comparator determines if two values are equal.
 * Implement custom comparators when distinctUntilChanged needs to work on non-primitive objects.
 */
export interface Comparator<T> {
  (previous: T, next: T): boolean
}

/**
 * The default [[Comparator]] for [[distinctUntilChanged]] and [[duc]].
 */
export function defaultComparator<T>(previous: T, next: T) {
  return previous === next
}

/**
 * Filters out identical values. Pass an optional comparator if you need to filter non-primitive values.
 */
export function distinctUntilChanged<T>(comparator: Comparator<T> = defaultComparator): Operator<T> {
  let current: T
  return done => next => {
    if (!comparator(current, next)) {
      current = next
      done(next)
    }
  }
}

/**
 * Filters out values for which the predicator does not return `true`-ish.
 */
export function filter<T>(predicate: (value: T) => boolean): Operator<T> {
  return done => value => {
    predicate(value) && done(value)
  }
}

/**
 * Maps values using the project function.
 */
export function map<T, K>(project: (value: T) => K): Operator<T, K> {
  return done => compose(done, project)
}

/**
 * Maps values to the hard-coded value.
 */
export function mapTo<T>(value: T): Operator<any, T> {
  return done => () => done(value)
}

/**
 * Applies an accumulator function on the emitter, and outputs intermediate result. Starts with the initial value.
 */
export function scan<T, K>(scanner: (current: T, value: K) => T, initial: T): Operator<K, T> {
  return done => value => done((initial = scanner(initial, value)))
}

/**
 * Skips the specified amount of values from the emitter.
 */
export function skip<T>(times: number): Operator<T> {
  return done => value => {
    times > 0 ? times-- : done(value)
  }
}

/**
 * Throttles flowing values at the provided interval in milliseconds.
 */
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

/**
 * Debounces flowing values at the provided interval in milliseconds.
 */
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

/**
 * Combines the source Emitter with the latest values from the specified emitters into an array. Outputs only when the source Emitter emits.
 * See [[combineLatest]] for a transformer that outputs when any of the emitters emit.
 */
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
