---
id: "urx-vs-redux"
title: "urx for Redux Developers"
sidebar_label: "urx for Redux Developers"
slug: "/urx-vs-redux"
---

<p class="lead">Redux is based on the concept of a single state tree - an object which is the source of truth for the state of the UI.  urx is organised around systems - sets of connected streams which accept input through input streams (Publishers) and emit processed results through output streams (Emitters).</p>

When used in React, react-urx places the instance of a system in a React context, wires up streams to properties and exposes the system inputs and outputs through hooks.
The stream system is static and immutable - it acts as the transformation "engine" which converts input to output.

While not necessary, a system can be (and most likely will be) stateful - stateful streams
and buffering operators and transformers like `combineLatest`, `withLatestFrom` and `merge` allow signals sent through streams to interact with each other, accumulate data, and so on.
However, the state of the system is implicit and not something to focus on - only the relevant values are emitted through the respective output streams.

## System = Tree + Actions + Selectors

The urx system logic is implemented in the input stream subscriptions, which apply incoming data to the existing state and eventually output results to the output streams.
Speaking loosely, input streams subscriptions can be considered the equivalent of actions or state mutators.
As the changes propagate down the system streams, a subset of the newly calculated data is emitted through the output streams.
The transformations that build these emitted values can be thought of as selectors.
