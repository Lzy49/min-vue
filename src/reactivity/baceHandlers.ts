import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'
import { isObject } from '../shared/index'
//  抽离创建 getter 和 setter 的函数
const createGetter = (isReadonly: boolean = false) => {
  return (target: object, key: any) => {

    // isReactive 和 isReadonly 实现
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key);
    
    // 当遇到值是对象时要对其进行深入嵌套
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }


    //  reactive 在被get 时需要收集依赖
    if (!isReadonly) {
      track(target, key)
    }


    return res
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