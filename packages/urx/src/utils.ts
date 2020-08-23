export function compose<I, A>(a: (arg: A) => any, b: (arg: I) => A) {
  return (arg: I) => a(b(arg))
}

/**
 * Takes a value and applies a function to it
 */
export function thrush<I, K>(arg: I, proc: (arg: I) => K) {
  return proc(arg)
}

export function curry2to1<T, K, R>(proc: (arg1: T, arg2: K) => R, arg1: T): (arg2: K) => R {
  return arg2 => proc(arg1, arg2)
}

export function curry1to0<T, R>(proc: (arg1: T) => R, arg1: T): () => R {
  return () => proc(arg1)
}

export function prop(key: string) {
  return (object: any) => object[key]
}

/**
 * Calls callback with the first argument, and returns it
 */
export function tap<T>(arg: T, proc: (arg: T) => any): T {
  proc(arg)
  return arg
}

/**
 *  Utility function to help typescript figure out that what we pass is a tuple (rather than an array).
 */
export function tup<T extends Array<any>>(...args: T): T {
  return args
}

export interface Proc {
  (): any
}

export function call(proc: Proc) {
  proc()
}

export function joinProc(...procs: Proc[]) {
  return () => {
    procs.map(call)
  }
}
