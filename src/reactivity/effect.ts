import { extend } from '../shared/index'
let activeEffect: any;
class ReactiveEffect {
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
    activeEffect = this;
    return this.#fn();
  }
  stop() {
    if (this.active) {
      this.active = false
      // 将收集的依赖清空
      this.deps.forEach((dep: any) => dep.delete(this))
      this.onStop && this.onStop();
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

  if (!activeEffect) { return }
  // 收集 activeEffect 到 被调用的对象
  dep.add(activeEffect)
  // 收集 添加 activeEffect 的 依赖的对象
  activeEffect.deps.push(dep);

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
export const stop = (ruuner: any) => {
  ruuner.effect.stop();
}