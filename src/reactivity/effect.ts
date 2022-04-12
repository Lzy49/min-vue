import { extend } from '../shared/index'
let activeEffect: any;
let shouldTreck = false;
export class ReactiveEffect {
  #fn: Function
  deps: [] = [];
  scheduler: Function | undefined;
  active: boolean = true;
  onStop?: Function;
  constructor(fn: Function, scheduler?: Function) {
    this.#fn = fn
    this.scheduler = scheduler;
  }
  run() {
    if (!this.active) {
      return this.#fn();
    }
    activeEffect = this;
    shouldTreck = true;
    const result = this.#fn();
    shouldTreck = false
    return result

  }
  stop() {
    if (this.active) {
      // 将收集的依赖清空
      this.deps.forEach((dep: any) => dep.delete(this))
      this.onStop && this.onStop();
      this.active = false;
      // 清空收集被依赖项的数组
      this.deps.length = 0;
    }
  }
}
export function effect(fn: Function, options: any = {}): Function {
  // 为 effect 绑定 scheduler
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  // 为 effect 绑定 scheduler
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}
const targetMap = new Map();
// 收集
export const track = (target: object, key: string | symbol) => {
  // 判断是否进行收集
  if (!isTreaking()) { return }
  // 可以收集->进行收集
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
  trackEffect(dep)
}
export const trackEffect = (dep) => {
  // 判断是否存在，存在则不再收集 
  if (dep.has(activeEffect)) {
    return
  }
  // 收集 activeEffect 到 被调用的对象
  dep.add(activeEffect)
  // 收集 添加 activeEffect 的 依赖的对象
  activeEffect.deps.push(dep);
}
export const isTreaking = () => activeEffect !== undefined && shouldTreck

export const trigger = (target: object, key: string | symbol) => {
  let depMap = targetMap.get(target)
  let dep = depMap.get(key)
  triggerEffect(dep)
}
export const triggerEffect = (dep) => {
  for (const item of dep) {
    if (item.scheduler) {
      item.scheduler();
    } else {
      item.run();
    }
  }
}
export const stop = (ruuner: any) => {
  ruuner.effect.stop();
}