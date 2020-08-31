/**
 * [[system]] is a construction utility to define and initialize sets of connected streams.
 * Systems can list other systems as their dependencies, and optionally act as singletons in the dependency tree.
 *
 * ```ts
 * @import { subscribe, publish, system, init, tup, connect, map, pipe } from 'urx'
 *
 * // a simple system with two streams
 * const sys1 = system(() => {
 *  const a = stream<number>()
 *  const b = stream<number>()
 *
 *  connect(pipe(a, map(value => value * 2)), b)
 *  return { a, b }
 * })
 *
 * // a second system which depends on the streams from the first one
 * const sys2 = system(([ {a, b} ]) => {
 *  const c = stream<number>()
 *  connect(pipe(b, map(value => value * 2)), c)
 *  // re-export the `a` stream, keep `b` internal
 *  return { a, c }
 * }, tup(sys1))
 *
 * // init will recursively initialize sys2 dependencies, in this case sys1
 * const { a, c } = init(sys2)
 * subscribe(c, c => console.log(`Value multiplied by 4`, c))
 * publish(a, 2)
 * ```
 * @packageDocumentation
 */
import { Emitter } from './actions'

/**
 * Systems are a dictionaries of streams. a [[SystemConstructor]] should return a System.
 */
export interface System {
  [key: string]: Emitter<any>
}

/**
 * a SystemSpec is the result from a [[system]] call. To obtain the [[System]], pass the spec to [[init]].
 */
export interface SystemSpec<SS extends SystemSpecs, C extends SystemConstructor<SS>> {
  id: string
  constructor: C
  dependencies: SS
  singleton: boolean
}

/** @internal **/
export type AnySystemSpec = SystemSpec<any, any>

/** @internal **/
export type SystemSpecs = AnySystemSpec[]

/** @internal **/
export type SR<E extends AnySystemSpec, R extends System = ReturnType<E['constructor']>> = R

/** @internal **/
export type SpecResults<SS extends SystemSpecs, L = SS['length']> = L extends 0
  ? []
  : L extends 1
  ? [SR<SS[0]>]
  : L extends 2
  ? [SR<SS[0]>, SR<SS[1]>]
  : L extends 3
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>]
  : L extends 4
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>]
  : L extends 5
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>]
  : L extends 6
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>]
  : L extends 7
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>, SR<SS[6]>]
  : L extends 8
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>, SR<SS[6]>, SR<SS[7]>]
  : L extends 9
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>, SR<SS[6]>, SR<SS[7]>, SR<SS[8]>]
  : L extends 10
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>, SR<SS[6]>, SR<SS[7]>, SR<SS[8]>, SR<SS[9]>]
  : L extends 11
  ? [SR<SS[0]>, SR<SS[1]>, SR<SS[2]>, SR<SS[3]>, SR<SS[4]>, SR<SS[5]>, SR<SS[6]>, SR<SS[7]>, SR<SS[8]>, SR<SS[9]>, SR<SS[10]>]
  : never

/**
 * The system constructor is a function which initializes and connects streams and returns them as a [[System]].
 * If the [[system]] call specifies system dependencies, the constructor receives the dependencies as an array argument.
 */
export type SystemConstructor<D extends SystemSpecs> = (dependencies: SpecResults<D>) => System

/**
 * `system` defines a specification of a system - its constructor, dependencies and if it should act as a singleton in a system dependency tree.
 * When called, system returns a [[SystemSpec]], which is then initialized along with its dependencies by passing it to [[init]].
 *
 * By default, systems will be initialized only once if encountered multiple times in the dependency tree.
 * In the below dependency system tree, systems `b` and `c` will receive the same stream instances from system `a` when system `d` is initialized.
 * ```txt
 *   a
 *  / \
 * b   c
 *  \ /
 *   d
 * ```
 * If system `a` gets `{singleton: false}` as last argument, two separate instances will be created.
 *
 * @param constructor the system constructor function. Initialize and connect the streams in its body.
 *
 * @param dependencies the system dependencies, which the constructor will receive as arguments.
 * Use the [[tup]] utility **For TypeScript type inference to work correctly**.
 * ```ts
 * const sys3 = system(() => { ... }, tup(sys2, sys1))
 * ```
 * @param __namedParameters Options
 * @param singleton should the system act as a singleton in other system dependency tree.
 */
export function system<F extends SystemConstructor<D>, D extends SystemSpecs>(
  constructor: F,
  dependencies: D = ([] as unknown) as D,
  { singleton }: { singleton: boolean } = { singleton: true }
): SystemSpec<D, F> {
  return {
    id: id(),
    constructor,
    dependencies,
    singleton,
  }
}

const id = () => (Symbol() as unknown) as string

/**
 * Initializes a [[SystemSpec]] by recursively initializing its dependencies.
 * @returns the [[System]] constructed by the spec constructor.
 * @param systemSpec the system spec to initialize.
 */
export function init<SS extends AnySystemSpec>(systemSpec: SS): SR<SS> {
  const singletons = new Map<string, System>()
  const _init = <SS extends AnySystemSpec>({ id, constructor, dependencies, singleton }: SS) => {
    if (singleton && singletons.has(id)) {
      return singletons.get(id)! as SR<SS>
    }
    const system = constructor(dependencies.map((e: AnySystemSpec) => _init(e)))
    if (singleton) {
      singletons.set(id, system)
    }
    return system as any
  }
  return _init(systemSpec)
}
