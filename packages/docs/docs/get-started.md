---
id: "get-started"
title: "Get Started with urx"
sidebar_label: "Get Started"
slug: "/get-started"
---

<p className="lead">
urx is a JS toolkit for UI state management based on the the reactive programming paradigm.
urx ships a set of reactive utilities &ndash; streams, actions, transformers and operators. 
Streams and their relationships are organized in systems and subsystems. 
Stream systems are exposed as React components, connecting its streams 
to properties, methods, events, and hooks for child components. 
</p>

## [urx by Example](./urx-by-example)

As a practical start, the section leads you through building a simple sum React component with urx backend. 

## [Streams](api/modules/_urx_src_streams_)

Streams are the basic building blocks of a reactive system. Understanding their principles and the implementation provided by urx.

## [Piping and Operators](api/modules/_urx_src_pipe_)

Transforming the output of stream(s) into other streams is what most of your code will be. 
In this section, we focus on how pipe works and what operators do.

## [Transfomers](api/modules/_urx_src_transformers_)

Similar to operators, transformers are utilities which operate on multiple streams. Learn how to use `combineLatest` and `merge`.

## [Systems](api/modules/_urx_src_system_)

The section explains systems on a conceptual level and how they are applied to real world problems. 
Next, we cover the `system` factory function, how to `init` systems, 
and how multiple systems can be organized into dependencies.

## [urx in React](./urx-in-react)

React-urx implements `systemToComponent` function that wraps urx systems as logic provider React components, mapping streams to properties and hooks.

## [urx for Redux Developers](./urx-vs-redux)

Spoiler alert - the two don't have much in common. This section gives a very loose mapping between the Redux concepts and the way urx works.

## [urx for RxJS Developers](./urx-vs-rxjs)

Familiar with RxJS? Read this section first. This section compares the two libraries and maps common concepts from RxJS to their urx counterparts.
