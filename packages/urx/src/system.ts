import { Emitter } from './interfaces'

export interface System {
  [key: string]: Emitter<any>
}

export interface SystemSpec<SS extends SystemSpecs, C extends SystemConstructor<SS>> {
  id: string
  constructor: C
  dependencies: SS
  singleton: boolean
}

export type AnySystemSpec = SystemSpec<any, any>

export type SystemSpecs = AnySystemSpec[]

export type SR<E extends AnySystemSpec, R extends System = ReturnType<E['constructor']>> = R

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

export type SystemConstructor<D extends SystemSpecs> = (dependencies: SpecResults<D>) => System

export function system<F extends SystemConstructor<D>, D extends SystemSpecs>(
  constructor: F,
  dependencies: D = ([] as unknown) as D,
  { singleton }: { singleton: boolean } = { singleton: true }
): SystemSpec<D, F> {
  return {
    id: (Symbol() as unknown) as string,
    constructor,
    dependencies,
    singleton,
  }
}

export function init<SS extends AnySystemSpec>(
  { id, constructor, dependencies, singleton }: SS,
  singletonRegistry = new Map<string, System>()
): SR<SS> {
  if (singleton && singletonRegistry.has(id)) {
    return singletonRegistry.get(id)! as SR<SS>
  } else {
    const system = constructor(dependencies.map((e: AnySystemSpec) => init(e, singletonRegistry)))
    if (singleton) {
      singletonRegistry.set(id, system)
    }
    return system as any
  }
}
