import { hasOwn } from "../shared";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}
export const publicInstanceHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;
    if (hasOwn(setupState, key)) {
      // setupState 中获取值
      return setupState[key]
    } else if (hasOwn(props, key)) {
      // this.props 绑定
      return props[key]
    } else if (key in publicPropertiesMap) {
      // this.$ 变量绑定
      return publicPropertiesMap[key](instance);
    }
  }
}