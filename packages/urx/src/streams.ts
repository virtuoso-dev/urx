/**
 * Streams are the basic building blocks of a reactive system. Any stream instance acts as both an [[Emitter]] and [[Publisher]], and allows multiple subscriptions to its values.
 *
 * Stateful streams are used to maintain the state of the system - they persist the last passed value, immediately publising it to any new subscription.
 *
 * Event handlers are suitable for exposing event properties for UI Components, allowing only one subscription at a time.
 *
 * @packageDocumentation
 */
import { subscribe, connect } from './actions'
import { RESET, PUBLISH, SUBSCRIBE, VALUE } from './constants'
import { Emitter, StatefulStream, Stream, Subscription, Unsubscribe } from './interfaces'
import { tap } from './utils'

export function stream<T>(): Stream<T> {
  const subscriptions = [] as Subscription<T>[]

  return ((action: PUBLISH | SUBSCRIBE | RESET, arg: any) => {
    switch (action) {
      case RESET:
        subscriptions.splice(0, subscriptions.length)
        return
      case SUBSCRIBE:
        subscriptions.push(arg)
        return () => {
          subscriptions.splice(subscriptions.indexOf(arg), 1)
        }
      case PUBLISH:
        subscriptions.slice().forEach(subscription => {
          subscription(arg as T)
        })
        return
      default:
        throw new Error(`unrecognized action ${action}`)
    }
  }) as Stream<T>
}

export function statefulStream<T>(initial: T): StatefulStream<T> {
  let value: T = initial
  const innerSubject = stream<T>()

  return ((action: PUBLISH | SUBSCRIBE | RESET | VALUE, arg: any) => {
    switch (action) {
      case SUBSCRIBE:
        const subscription = arg as Subscription<T>
        subscription(value)
        break
      case PUBLISH:
        value = arg as T
        break
      case VALUE:
        return value
    }
    return innerSubject(action as any, arg)
  }) as StatefulStream<T>
}

export function eventHandler<T>(emitter: Emitter<T>) {
  let unsub: Unsubscribe | undefined

  return function(action: SUBSCRIBE | RESET, subscription?: Subscription<T>) {
    unsub && unsub()
    switch (action) {
      case SUBSCRIBE:
        unsub = subscribe(emitter, subscription!)
        return unsub
      case RESET:
        return
      default:
        throw new Error(`unrecognized action ${action}`)
    }
  } as Emitter<T>
}

export function streamFromEmitter<T>(emitter: Emitter<T>): Stream<T> {
  return tap(stream<T>(), stream => connect(emitter, stream))
}

export function statefulStreamFromEmitter<T>(emitter: Emitter<T>, initial: T): StatefulStream<T> {
  return tap(statefulStream(initial), stream => connect(emitter, stream))
}
