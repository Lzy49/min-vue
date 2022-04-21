import { createVnode } from "./createVnode";

export function createAppAPI(render) {
  return function createApp(rootComponent) {
    return {
      mount(rootContainer) {
        // rootContainer -> dom
        if (typeof rootContainer === 'string') {
          rootContainer = document.querySelector(rootContainer)
        }
        // rootContainer 根容器，所有组件渲染后添加的地方。
        // 获取 rootNode 


        // rootComponent -> vnode 所有内容都要转换为 虚拟节点来表示
        const vnode = createVnode(rootComponent);
        //  
        render(vnode, rootContainer);
      }
    }
  }
}

