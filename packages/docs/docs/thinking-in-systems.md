---
id: "thinking-in-systems"
title: "Thinking in Systems"
sidebar_label: "Thinking in Systems"
---

<p className="lead">
urx systems are a stateful <strong>data-processing</strong> machines which accept input through <strong>input streams</strong>, 
init and maintain state in <strong>depots</strong> and, in certain conditions, emit values to subscriptions through <strong>output streams</strong>. 
</p>

## Depots

The first, and probably the most critical part to understand are **the depots** 
mostly because they are somewhat implicit.
Unlike other state management paradigms, the depots are not kept in a single data structure. 
Insted, depots are defined and maintained as stateful streams, stateful transfomers 
like `combineLatest` or stateful operators like `withLatestFrom` or `scan`. 

> In the [urx by example](./urx-by-example) walkthrough, the system uses several stateful streams as depots - `a`, `b`, and `sum`. 

**Depots persist values over time**. 
If it was not for them, the system had to re-receive 
its entire input state simultaneously in order to calculate the values for its output stream. 

Of course, strictly speaking, it is possible to implement a pure, stateless system as a form of a complex map/reduce. urx would not mind that ;).

## Input Streams

The system receives updates from the rest of the world through values published in its input streams. 
The streams used can be either stateless (acting as means to send **signals**) or stateful, where the initial stream state acts as the default value for that system parameter.

> In the [urx by example](./urx-by-example) `a` and `b` are input streams with an initial value of `0`.

The effects of the input streams are up to the system data-processing logic. It can change its depots' state, and/or emit values through its output streams. 

## Data Processing

The actual system behavior is exclusively implemented by **applying transformers and operators** to the input streams, producing the respective output streams. 
In the final state the system streams are organized in a directed graph, where incoming data is routed through certain edges and nodes. 
Simple systems like the one in [urx by example](./urx-by-example) can use a straightforward single-step transformation (in this case, `combineLatest` and `map`), 
while complex ones can introduce multiple intermediate streams to model their logic. 

## Output Streams

The system publishes updates to its clients (other systems or an UI bound to it) by publishing data in its output streams. 
State-reflecting output streams, like `sum` in the [urx by example](./urx-by-example) should use stateful streams as output streams. 
Signal-like output should use regular, stateless streams. In general, stateless input streams tend to have a symmetrical stateless streams, and the opposite. 



## Systems in the UI Component World

urx systems can be exposed as UI **logic provider components** by mapping the system input and output streams to the component input / output points. 
The mappings below are applicable to React, but can be ported to any other 


### Component Props to Streams

| Component Traits | Mapped Stream Type       | Notes                                                                                                                                                                                                                                                                         |
|------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Value properties | Stateful input streams   | Value properties can be thought of as system parameters, which can changeover time.  In practice, such parameters must have some sort of initial value, even if it is undefined.                                                                                              |
| Event properties | Stateless output streams | Component events are special properties which accept callbacks. The mapping applies those callbacks as subscriptions to the specified stream.  It is counter intuitive to fire event handlers upon component initialization,  so you should use stateless streams for events. |
| Methods          | Stateless input streams  | Component methods (limited to a single argument) publish  the passed argument into the specified stream.                                                                                                                                                                         | 

### Hooks to Streams

The resulting provider component does not have UI. Instead, it exposes hooks which allow its child components to interact with the underlying system. 
In React, this happens through the following hooks:

| Hook              | Stream Type             | Notes                                                                                                                                          |
|-------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `useEmitterValue` | Stateful output streams | The hook uses `useState` internally and re-renders the component when the stream emits a value.  Works only with stateful streams.             |
| `useEmitter`      | Output streams          | Calls the specified callback when the stream emits a value. Does not re-render the component,  works with both stateful and stateless streams. |
| `usePublisher`    | Input streams           | Returns a function which can publish the passed argument into the stream.  Works with both stateful and stateless streams.                     |


## Summary
The input / output / depots / data processing categorization above is useful in understanding how to read and design a system on a conceptual level.  
Implementation-wise, streams, transfomers and operators are often multi-functional and act as both input, depots, and data processors. 

Reducing the various component I/O points to streams and modeling their interactions eases implementing complex yet resilient UI components.
