---
id: "urx-vs-rxjs"
title: "urx for RxJS Developers"
sidebar_label: "urx for RxJS Developers"
slug: "/urx-vs-rxjs"
---

<p class="lead">RxJS is general purpose, mature, extremely popular, favors OOP style, and ships a myriad of operators. 
Urx is several times smaller, picks subjectively easier names for concepts, is purely functional, prescribes tools for building stream systems, and comes with a react adapter. Urx does not implement finite streams and error handlers.</p>

The first version of [React Virtuoso](https://virtuoso.dev/) component was actually built with RxJS;
one of the first criticisms received was that the cost of adding RxJS to the bundle was too high for the final size of the applications. Hence, a poor mans implementation of RxJS was born.

If you are familiar with RxJS terms, the following mapping can help you quickly grasp urx:

| Urx            | RxJS                 |
| -------------- | -------------------- |
| Stream         | Subject              |
| StatefulStream | BehaviorSubject      |
| Pipe           | Observable.pipe      |
| Publish        | Subject.next         |
| Subscribe      | Observable.subscribe |
| Connect        | Observable.subscribe |

Most urx operators and transformers are named after their functional equivalents in RxJS.

## Should I migrate from RxJS to urx?

The answer of this question depends on what you use RxJS for and how much you use from it. urx ships only a small subset of all RxJS capabilities; there's no point in moving to it if you are going to end up reimplementing a bunch of operators you are missing.

This being said, you can certainly get some inspiration from the way urx integrates with React. For example, the react-urx adapter can easily be ported to produce components managed by RxJS based systems.
