import { RESET, PUBLISH, SUBSCRIBE, VALUE } from './constants'
import { Emitter, Publisher, Subscription, Unsubscribe, StatefulStream } from './interfaces'
import { curry2to1 } from './utils'

/**
 * Subscribes the specified [[Subscription]] to the updates from the Emitter.
 */
export function subscribe<T>(emitter: Emitter<T>, subscription: Subscription<T>): Unsubscribe {
  return emitter(SUBSCRIBE, subscription)
}

/**
 * Publishes the passed value in the [[Publisher]].
 */
export function publish<T>(publisher: Publisher<T>, value: T) {
  publisher(PUBLISH, value)
}

/**
 * Clears all subscriptions from the [[Emitter]].
 */
export function reset(emitter: Emitter<any>) {
  emitter(RESET)
}

/**
 * Gets the value currently stored in the stateful stream.
 */
export function getValue<T>(depot: StatefulStream<T>): T {
  return depot(VALUE)
}

/**
 * Connects the two streams - any value emitted from the emitter will be published in the publisher.
 */
export function connect<T>(emitter: Emitter<T>, publisher: Publisher<T>) {
  return subscribe(emitter, curry2to1(publisher, PUBLISH))
}

/**
 * Executes the passed subscription at most once, for the next emit from the emitter.
 */
export function handleNext<T>(emitter: Emitter<T>, subscription: Subscription<T>) {
  const unsub = emitter(SUBSCRIBE, value => {
    unsub()
    subscription(value)
  })
  return unsub
}
