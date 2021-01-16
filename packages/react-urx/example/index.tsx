import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { systemToComponent } from '../src/'
import { system, statefulStream, combineLatest, map, pipe, statefulStreamFromEmitter, init, subscribe, publish } from '@virtuoso.dev/urx'
import { useState } from 'react'

const sys = system(() => {
  const a = statefulStream(0)
  const b = statefulStream(0)

  // construct an emitter summing the two streams.
  const aPlusB = pipe(
    combineLatest(a, b),
    map(([a, b]) => a + b)
  )

  // output streams must be stateful
  // so we convert the emitter to a stateful stream
  const sum = statefulStreamFromEmitter(aPlusB, 0)

  return { a, b, sum }
})

const { a, b, sum } = init(sys)

subscribe(sum, (sum) => console.log({ sum }))
publish(a, 5)
publish(b, 7)

const { Component: SumComponent, usePublisher, useEmitterValue } = systemToComponent(sys, {
  required: { a: 'a' },
})

function numValueFromEvent(e: React.ChangeEvent) {
  return parseInt((e.target as HTMLInputElement).value)
}

const Input = () => {
  const setB = usePublisher('b')
  const sum = useEmitterValue('sum')
  const b = useEmitterValue('b')
  return (
    <div>
      <div>
        <label htmlFor="input-b">Input B value:</label>
        <input type="number" id="input-b" name="input-b" size={5}
               value={b} onChange={(e) => setB(numValueFromEvent(e))} />
      </div>

      <h4>Sum: {sum}</h4>
    </div>
  )
}

const App = () => {
  const [a, setA] = useState(0)
  return (
    <div>
      <label htmlFor="input-a">Input A value:</label>
      <input type="range" id="input-a" name="input-a" min="0" max="10"
             value={a} onChange={(e) => setA(numValueFromEvent(e))} />

      <SumComponent a={a}>
        <Input />
      </SumComponent>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('app'))
