import { Emitter } from './interfaces'

export interface StreamSystem {
  [key: string]: Emitter<any>
}

export interface Engine<D extends Engines, F extends EngineFactory<D>> {
  id: string
  factory: F
  dependencies: D
  singleton: boolean
}

export type AnyEngine = Engine<any, any>

export type Engines = AnyEngine[]

export type EngineSystem<E extends AnyEngine, R extends StreamSystem = ReturnType<E['factory']>> = R

export type EnginesSystems<E extends Engines, L = E['length']> = L extends 0
  ? []
  : L extends 1
  ? [EngineSystem<E[0]>]
  : L extends 2
  ? [EngineSystem<E[0]>, EngineSystem<E[1]>]
  : L extends 3
  ? [EngineSystem<E[0]>, EngineSystem<E[1]>, EngineSystem<E[2]>]
  : L extends 4
  ? [EngineSystem<E[0]>, EngineSystem<E[1]>, EngineSystem<E[2]>, EngineSystem<E[3]>]
  : L extends 5
  ? [EngineSystem<E[0]>, EngineSystem<E[1]>, EngineSystem<E[2]>, EngineSystem<E[3]>, EngineSystem<E[4]>]
  : L extends 6
  ? [EngineSystem<E[0]>, EngineSystem<E[1]>, EngineSystem<E[2]>, EngineSystem<E[3]>, EngineSystem<E[4]>, EngineSystem<E[5]>]
  : L extends 7
  ? [
      EngineSystem<E[0]>,
      EngineSystem<E[1]>,
      EngineSystem<E[2]>,
      EngineSystem<E[3]>,
      EngineSystem<E[4]>,
      EngineSystem<E[5]>,
      EngineSystem<E[6]>
    ]
  : L extends 8
  ? [
      EngineSystem<E[0]>,
      EngineSystem<E[1]>,
      EngineSystem<E[2]>,
      EngineSystem<E[3]>,
      EngineSystem<E[4]>,
      EngineSystem<E[5]>,
      EngineSystem<E[6]>,
      EngineSystem<E[7]>
    ]
  : L extends 9
  ? [
      EngineSystem<E[0]>,
      EngineSystem<E[1]>,
      EngineSystem<E[2]>,
      EngineSystem<E[3]>,
      EngineSystem<E[4]>,
      EngineSystem<E[5]>,
      EngineSystem<E[6]>,
      EngineSystem<E[7]>,
      EngineSystem<E[8]>
    ]
  : L extends 10
  ? [
      EngineSystem<E[0]>,
      EngineSystem<E[1]>,
      EngineSystem<E[2]>,
      EngineSystem<E[3]>,
      EngineSystem<E[4]>,
      EngineSystem<E[5]>,
      EngineSystem<E[6]>,
      EngineSystem<E[7]>,
      EngineSystem<E[8]>,
      EngineSystem<E[9]>
    ]
  : L extends 11
  ? [
      EngineSystem<E[0]>,
      EngineSystem<E[1]>,
      EngineSystem<E[2]>,
      EngineSystem<E[3]>,
      EngineSystem<E[4]>,
      EngineSystem<E[5]>,
      EngineSystem<E[6]>,
      EngineSystem<E[7]>,
      EngineSystem<E[8]>,
      EngineSystem<E[9]>,
      EngineSystem<E[10]>
    ]
  : never

export type EngineFactory<D extends Engines> = (dependencies: EnginesSystems<D>) => StreamSystem

export function engine<F extends EngineFactory<D>, D extends Engines>(
  factory: F,
  dependencies: D = ([] as unknown) as D,
  { singleton }: { singleton: boolean } = { singleton: false }
): Engine<D, F> {
  return {
    id: (Symbol() as unknown) as string,
    factory,
    dependencies,
    singleton,
  }
}

export function run<E extends AnyEngine>(
  { id, factory, dependencies, singleton }: E,
  singletonRegistry = new Map<string, StreamSystem>()
): EngineSystem<E> {
  if (singleton && singletonRegistry.has(id)) {
    return singletonRegistry.get(id)! as EngineSystem<E>
  } else {
    const system = factory(dependencies.map((e: AnyEngine) => run(e, singletonRegistry)))
    if (singleton) {
      singletonRegistry.set(id, system)
    }
    return system as any
  }
}
