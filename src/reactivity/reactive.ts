import { track, trigger } from './effect'
export const reactive = (raw: any) => {
  return new Proxy(raw, {
    get(target, key) {
      track(target, key)
      return Reflect.get(target, key)
      // TODO 收集依赖
    },
    set(target, key, value) {
      const res = Reflect.set(target, key, value)
      //  TODO 通知依赖
      trigger(target, key)
      return res
    }
  })
}