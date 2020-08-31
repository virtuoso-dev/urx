/**
 * Transformers change and combine streams. The most important one is [[pipe]], which creates new [[Emitter]] by piping values from existing Emitter(s) through one or more operators.
 * @packageDocumentation
 */
import { Emitter, Subscription, reset, publish, subscribe } from './actions'
import { RESET, SUBSCRIBE } from './constants'
import { joinProc, thrush } from './utils'
import { Comparator, defaultComparator, distinctUntilChanged, Operator } from './operators'
import { stream } from './streams'

/** @internal */
type CombineOperatorsReturnType<I, O> = (subscriber: (value: O) => void) => (value: I) => void

/** @internal */
function combineOperators<I>(...operators: Operator<any, any>[]): CombineOperatorsReturnType<I, any> {
  const o2 = operators.slice().reverse()

  return (subscriber: (value: any) => void) => {
    return o2.reduce(thrush, subscriber)
  }
}

/** @internal */
type O<I, OP> = Operator<I, OP>

/**
 * Creates a new emitter from an existing one by piping its values through one or more operators.
 * Operators can perform various actions like filter values, pull values from other emitters, or compute new values.
 */
export function pipe<T>(s: Emitter<T>): Emitter<T> // prettier-ignore
export function pipe<T, O1>(s: Emitter<T>, o1: O<T, O1>): Emitter<O1> // prettier-ignore
export function pipe<T, O1, O2>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>]): Emitter<O2> // prettier-ignore
export function pipe<T, O1, O2, O3>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>, O<O2, O3>]): Emitter<O3> // prettier-ignore
export function pipe<T, O1, O2, O3, O4>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>, O<O2, O3>, O<O3, O4>]): Emitter<O4> // prettier-ignore
export function pipe<T, O1, O2, O3, O4, O5>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>, O<O2, O3>, O<O3, O4>, O<O4, O5>]): Emitter<O5> // prettier-ignore
export function pipe<T, O1, O2, O3, O4, O5, O6>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>, O<O2, O3>, O<O3, O4>, O<O4, O5>, O<O5, O6>]): Emitter<O6> // prettier-ignore
export function pipe<T, O1, O2, O3, O4, O5, O6, O7>(s: Emitter<T>, ...o: [O<T, O1>, O<O1, O2>, O<O2, O3>, O<O3, O4>, O<O4, O5>, O<O5, O6>, O<O6, O7>]): Emitter<O7> // prettier-ignore
export function pipe<T>(source: Emitter<T>, ...operators: O<any, any>[]): Emitter<any> {
  // prettier-ignore
  const project = combineOperators(...operators)
  return ((action: SUBSCRIBE | RESET, subscription: Subscription<any>) => {
    switch (action) {
      case SUBSCRIBE:
        return subscribe(source, project(subscription))
      case RESET:
        reset(source)
        return
      default:
        throw new Error(`unrecognized action ${action}`)
    }
  }) as Emitter<any>
}

/**
 * Merges one or more emitters from the same type into a new one which emits values from any of the source emitters.
 */
export function merge<T>(...sources: Emitter<T>[]): Emitter<T> {
  return function(action: SUBSCRIBE | RESET, subscription?: Subscription<any>) {
    switch (action) {
      case SUBSCRIBE:
        return joinProc(...sources.map(source => subscribe(source, subscription!)))
      case RESET:
        // do nothing, we are stateless
        return
      default:
        throw new Error(`unrecognized action ${action}`)
    }
  } as Emitter<T>
}

/**
 * A convenience combinator that emits only the distinct values from the passed Emitter. Wraps [[pipe]] and [[distinctUntilChanged]].
 *
 * ```ts
 * const foo = stream<number>()
 * // this line...
 * const a = duc(foo)
 * // is equivalent to this
 * const b = pipe(distinctUntilChanged(foo))
 * ```
 *
 * @param source The source emitter.
 * @param comparator optional custom comparison function for the two values.
 *
 * @typeParam T the type of the value emitted by the source.
 *
 * @returns the resulting emitter.
 */
export function duc<T>(source: Emitter<T>, comparator: Comparator<T> = defaultComparator): Emitter<T> {
  return pipe(source, distinctUntilChanged(comparator))
}

/**
 * Creates an emitter with the latest values from all passed emitters as an array.
 *
 * combineLatest acts as a Depot. Using it on stateless streams persists the last emitted value of each Emitter.
 * Provided that all emitters have emitted at least once, subscribing to the resulting emitter will immediately receive their combined latest values.
 */
export function combineLatest<O1, O2>(...emitters: [Emitter<O1>, Emitter<O2>]): Emitter<[O1, O2]> // prettier-ignore
export function combineLatest<O1, O2, O3>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>]): Emitter<[O1, O2, O3]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>]): Emitter<[O1, O2, O3, O4]> // prettier-ignore
export function combineLatest<O1, O2, O3>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>]): Emitter<[O1, O2, O3]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>]): Emitter<[O1, O2, O3, O4, O5]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>]): Emitter<[O1, O2, O3, O4, O5, O6]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6, O7>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>, Emitter<O7>]): Emitter<[O1, O2, O3, O4, O5, O6, O7]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6, O7, O8>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>, Emitter<O7>, Emitter<O8>]): Emitter<[O1, O2, O3, O4, O5, O6, O7, O8]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6, O7, O8, O9>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>, Emitter<O7>, Emitter<O8>, Emitter<O9>]): Emitter<[O1, O2, O3, O4, O5, O6, O7, O8, O9]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>, Emitter<O7>, Emitter<O8>, Emitter<O9>, Emitter<O10>]): Emitter<[O1, O2, O3, O4, O5, O6, O7, O8, O9, O10]> // prettier-ignore
export function combineLatest<O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11>( ...emitters: [Emitter<O1>, Emitter<O2>, Emitter<O3>, Emitter<O4>, Emitter<O5>, Emitter<O6>, Emitter<O7>, Emitter<O8>, Emitter<O9>, Emitter<O10>, Emitter<O11>]): Emitter<[O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11]> // prettier-ignore
export function combineLatest(...emitters: Emitter<any>[]): Emitter<any> {
  let innerSubject = stream<any>()
  const values = new Array(emitters.length)
  let called = 0
  const allCalled = Math.pow(2, emitters.length) - 1

  emitters.forEach((source, index) => {
    const bit = Math.pow(2, index)
    subscribe(source, value => {
      values[index] = value
      called = called | bit
      if (called === allCalled) {
        publish(innerSubject, values)
      }
    })
  })

  return function(action: SUBSCRIBE | RESET, subscription?: Subscription<any>) {
    switch (action) {
      case SUBSCRIBE:
        if (called === allCalled) {
          subscription!(values)
        }
        return subscribe(innerSubject, subscription!)
      case RESET:
        return reset(innerSubject)
      default:
        throw new Error(`unrecognized action ${action}`)
    }
  } as Emitter<any>
}
