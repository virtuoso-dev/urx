import * as React from 'react'
import { createRef, FC } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import {
  combineLatest,
  connect,
  system,
  map,
  pipe,
  statefulStream,
  statefulStreamFromEmitter,
  stream,
  streamFromEmitter,
  filter,
  duc,
} from '@virtuoso.dev/urx'
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
          duc(meth),
          map((value) => value * 2)
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
  })

  it('works with function properties', () => {
    const e = system(() => {
      const prop = statefulStream(() => 20 as number)
      return { prop }
    })

    const Root: FC = () => {
      const prop = useEmitterValue('prop')
      return <div>{prop()}</div>
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
      e,
      {
        required: { prop: 'prop' },
      },
      Root
    )

    act(() => {
      render(<Comp prop={() => 50} />, container)
    })

    expect(container.textContent).toBe('50')
  })

  it('accepts undefined event handlers', () => {
    const e = system(() => {
      const prop = statefulStream(20)
      return { prop }
    })

    const Root: FC = () => {
      return <div>Foo</div>
    }

    const { Component: Comp } = systemToComponent(
      e,
      {
        events: { prop: 'prop' },
      },
      Root
    )

    act(() => {
      expect(() => {
        render(<Comp prop={undefined} />, container)
      }).not.toThrow()
    })
  })

  it('emits changes caused by prop changes', () => {
    const e = system(() => {
      const prop = statefulStream(20)
      const doubleProp = streamFromEmitter(
        pipe(
          prop,
          map((value) => value * 2)
        )
      )
      return { prop, doubleProp }
    })

    const Root: FC = () => {
      const value = useEmitterValue('prop')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
      e,
      {
        required: { prop: 'prop' },
        events: { doubleProp: 'doubleProp' },
      },
      Root
    )

    const sub = jest.fn()

    act(() => {
      render(<Comp prop={20} doubleProp={sub} />, container)
    })

    expect(container.textContent).toBe('20')
    expect(sub).toHaveBeenCalledWith(40)
    expect(sub).toHaveBeenCalledTimes(1)
  })

  it('skips setup glitches', () => {
    const e = system(() => {
      const prop = statefulStream(2)
      const prop2 = statefulStream(3)
      const propsReady = stream<boolean>()
      const combinedProp = streamFromEmitter(
        pipe(
          combineLatest(prop, prop2, propsReady),
          filter(([, , ready]) => ready),
          map(([p, p2]) => p * p2)
        )
      )

      return { prop, prop2, combinedProp, propsReady }
    })

    const Root: FC = () => {
      const value = useEmitterValue('prop')
      return <div>{value}</div>
    }

    const { Component: Comp, useEmitterValue } = systemToComponent(
      e,
      {
        required: { prop: 'prop', prop2: 'prop2' },
        events: { combinedProp: 'combinedProp' },
      },
      Root
    )

    const sub = jest.fn()

    act(() => {
      render(<Comp prop={3} prop2={4} combinedProp={sub} />, container)
    })

    expect(sub).toHaveBeenCalledWith(12)
    expect(sub).toHaveBeenCalledTimes(1)

    act(() => {
      render(<Comp prop={5} prop2={6} combinedProp={sub} />, container)
    })

    expect(sub).toHaveBeenCalledWith(30)
    expect(sub).toHaveBeenCalledTimes(2)
  })
})
