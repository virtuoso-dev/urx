import { call, joinProc } from '../src'

describe('utils', () => {
  describe('call', () => {
    it('calls the argument', () => {
      const proc = jest.fn()
      call(proc)
      expect(proc).toHaveBeenCalledTimes(1)
    })
  })

  describe('joinProc', () => {
    it('calls all procs passed', () => {
      const proc1 = jest.fn()
      const proc2 = jest.fn()
      const proc = joinProc(proc1, proc2)
      proc()
      expect(proc1).toHaveBeenCalledTimes(1)
      expect(proc2).toHaveBeenCalledTimes(1)
    })
  })
})
