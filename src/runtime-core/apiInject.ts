import { getCurrentInstance } from "./component"

export const provide = (key, value) => {
  let currentInstance = getCurrentInstance() as any; // 获取当前组件的 provide
  // 保证 在 setup 中才能使用
  if (currentInstance) {
    let { provide, parent } = currentInstance // 获取当前组件的 currentInstanceprovide
    // 当前 provide = currentInstance.parent.provide 因为是初始化的
    if (provide === parent?.provide) {
      // 此时因为要往里面存值所以要修改 当前 instance 的 provide 
      currentInstance.provide = provide = Object.create(parent.provide)
    }
    provide[key] = value;
  }
}
export const inject = (key, defaultValue) => {
  let { parent } = getCurrentInstance() as any
  if (key in parent.provide) {
    return parent.provide[key]
  }else{
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue;
  }
}