---
id: "thinking-in-systems"
title: "Thinking in Systems"
sidebar_label: "Thinking in Systems"
---

<p className="lead">
urx systems are a stateful <strong>data-processing</strong> machines which accept input through <strong>input streams</strong>, 
init and maintain state in <strong>depots</strong> and, in certain conditions, emit values to subscriptions through <strong>output streams</strong>. 
</p>

## System Depots

The first, and probably the most critical part to understand are **the depots** - 
mostly because they often exist in a relatively implicit form. 
Unlike other state management paradigms, the depots are not kept in a single data structure. 
Insted, depots are defined and maintained as stateful streams, stateful transfomers 
like `combineLatest` or stateful operators like `withLatestFrom` or `scan`.

**Depots persist values over time**. 
If it was not for them, the system had to re-receive 
its entire input state simultaneously in order to calculate the values for its output stream. 

In the 

Of course, strictly speaking, it is possible to implement a pure, stateless system as a form of a complex map/reduce construct. urx would not mind that ;).

## Systems in the UI Component World
