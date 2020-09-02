---
id: "get-started"
title: "Get Started with urx"
sidebar_label: "Get Started"
---

<p class="lead">
urx is a JS toolkit for UI state management based on the the reactive programming paradigm.
urx ships a set of reactive utilities &ndash; streams, actions, transformers and operators. 
Streams and their relationships are organized in systems and subsystems. 
Stream systems are exposed as React components, connecting its streams 
to properties, methods, events, and hooks for child components. 
</p>

## [urx by Example](./urx-by-example)

As a practical start, the section leads you through building a simple sum React component with urx backend. 

## Thinking in Systems

Borrowing the title from [the seminal book](https://www.goodreads.com/book/show/3828902-thinking-in-systems), 
we scratch the surface on the formal definition of systems and how they are applied to real world problems, 
including the state management of our next UI component.

## Streams Explained

A section focused on the stream types and capabilities available in urx.

## Piping and Operators

Transforming the output of stream(s) into other streams is what most of your code will be. 
In this section, we focus on how piping works and what operators do.

## Stream Systems

This section covers the `system` factory, how `init` works, and how multiple systems can be organized into dependencies.

## urx and React

urx is a framework agnostic tool. react-urx ships a convenient package that maps an urx system to a react component.

## urx for Redux Developers

Spoiler alert - the two don't have much in common. This section gives a very loose mapping between the Redux concepts and the way urx works.

## urx for RxJS Developers

Familiar with RxJS? Read this section first. This section compares the two libraries and maps common concepts from RxJS to their urx counterparts.
