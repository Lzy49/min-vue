const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}
export const publicInstanceHandlers = {
  get({ _: instance }, key) {
    const { setupState } = instance;
    // setupState 中获取值
    if (key in setupState) {
      return setupState[key]
    }
    if (key in publicPropertiesMap) {
      return publicPropertiesMap[key](instance);
    }
  }
}