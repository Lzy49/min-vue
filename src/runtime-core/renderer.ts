import { createComponentInstance, setupComponent } from "./component"

export function render(vnode, container) {
  // 调用 path 方法 （拆分时为了 ptah 递归）
  path(vnode, container)
}

function path(vnode, container) {
  // 处理组件
  // 判断组件类型
  // Component
  // Element 
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else {
    processComponent(vnode, container)
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}
// 初始化
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
// 更新
function setupRenderEffect(instance, container) {
  // 最后得到 vnode 
  const subTree = instance.render();
  // vnode -> element -> mountElement
  path(subTree, container)
}


function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

// 初始化 
function mountElement(vnode: any, container: any) {
  const { type, children, props } = vnode;
  // 处理 type
  const el = document.createElement(type)
  // 处理 props 
  if (props) {
    for (const key in props) {
      const val = typeof props[key] === 'string' ? props[key]  : props[key].join(' '); // typeof props[key] === 'string' ? props[key] : props[key].spile(' ');
      el.setAttribute(key, val)
    }
  }
  // 处理 children
  if (typeof children === 'string') {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(children, el)
  }
  container.append(el)
}

function mountChildren(vnode, container) {
  vnode.forEach(item => path(item, container))
}