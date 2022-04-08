import { track, trigger } from './effect'
//  抽离创建 getter 和 setter 的函数
const createGetter = (isReadonly: boolean = false) => {
  return (target: object, key: any) => {
    if (!isReadonly) {
      track(target, key)
    }
    return Reflect.get(target, key)
  }
}
const createSetter = () => {
  return (target: object, key: any, value: any) => {
    const res = Reflect.set(target, key, value)
    trigger(target, key)
    return res
  }
}
// 将getter 和 setter 缓冲
const reactiveGetter = createGetter()
const reactiveSetter = createSetter();
const readonlyGetter = createGetter(true);

// 抛出两个 handler 
export const reactiveHandler = {
  get: reactiveGetter,
  set: reactiveSetter
}

export const readonlyHandler = {
  get: readonlyGetter,
  set() {
    console.warn('readonly 包裹的 变量 无法进行修改')
    return true
  }
}