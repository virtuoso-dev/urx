/**
 * react-urx [[systemToComponent]] wraps urx systems in to UI **logic provider components** by mapping the system input and output streams to the component input / output points.
 *
 * ### Simple System wrapped as React Component
 *
 * ```tsx
 * const sys = system(() => {
 *   const foo = statefulStream(42)
 *   return { foo }
 * })
 *
 * const { Component: MyComponent, useEmitterValue } = systemToComponent(sys, {
 *   required: { fooProp: 'foo' },
 * })
 *
 * const Child = () => {
 *   const foo = useEmitterValue('foo')
 *   return <div>{foo}</div>
 * }
 *
 * const App = () => {
 *   return <Comp fooProp={42}><Child /><Comp>
 * }
 * ```
 *
 * ### Component Props to Streams
 *
 * | Component Traits | Mapped Stream Type       | Notes                                                                                                                                                                                                                                                                         |
 * |------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 * | Value properties | Stateful input streams   | Value properties can be thought of as system parameters, which can change over time.  In practice, such parameters must have some sort of initial value, even if it is undefined.                                                                                              |
 * | Event properties | Stateless output streams | Component events are special properties which accept callbacks. The mapping applies those callbacks as subscriptions to the specified stream.  It is counter intuitive to fire event handlers upon component initialization,  so you should use stateless streams for events. |
 * | Methods          | Stateless input streams  | Component methods (limited to a single argument) publish  the passed argument into the specified stream.                                                                                                                                                                         |
 *
 * ### Hooks to Streams
 *
 * The resulting provider component does not have UI. Instead, it exposes hooks which allow its child components to interact with the underlying system.
 * In React, this happens through the following hooks:
 *
 * | Hook              | Stream Type             | Notes                                                                                                                                          |
 * |-------------------|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
 * | `useEmitterValue` | Stateful output streams | The hook uses `useState` internally and re-renders the component when the stream emits a value.  Works only with stateful streams.             |
 * | `useEmitter`      | Output streams          | Calls the specified callback when the stream emits a value. Does not re-render the component,  works with both stateful and stateless streams. |
 * | `usePublisher`    | Input streams           | Returns a function which can publish the passed argument into the stream.  Works with both stateful and stateless streams.                     |
 *
 * Reducing the various component I/O points to streams and modeling their interactions
 * eases implementing complex yet resilient UI components and allows testing of the component logic outside
 * the React lifecycle.
 *
 * @packageDocumentation
 */
