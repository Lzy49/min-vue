import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用 path 方法 （拆分时为了 ptah 递归）
  path(vnode, container)
}

function path(vnode, container) {
  // 处理组件
  // 判断组件类型
  // Component
  processComponent(vnode, container)
  // Element 
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
function mountComponent(vnode: any, container: any) {
  /**
  * 1. 创建组件实例
  * 2. 处理 props,slots, setup
  * 3. 处理 setup 返回值  
  */
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}
function setupRenderEffect(instance, container) {
  // 最后得到 vnode 
  const subTree = instance.render();
  // vnode -> element -> mountElement
  path(subTree, container)
}

