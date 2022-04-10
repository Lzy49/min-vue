import { hasChange, isObject } from "../shared";
import { trackEffect, triggerEffect, isTreaking } from "./effect";
import { reactive } from "./reactive";
const IS_REF = Symbol();
class RefImpl {
  #value
  dep
  #rawValue
  isRef = IS_REF;
  constructor(value) {
    this.#value = isObject(value) ? reactive(value) : value;
    this.#rawValue = value;
    this.dep = new Set();
  }
  get value() {
    // 没有 可收集的内容时不做收集
    if (isTreaking()) {
      trackEffect(this.dep)
    }
    return this.#value
  }
  set value(val) {
    if (hasChange(val, this.#rawValue)) {
      this.#value = isObject(val) ? reactive(val) : val
      this.#rawValue = val;
      triggerEffect(this.dep)
    }
  }
}
export const ref = (value) => {
  return new RefImpl(value)
}
// 判断 值是不是一个 ref
export const isRef = (value) => value.isRef === IS_REF
// 返回 ref 的原始值
export const unRef = (ref) => isRef(ref) ? ref.value : ref;
export const proxyRef = (state) => {
  return new Proxy(state, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value) {
      if (isRef(target[key]) && !isRef(value)) {
        console.log(target[key].value, value)
        return (target[key].value = value);
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}