import * as React from 'react'
import {
  ComponentType,
  createContext,
  createElement,
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import {
  AnySystemSpec,
  reset,
  curry1to0,
  curry2to1,
  Emitter,
  SR,
  eventHandler,
  getValue,
  publish,
  Publisher,
  init,
  StatefulStream,
  Stream,
  subscribe,
} from '@virtuoso.dev/urx'

/** @internal */
interface Dict<T> {
  [key: string]: T
}

/** @internal */
function omit<O extends Dict<any>, K extends readonly string[]>(keys: K, obj: O): Omit<O, K[number]> {
  var result = {} as Dict<any>
  var index = {} as Dict<1>
  var idx = 0
  var len = keys.length

  while (idx < len) {
    index[keys[idx]] = 1
    idx += 1
  }

  for (var prop in obj) {
    if (!index.hasOwnProperty(prop)) {
      result[prop] = obj[prop]
    }
  }

  return result as any
}

/** @internal */
export type Observable<T> = Emitter<T> | Publisher<T>

/**
 * Describes the mapping between the system streams and the component properties.
 * Each property (except `ssrProps`) uses the keys as the names of the properties and the values as the corresponding stream names.
 * @typeParam SS the type of the system.
 */
export interface SystemPropsMap<SS extends AnySystemSpec, K = keyof SR<SS>, D = { [key: string]: K }> {
  /**
   * Specifies the required component properties.
   */
  required?: D
  /**
   * Specifies the optional component properties.
   */
  optional?: D
  /**
   * Specifies the component methods, if any. Streams are converted to methods with a single argument.
   * When invoked, the method publishes the value of the argument to the specified stream.
   */
  methods?: D
  /**
   * Specifies the component "event" properties, if any.
   * Event properties accept callback functions which get executed when the stream emits a new value.
   */
  events?: D
  /**
   * Specifies the streams which should get their values from props during server side rendering.
   * By default, property values are transferred to their respective streams in an `useEffect` hook.
   * The SSR ones will be set in the function component body.
   * Be careful using SSR props, and use them only for "static" props. If setting an SSR prop re-renders a child component, React will throw an exception.
   */
  ssrProps?: K[]
}

/** @internal */
export type PropsFromPropMap<E extends AnySystemSpec, M extends SystemPropsMap<E>> = {
  [K in Extract<keyof M['required'], string>]: M['required'][K] extends string
    ? SR<E>[M['required'][K]] extends Observable<infer R>
      ? R
      : never
    : never
} &
  {
    [K in Extract<keyof M['optional'], string>]?: M['optional'][K] extends string
      ? SR<E>[M['optional'][K]] extends Observable<infer R>
        ? R
        : never
      : never
  } &
  {
    [K in Extract<keyof M['events'], string>]?: M['events'][K] extends string
      ? SR<E>[M['events'][K]] extends Observable<infer R>
        ? (value: R) => void
        : never
      : never
  }

/** @internal */
export type MethodsFromPropMap<E extends AnySystemSpec, M extends SystemPropsMap<E>> = {
  [K in Extract<keyof M['methods'], string>]: M['methods'][K] extends string
    ? SR<E>[M['methods'][K]] extends Observable<infer R>
      ? (value: R) => void
      : never
    : never
}

/**
 * Used to correctly specify type refs for system components
 *
 * ```tsx
 * const s = system(() => { return { a: statefulStream(0) } })
 * const { Component } = systemToComponent(s)
 *
 * const App = () => {
 *  const ref = useRef<RefHandle<typeof Component>>()
 *  return <Component ref={ref} />
 * }
 * ```
 *
 * @typeParam T the type of the component
 */
export type RefHandle<T> = T extends ForwardRefExoticComponent<RefAttributes<infer Handle>> ? Handle : never

/**
 * Converts a system spec to React component by mapping the system streams to component properties, events and methods. Returns hooks for querying and modifying
 * the system streams from the component's child components.
 * @param systemSpec The return value from a [[system]] call.
 * @param map The streams to props / events / methods mapping Check [[SystemPropsMap]] for more details.
 * @param Root The optional React component to render. By default, the resulting component renders nothing, acting as a logical wrapper for its children.
 * @returns an object containing the following:
 *  - `Component`: the React component.
 *  - `useEmitterValue`: a hook that lets child components use values emitted from the specified output stream.
 *  - `useEmitter`: a hook that calls the provided callback whenever the specified stream emits a value.
 *  - `usePublisher`: a hook which lets child components publish values to the specified stream.
 *  <hr />
 */
export function systemToComponent<SS extends AnySystemSpec, M extends SystemPropsMap<SS>, S extends SR<SS>, R>(
  systemSpec: SS,
  map: M,
  Root?: R
) {
  const requiredPropNames = Object.keys(map.required || {})
  const optionalPropNames = Object.keys(map.optional || {})
  const methodNames = Object.keys(map.methods || {})
  const eventNames = Object.keys(map.events || {})
  const Context = createContext<SR<SS>>(({} as unknown) as any)

  type RootCompProps = R extends ComponentType<infer RP> ? RP : { children?: ReactNode }
  type CompProps = PropsFromPropMap<SS, M> & RootCompProps

  type CompMethods = MethodsFromPropMap<SS, M>

  /**
   * A React component generated from an urx system
   */
  const Component = forwardRef<CompMethods, CompProps>((propsWithChildren, ref) => {
    const { children, ...props } = propsWithChildren as any
    const [system] = useState(curry1to0(init, systemSpec))
    const [handlers] = useState(() => {
      return eventNames.reduce((handlers, eventName) => {
        handlers[eventName] = eventHandler(system[map.events![eventName]])
        return handlers
      }, {} as { [key: string]: Emitter<any> })
    })

    for (const ssrProp of map.ssrProps || []) {
      if (ssrProp in props) {
        const stream = system[ssrProp]
        publish(stream, (props as any)[ssrProp])
      }
    }

    useEffect(() => {
      for (const requiredPropName of requiredPropNames.filter(value => !map.ssrProps?.includes(value))) {
        const stream = system[map.required![requiredPropName]]
        publish(stream, (props as any)[requiredPropName])
      }

      for (const optionalPropName of optionalPropNames.filter(value => !map.ssrProps?.includes(value))) {
        if (optionalPropName in props) {
          const stream = system[map.optional![optionalPropName]]
          publish(stream, (props as any)[optionalPropName])
        }
      }

      for (const eventName of eventNames) {
        if (eventName in props) {
          subscribe(handlers[eventName], props[eventName])
        }
      }

      if (system['propsReady']) {
        publish(system['propsReady'], true)
      }

      return () => {
        Object.values(handlers).map(handler => reset(handler))
      }
    }, [props, handlers, system])

    const methodDefs = methodNames.reduce((acc, methodName) => {
      ;(acc as any)[methodName] = (value: any) => {
        const stream = system[map.methods![methodName]]
        publish(stream, value)
      }
      return acc
    }, {} as CompMethods)

    useImperativeHandle(ref, () => methodDefs)

    return createElement(
      Context.Provider,
      { value: system },
      Root
        ? createElement(
            (Root as unknown) as ComponentType,
            omit([...requiredPropNames, ...optionalPropNames, ...eventNames], props),
            children
          )
        : children
    )
  })

  const usePublisher = <K extends keyof S>(key: K) => {
    return curry2to1(publish, React.useContext(Context)[key]) as (value: S[K] extends Stream<infer R> ? R : never) => void
  }

  /**
   * Returns the value emitted from the stream.
   */
  const useEmitterValue = <K extends keyof S, V = S[K] extends StatefulStream<infer R> ? R : never>(key: K) => {
    const context = useContext(Context)
    const source: StatefulStream<V> = context[key]
    const initialValue = getValue(source)

    // The boxing value to { value } is because functions (and initialValue may be a callback)
    // are treated specially when used with useState
    const [state, setState] = useState({ value: initialValue })

    useEffect(
      () =>
        subscribe(source, (value: V) => {
          if (value !== state.value) {
            setState({ value })
          }
        }),
      [source, state]
    )

    return state.value
  }

  const useEmitter = <K extends keyof S, V = S[K] extends Stream<infer R> ? R : never>(key: K, callback: (value: V) => void) => {
    const context = useContext(Context)
    const source: Stream<V> = context[key]
    useEffect(() => subscribe(source, callback), [callback, source])
  }

  return {
    Component,
    usePublisher,
    useEmitterValue,
    useEmitter,
  }
}
