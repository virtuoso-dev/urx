import { engine, run, statefulStream, tup } from '../src'

describe('engine', () => {
  it('run executes the factory', () => {
    const a = statefulStream(0)

    const eng = engine(() => {
      return { a }
    })

    const system = run(eng)
    expect(system).toMatchObject({ a })
  })

  it('run initiates the dependencies', () => {
    const a = statefulStream(0)
    const b = statefulStream(0)

    const eng = engine(() => {
      return { a }
    })

    const eng2 = engine(([{ a }]) => {
      return { b, a }
    }, tup(eng))

    const system = run(eng2)
    expect(system).toMatchObject({ a, b })
  })

  it('singleton instantiates the engine only once', () => {
    const engine1 = engine(
      () => {
        const a = statefulStream(0)
        return { a }
      },
      [],
      { singleton: true }
    )

    const engine2 = engine(([{ a }]) => {
      const b = statefulStream(0)
      return { b, a }
    }, tup(engine1))

    const engine3 = engine(([{ a }]) => {
      const c = statefulStream(0)
      return { c, a }
    }, tup(engine1))

    const engine4 = engine(([{ a: a1, b }, { a: a2, c }]) => {
      // console.log(a1, a2)
      expect(a1).toBe(a2)
      return { b, c }
    }, tup(engine2, engine3))

    run(engine4)
  })
})
