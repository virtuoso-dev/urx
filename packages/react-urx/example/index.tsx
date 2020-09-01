import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { systemToComponent } from '../src/'
import { tup, system, statefulStream, combineLatest, map, pipe, statefulStreamFromEmitter } from '@virtuoso/urx'
import { useState } from 'react'

// sys1 and sys2 are two simple systems, each exposing a single numeric stream.
const sys1 = system(() => {
  const a = statefulStream(0)
  return { a }
})

const sys2 = system(() => {
  const b = statefulStream(0)
  return { b }
})

// sys3 is a compound system that depends on sys1 and sys2
// it receives their streams in the constructor.
const sys3 = system(([{ a }, { b }]) => {
  // output streams should be stateful
  // - that's why we convert the Emitter coming from the pipe into a stateful stream.
  const sum = statefulStreamFromEmitter(
    pipe(
      combineLatest(a, b),
      map(([a, b]) => {
        return a + b
      })
    ),
    0
  )

  return { a, b, sum }
}, tup(sys1, sys2))

function numValueFromEvent(e: React.ChangeEvent) {
  return parseInt((e.target as HTMLInputElement).value)
}

// systemToComponent creates a react component from sys3
// exposing its streams through hooks, and specifying
// that the `a` stream will receive values through the `a` required component property.
const { Component, usePublisher, useEmitterValue } = systemToComponent(
  sys3,
  {
    required: { a: 'a' },
  },
  () => {
    const setB = usePublisher('b')
    const sum = useEmitterValue('sum')
    const b = useEmitterValue('b')
    return (
      <div>
        <label>
          Input B value: <input value={b} type="number" onChange={e => setB(numValueFromEvent(e))} size={5} />
        </label>
        Sum: {sum}
      </div>
    )
  }
)

const App = () => {
  const [a, setA] = useState(0)
  return (
    <div>
      <input type="range" id="points" name="points" min="0" max="10" value={a} onChange={e => setA(numValueFromEvent(e))} />
      <Component a={a} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
