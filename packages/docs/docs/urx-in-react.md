---
id: "urx-in-react"
title: "urx in React"
sidebar_label: "urx in React"
---

import OpenInSandbox from '../src/OpenInSandboxReact';

<p className="lead">
The `@virtuoso.dev/react-urx` `systemToComponent` wraps urx systems in UI **logic provider components** by mapping the system input and output streams to the component input / output points.
</p>


<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent } from "@virtuoso.dev/react-urx";
import { system, statefulStream, } from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(42)
  return { foo }
})

const { Component: MyComponent, useEmitterValue } = systemToComponent(sys, {
  required: { fooProp: 'foo' },
})

const Child = () => {
  const foo = useEmitterValue('foo')
  return <div>{foo}</div>
}

export default function App() {
  return <MyComponent fooProp={42}><Child /></MyComponent>
}
```

## Component Props to Streams

`systemToComponent` accepts a [SystemSpec](./interfaces/_urx_src_system_.systemspec) and a map object, which lists the component:

- required properties
- optional properties
- event properties
- methods

The function does not do a formal check if the specified streams are suitable for the type of property.
Check the table below for what kind of stream works for what kind of property.

| Component Traits | Mapped Stream Type                   | Notes                                                                                                                                                                                                                                                                       |
| ---------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Value properties | Stateful input streams (Publishers)  | Value properties can be thought of as system parameters, which can change over time. In practice, such parameters must have some sort of initial value, even if it is undefined.                                                                                            |
| Event properties | Stateless output streams (Emitters)  | Component events are special properties which accept callbacks. The mapping applies those callbacks as subscriptions to the specified stream. It is counter intuitive to fire event handlers upon component initialization, so you should use stateless streams for events. |
| Methods          | Stateless input streams (Publishers) | Component methods (limited to a single argument) publish the passed argument into the specified stream.                                                                                                                                                                     |

## Hooks to Streams

The resulting React component does not render UI. Instead, it exposes hooks which allow its child components to interact with the underlying system.
In React, this happens through the following hooks:

| Hook              | Stream Type             | Notes                                                                                                                                         |
| ----------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `useEmitterValue` | Stateful output streams | The hook uses `useState` internally and re-renders the component when the stream emits a value. Works only with stateful streams.             |
| `useEmitter`      | Output streams          | Calls the specified callback when the stream emits a value. Does not re-render the component, works with both stateful and stateless streams. |
| `usePublisher`    | Input streams           | Returns a function which can publish the passed argument into the stream. Works with both stateful and stateless streams.                     |

#### Hooks Example

The example below shows the three types of hooks wired up to a simple system. Press the "open in sandbox button" to fiddle with it further.


<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent } from "@virtuoso.dev/react-urx";

import {
  system,
  statefulStream,
  map,
  pipe,
  statefulStreamFromEmitter,
} from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(2);

  const bar = statefulStreamFromEmitter(
    pipe(
      foo,
      map((value) => value * 2)
    ),
    4
  );

  return {
    // input
    foo,
    // output
    bar,
  };
});

const {
  Component,
  useEmitter,
  usePublisher,
  useEmitterValue,
} = systemToComponent(sys, {
  optional: { foo: "foo" },
});

const Child1 = () => {
  const fooValue = useEmitterValue("foo");
  return <div>{fooValue}</div>;
};

const Child2 = () => {
  useEmitter("bar", (value) => console.info(value));
  return (
    <div>
      <hr /> Open the console to see bar value
    </div>
  );
};

const Child3 = () => {
  const changeFooTo = usePublisher("foo");
  return (
    <div>
      <hr />
      <button onClick={() => changeFooTo(33)}>Change foo to 33</button>
    </div>
  );
};

export default function App() {
  return (
    <Component foo={42}>
      <Child1 />
      <Child2 />
      <Child3 />
    </Component>
  );
}
```

### Summary

Reducing the various component I/O points to streams and modeling their interactions
eases implementing complex yet resilient UI components and allows testing of the component logic outside
the React lifecycle.

```

```
