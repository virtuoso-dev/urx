---
id: "urx-by-example"
title: "urx by example"
sidebar_label: "urx by Example"
---

<p class="lead">
Before diving deeper, let's accomplish a small victory with a simple, end-to-end practical walkthrough.
In this section, we will build an urx-based React component that sums two numbers and displays the result.
</p>

## Build a Stream System

Let's start by translating the requirements to a stream system.
In this case, the system consist of two input streams (`a` and `b`), and one output stream - `sum`.
For the initial version, `a` and `b` can start with default values of `0`.

```tsx
import {
  system,
  statefulStream,
  combineLatest,
  map,
  pipe,
  statefulStreamFromEmitter,
} from "@virtuoso/urx";

const sumSystem = system(() => {
  // stateful streams start wtih an initial value
  const a = statefulStream(0);
  const b = statefulStream(0);

  // construct an emitter summing the two streams.
  const aPlusB = pipe(
    combineLatest(a, b),
    map(([a, b]) => a + b)
  );

  // output streams must be stateful
  // so we convert the emitter to a stateful stream
  const sum = statefulStreamFromEmitter(aPlusB, 0);

  return {
    // input
    a,
    b,
    // output
    sum,
  };
});
```

`sumSystem` is the implementation of our sum logic - it constructs the necessary input and
output streams and wires up the relationships between them using the `pipe` and `combineLatest` transformers and the `map` operator.
We also converted the resulting `aPlusB` emitter into a stateful stream, so that it always emits a value.

## Testing a System

Let's poke the resulting system to get a feeling of how it works. We will import `init`, `subscribe`, and `publish` actions.
In a production project, this should be part of our unit test suite.

```tsx
import {
  system,
  statefulStream,
  combineLatest,
  map,
  pipe,
  statefulStreamFromEmitter,
  init,
  subscribe,
  publish,
} from "@virtuoso/urx";

// ... code from above

const { a, b, sum } = init(sumSystem);

subscribe(sum, (sum) => console.log({ sum }));

publish(a, 5);
publish(b, 7);
```

The above snippet will call the subscription (`console.log`) three times - with `0`, `5`, and `12`.

## System to React Component

Next, we will expose our system as a React component. As a twist,
our component will accept the `a` as a component property, while `b` is going to come from an user input,
from an UI rendered by a child component.

```tsx
import {
  system,
  statefulStream,
  combineLatest,
  map,
  pipe,
  statefulStreamFromEmitter,
  init,
  subscribe,
  publish,
  systemToComponent,
} from "@virtuoso/urx";

//...
const {
  Component: SumComponent,
  usePublisher,
  useEmitterValue,
} = systemToComponent(sys, {
  // expose the `a` stream as a required `a` property of the component.
  // keys are the names of the properties, values are the names of the streams.
  required: { a: "a" },
});

// the Input component accesses the `a`, `b` and `sum` streams through I/O hooks.
const Input = () => {
  const setB = usePublisher("b");
  const sum = useEmitterValue("sum");
  const b = useEmitterValue("b");
  return (
    <div>
      <label>
        Input B value:{" "}
        <input
          value={b}
          type="number"
          onChange={(e) => setB(numValueFromEvent(e))}
          size={5}
        />
      </label>
      Sum: {sum}
    </div>
  );
};
```

## Putting it all Together

The final step is to render the resulting components. To demonstrate how the SumComponent handles the change of the `a` property,
we will wire it up to an `input type="range"`.

```tsx
// ...
const App = () => {
  const [a, setA] = useState(0);
  return (
    <div>
      <input
        type="range"
        id="points"
        name="points"
        min="0"
        max="10"
        value={a}
        onChange={(e) => setA(numValueFromEvent(e))}
      />
      <SumComponent a={a}>
        <Input />
      </SumComponent>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```

And, that's it! below, you can find the complete source - open it in CodeSandbox and tweak some of it for more interactive learning.

```tsx sandbox="true"
import * as React from "react";
import * as ReactDOM from "react-dom";
import { systemToComponent } from "../src/";
import {
  system,
  statefulStream,
  combineLatest,
  map,
  pipe,
  statefulStreamFromEmitter,
  init,
  subscribe,
  publish,
} from "@virtuoso/urx";
import { useState } from "react";

const sumSystem = system(() => {
  const a = statefulStream(0);
  const b = statefulStream(0);

  const aPlusB = pipe(
    combineLatest(a, b),
    map(([a, b]) => a + b)
  );

  // output streams must be stateful
  // so we convert the emitter to a stateful stream
  const sum = statefulStreamFromEmitter(aPlusB, 0);

  return { a, b, sum };
});

const { a, b, sum } = init(sys);

subscribe(sumSystem, (sum) => console.log({ sum }));
publish(a, 5);
publish(b, 7);

const {
  Component: SumComponent,
  usePublisher,
  useEmitterValue,
} = systemToComponent(sumSystem, {
  required: { a: "a" },
});

function numValueFromEvent(e: React.ChangeEvent) {
  return parseInt((e.target as HTMLInputElement).value);
}

const Input = () => {
  const setB = usePublisher("b");
  const sum = useEmitterValue("sum");
  const b = useEmitterValue("b");
  return (
    <div>
      <label>
        Input B value:{" "}
        <input
          value={b}
          type="number"
          onChange={(e) => setB(numValueFromEvent(e))}
          size={5}
        />
      </label>
      Sum: {sum}
    </div>
  );
};

const App = () => {
  const [a, setA] = useState(0);
  return (
    <div>
      <input
        type="range"
        id="points"
        name="points"
        min="0"
        max="10"
        value={a}
        onChange={(e) => setA(numValueFromEvent(e))}
      />
      <SumComponent a={a}>
        <Input />
      </SumComponent>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
```
