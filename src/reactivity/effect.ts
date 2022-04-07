let activeEffect: any;
class ReactiveEffect {
  #fn: Function
  scheduler: Function | undefined
  constructor(fn: Function, scheduler?: Function) {
    this.#fn = fn
    this.scheduler = scheduler;
  }
  run() {
    activeEffect = this;
    return this.#fn();
  }
}
export function effect(fn: Function, options: any = {}): Function {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  _effect.run();
  return _effect.run.bind(_effect);
}
const targetMap = new Map();
export const track = (target: object, key: string | symbol) => {
  let depMap = targetMap.get(target)
  if (!depMap) {
    depMap = new Map();
    targetMap.set(target, depMap)
  }
  let dep = depMap.get(key)
  if (!dep) {
    dep = new Set();
    depMap.set(key, dep)
  }
  dep.add(activeEffect)
}
export const trigger = (target: object, key: string | symbol) => {
  let depMap = targetMap.get(target)
  let dep = depMap.get(key)
  for (const item of dep) {
    if (item.scheduler) {
      item.scheduler();
    } else {
      item.run();
    }
  }
}