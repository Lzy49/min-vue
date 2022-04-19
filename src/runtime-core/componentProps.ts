import { isObject } from "../shared"

export function initProps(instance: any, rawProps: any) {
  // TODO
  
  // attrs

  // 判断非空
  if (rawProps) {
    if (isObject(rawProps)) {
      instance.props = rawProps || {}
    } else {
      console.warn('props 必须传入 对象类型')
    }
  }
}

