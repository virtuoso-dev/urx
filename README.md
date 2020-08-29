# urx: Stream-Based Reactive State Management Library

urx (pronounced [ju:reks], like Durex) is a minimal, opinionated state management library based on the [Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming) paradigm.

urx is designed to be:

- Simple and intuitive;
- Tiny sized, suitable for embedding in other libraries;
- Extensively documented;
- Typescript-native;
- Extensible

urx can be used as a standalone library, or as a state manager framework for React components.

## What's urx Suitable For?

urx is especially useful when a complex state management with input parameters which vary independently over time.
The reactive programming model enforced by the library abstracts sync / async operations and the different inputs' change sequence.

## urx in 3 Minutes

urx implements **data streams** - primitives which support publishing data to one or more subscriptions.

```ts
import { stream, publish, subscribe } from 'urx'
const myStream = stream<number>()

subscribe(myStream, (value) => console.log(`#1 got ${value}`))
subscribe(myStream, (value) => console.log(`#2 got ${value}`))
publish(myStream, 2)
```

Streams are either **stateless** or **stateful**. Stateless streams pass the data to existing subscriptions when published. Stateful streams remember the last published value and immediately publish it to new subscriptions.

```ts
import { stream, publish, subscribe } from 'urx'
// stateful streams always start with an initial value
const myStatefulStream = statefulStream(2)

subscribe(myStream, (value) => console.log(`#1 got ${value}`))
subscribe(myStream, (value) => console.log(`#2 got ${value}`))
publish(myStream, 3)
```

**Actions**, like `publish` and `subscribe` operate with streams and values.

Stream values can be transformed and controlled by **piping** through **operators**. urx includes several operators like `map`, `filter`, `scan`, and `throttleTime`. The `withLatestFrom` operator allows the combination of values from other streams.

```ts
import { stream, publish, subscribe, map } from 'urx'
const myStream = stream<number>()
// the return value of pipe is an emitter - the "output end" of a stream.
// emitters be subscribed to, but not published in.
// pipe accepts one or more operators as arguments.
const streamX2 = pipe(
  myStream,
  map((value) => value * 2)
)

subscribe(streamX2, (value) => console.log(`got ${value}`))
publish(myStream, 2)
```

In addition to `pipe`, urx ships a few more **stream transformers** like `connect`, `combineLatest` and `merge`.

```ts
import { stream, publish, subscribe, map } from 'urx'
const stream1 = stream<number>()
const stream2 = stream<number>()

subscribe(merge(stream1, stream2), (value) => console.log(`got ${value}`)) // 2, 3
subscribe(combineLatest(stream1, stream2), (value) => console.log(`got ${value}`)) // [2, 3]
publish(stream1, 2)
publish(stream2, 3)
```

## Stream Systems

![A reactive program](https://user-images.githubusercontent.com/13347/90911290-6e8b6f80-e3e1-11ea-8e9e-e9cd54579b22.png)

&mdash; A relatively simple reactive system (credit: [Wonderopolis](https://wonderopolis.org/wonder/what-is-a-rube-goldberg-machine))

Reactive programs implement their logic as **graphs** from input and output streams, combined and connected through operators and transformers.
urx refers to these graphs as **systems** and provides a construction utility, called `system`.
`system` is a function which has one required parameter: a constructor function that must return a map of streams.

The example below implements an system with two input streams and one output stream that sums the two inputs.

```ts
import { stream, publish, subscribe, map, run, system } from 'urx'

const sum = system(() => {
  const a = stream<number>()
  const b = stream<number>()

  const result = pipe(
    combineLatest(a, b),
    map(([a, b]) => a + b)
  )

  return {
    // a and b are the input streams
    a,
    b,
    // result is the output stream
    result,
  }
})

const { a, b, result } = run(sum)

subscribe(result, (value) => console.log(value)) // 5
publish(a, 2)
publish(b, 3)
```

The `system` function implements a **dependency injection** mechanism, allowing systems to specify other systems as dependencies. This allows decomposing complex systems into smaller, testable chunks.
The example below breaks apart the previous logic into three separate systems.

```ts
import { stream, publish, subscribe, map, run, system, tup } from 'urx'

const aSys = system(() => {
  const a = stream<number>()
  return { a }
})

const bSys = system(() => {
  const b = stream<number>()
  return { b }
})

const sum = system(([{ a }, { b }]) => {
  const result = pipe(
    combineLatest(a, b),
    map(([a, b]) => a + b)
  )
  return { a, b, result }
  // tup is a typescript utility for constructing tuples.
  // If you use plain JS, you can pass [aSys, bSys] instead.
  // see https://stackoverflow.com/a/52445008/1009797
}, tup(aSys, bSys))

// run will first instantiate an instance of aSys and bSys,
// and then pass their systems as arguments to the sum constructor.
const { a, b, result } = run(sum)
```

## Installation

## urx and React

## urx for RxJS Developers

## Credits

urx borrows concepts and ideas from [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview) and [Callbag](https://github.com/callbag/callbag).
