import { PUBLISH, VALUE, SUBSCRIBE, RESET } from './constants'

export interface Publisher<T> {
  (action: PUBLISH, value: T): void
}

export interface Cell<T> {
  (action: VALUE): T
}

export interface Subscription<T> {
  (value: T): any
}

export interface Unsubscribe {
  (): void
}

export interface Emitter<T> {
  (action: SUBSCRIBE, subscription: Subscription<T>): Unsubscribe
  (action: RESET): void
}

export interface Stream<T> extends Publisher<T>, Emitter<T> {
  (action: SUBSCRIBE | PUBLISH | RESET): any // fix for bug with pipe + connect
}

// StatefulStream should extend Cell<T> rather then duplicate the signature, but this somehow causes a bug in TS
export interface StatefulStream<T> extends Publisher<T>, Emitter<T> {
  (action: SUBSCRIBE | PUBLISH | RESET | VALUE): any // fix for bug with pipe + connect
}
