import { RESET, PUBLISH, SUBSCRIBE, VALUE } from './constants'
import { Emitter, Publisher, Subscription, Unsubscribe, StatefulStream } from './interfaces'
import { curry2to1 } from './utils'

export function subscribe<T>(emitter: Emitter<T>, subscription: Subscription<T>): Unsubscribe {
  return emitter(SUBSCRIBE, subscription)
}

export function publish<T>(publisher: Publisher<T>, value: T) {
  publisher(PUBLISH, value)
}

export function reset(emitter: Emitter<any>) {
  emitter(RESET)
}

export function getValue<T>(cell: StatefulStream<T>): T {
  return cell(VALUE)
}

export function connect<T>(emitter: Emitter<T>, publisher: Publisher<T>) {
  return subscribe(emitter, curry2to1(publisher, PUBLISH))
}

/**
 * Executes the subscription only once, for the next emit
 */
export function handleNext<T>(emitter: Emitter<T>, subscription: Subscription<T>): void {
  const unsub = emitter(SUBSCRIBE, value => {
    unsub()
    subscription(value)
  })
}
