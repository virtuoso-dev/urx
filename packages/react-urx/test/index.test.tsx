import * as React from 'react'
import { createRef, FC } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { connect, engine, map, pipe, statefulStream, statefulStreamFromEmitter, stream } from 'urx'
import { engineToComponent, RefHandle } from '../src'

describe('components from engines', () => {
  let container: any = null

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container)
    container.remove()
    container = null
  })

  const simpleEngine = () =>
    engine(() => {
      const prop = stream<number>()
      const cell = statefulStream(10)
      connect(prop, cell)

      return { prop, cell }
    })

  describe('prop mapping', () => {
    let Component: any
    let Child: any

    beforeEach(() => {
      const e = simpleEngine()

      const { Component: Comp, useEmitterValue } = engineToComponent(e, {
        optional: { prop: 'prop' },
      })

      Child = () => {
        const value = useEmitterValue('cell')
        return <div>{value}</div>
      }
      Component = Comp
    })

    it('maps a property to the component', () => {
      render(
        <Component>
          <Child />
        </Component>,
        container
      )
      expect(container.textContent).toBe('10')
    })

    it('pipes the prop to cell and to the output', () => {
      act(() => {
        render(
          <Component prop={20}>
            <Child />
          </Component>,
          container
        )
      })
      expect(container.textContent).toBe('20')
    })
  })

  it('supports passing root', () => {
    const e = simpleEngine()

    const Root: FC = () => {
      const value = useEmitterValue('cell')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = engineToComponent(
      e,
      {
        optional: { prop: 'prop' },
      },
      Root
    )

    act(() => {
      render(<Comp prop={20} />, container)
    })

    expect(container.textContent).toBe('20')
  })

  it('supports root component with props', () => {
    const e = simpleEngine()

    const Root: FC<{ rootProp: number }> = ({ rootProp }) => {
      const value = useEmitterValue('cell')
      return (
        <div>
          {rootProp} - {value}
        </div>
      )
    }

    const { Component: Comp, useEmitterValue } = engineToComponent(
      e,
      {
        optional: { prop: 'prop' },
      },
      Root
    )

    act(() => {
      render(<Comp prop={20} rootProp={10} />, container)
    })

    expect(container.textContent).toBe('10 - 20')
  })

  it('exposes streams as methods', () => {
    const e = engine(() => {
      const meth = statefulStream(20)
      return { meth }
    })

    const Root: FC = () => {
      const value = useEmitterValue('meth')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = engineToComponent(
      e,
      {
        methods: { meth: 'meth' },
      },
      Root
    )

    const ref = createRef<RefHandle<typeof Comp>>()

    act(() => {
      render(<Comp ref={ref} />, container)
      ref.current!.meth(30)
    })

    expect(container.textContent).toBe('30')
  })

  it('exposes changes in streams as events', () => {
    const e = engine(() => {
      const meth = statefulStream(20)
      const methCalledDouble = statefulStreamFromEmitter(
        pipe(
          meth,
          map(value => value * 2)
        ),
        20
      )
      return { meth, methCalledDouble }
    })

    const Root: FC = () => {
      const value = useEmitterValue('meth')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = engineToComponent(
      e,
      {
        methods: { meth: 'meth' },
        events: { methCalledDouble: 'methCalledDouble' },
      },
      Root
    )

    const ref = createRef<RefHandle<typeof Comp>>()
    const sub = jest.fn()

    act(() => {
      render(<Comp ref={ref} methCalledDouble={sub} />, container)
      ref.current!.meth(30)
    })

    expect(container.textContent).toBe('30')
    expect(sub).toHaveBeenCalledWith(60)
    expect(sub).toHaveBeenCalledTimes(1)
  })
})
