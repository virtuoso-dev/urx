import * as React from 'react'
import { createRef, FC } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { connect, system, map, pipe, statefulStream, statefulStreamFromEmitter, stream } from '@virtuoso.dev/urx'
import { systemToComponent, RefHandle } from '../src'

describe('components from system', () => {
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

  const simpleSystem = () =>
    system(() => {
      const prop = stream<number>()
      const depot = statefulStream(10)
      connect(prop, depot)

      return { prop, depot }
    })

  describe('prop mapping', () => {
    let Component: any
    let Child: any

    beforeEach(() => {
      const e = simpleSystem()

      const { Component: Comp, useEmitterValue } = systemToComponent(e, {
        optional: { prop: 'prop' },
      })

      Child = () => {
        const value = useEmitterValue('depot')
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

    it('pipes the prop to depot and to the output', () => {
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
    const e = simpleSystem()

    const Root: FC = () => {
      const value = useEmitterValue('depot')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
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
    const e = simpleSystem()

    const Root: FC<{ rootProp: number }> = ({ rootProp }) => {
      const value = useEmitterValue('depot')
      return (
        <div>
          {rootProp} - {value}
        </div>
      )
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
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
    const e = system(() => {
      const meth = statefulStream(20)
      return { meth }
    })

    const Root: FC = () => {
      const value = useEmitterValue('meth')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
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
    const e = system(() => {
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

    const { Component: Comp, useEmitterValue } = systemToComponent(
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
