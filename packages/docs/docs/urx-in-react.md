---
id: "urx-in-react"
title: "urx in React"
sidebar_label: "urx in React"
---

import OpenInSandbox from '../src/OpenInSandboxReact';

<p className="lead">
The <code>@virtuoso.dev/react-urx</code> <code>systemToComponent</code> wraps urx systems in UI <strong>logic provider components</strong> by mapping the system input and output streams to the component input/output outlets.
</p>

<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent } from "@virtuoso.dev/react-urx";
import { system, statefulStream } from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(42);
  return { foo };
});

const { Component: MyComponent, useEmitterValue } = systemToComponent(sys, {
  required: { fooProp: "foo" },
});

const Child = () => {
  const foo = useEmitterValue("foo");
  return <div>{foo}</div>;
};

export default function App() {
  return (
    <MyComponent fooProp={42}>
      <Child />
    </MyComponent>
  );
}
```

## Component Props to Streams

`systemToComponent` accepts a [SystemSpec](./api/interfaces/_urx_src_system_.systemspec) and a map object, which lists the component:

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

The example below shows the three types of hooks wired up to a simple system. Press the "open in sandbox button" to see the example in action and tweak it further.

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

## Specifying Root Component

Some React components accept a common set of HTML attributes (e.g. `id`, `style`, `aria-label`, etc.) and pass them to their root element.
This is possible with `systemToComponent` too. Pass a react component (`React.ComponentType`) as a last argument.
While possible, it is not recommended to accept logical properties through that mechanism - use the streams to properties mechanism instead.

**Note:** Explicitly typing the Root component in the example below produces accurate prop typings for the generated component as well.

<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent } from "@virtuoso.dev/react-urx";
import { system, statefulStream } from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(42);
  return { foo };
});

const Root: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const foo = useEmitterValue("foo");
  return <div {...props}>{foo}</div>;
};

const { Component: MyComponent, useEmitterValue } = systemToComponent(
  sys,
  {
    required: { fooProp: "foo" },
  },
  Root
);

export default function App() {
  return <MyComponent fooProp={42} style={{ color: "red" }} />;
}
```

## Typed Component Refs

Interacting with components with methods requires a ref to the component - correctly typing that ref can be tricky.
The package exports `RefHandle` type for that purpose.

<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent, RefHandle } from "@virtuoso.dev/react-urx";
import { system, statefulStream } from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(42);
  return { foo };
});

const Root: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const foo = useEmitterValue("foo");
  return <div {...props}>{foo}</div>;
};

const { Component: MyComponent, useEmitterValue } = systemToComponent(
  sys,
  {
    required: { fooProp: "foo" },
    methods: { setFoo: "foo" },
  },
  Root
);

export default function App() {
  const ref = React.useRef<RefHandle<typeof MyComponent>>();

  return (
    <div>
      <button onClick={() => ref.current.setFoo(35)}>Set Foo to 35</button>
      <MyComponent ref={ref} fooProp={42} />
    </div>
  );
}
```

## Server-Side Rendering

The generated React component publishes its properties to the associated streams in an `useEffect` function body.
This is deliberate: child components may re-render in response to the new values, causing React to throw an exception.
However, this also means that the generated components cannot execute any logic on the server.

To work-around that, specify the streams to accept properties in the body of the root component function through `ssrProps`.

<OpenInSandbox />

```tsx
import * as React from "react";
import { systemToComponent, RefHandle } from "@virtuoso.dev/react-urx";
import { system, statefulStream } from "@virtuoso.dev/urx";

const sys = system(() => {
  const foo = statefulStream(0);
  return { foo };
});

const Root: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const foo = useEmitterValue("foo");
  return <div {...props}>{foo}</div>;
};

const { Component: MyComponent, useEmitterValue } = systemToComponent(
  sys,
  {
    required: { fooProp: "foo" },
    ssrProps: ["foo"],
  },
  Root
);

export default function App() {
  return <MyComponent fooProp={42} />;
}
```

## Summary

Unifying the component I/O points to streams makes it easy to implement complex but resilient React components.
The React components remain relatively simple, while the system specifies the bulk of the logic.
Systems are easy (and fast) to test outside of the React environment.
