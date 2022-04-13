import { createComponentInstance, setupComponent } from "./component"
import { ShapFlags } from '../shared/ShapFlags'
export function render(vnode, container) {
  // 调用 path 方法 （拆分时为了 ptah 递归）
  path(vnode, container)
}

function path(vnode, container) {
  // 判断组件类型
  if (vnode.shapFlag & ShapFlags.ELEMENT) {
    // Element 
    processElement(vnode, container)
  } else if (vnode.shapFlag & ShapFlags.STATEFUL_COMPONENT) {
    // Component
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
  // ShapeFlags 概念抽离
  const { proxy } = instance
  // 最后得到 vnode 
  const subTree = instance.render.call(proxy);
  // vnode -> element -> mountElement
  path(subTree, container)
  instance.vnode.el = subTree;
}

// 处理 element 类型 
function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

// 初始化  element 类型
function mountElement(vnode: any, container: any) {
  const { type, children, props, shapFlag } = vnode;
  // 处理 type
  const el = document.createElement(type)
  // 处理 props 
  if (props) {
    for (const key in props) {
      const val = typeof props[key] === 'string' ? props[key] : props[key].join(' '); // typeof props[key] === 'string' ? props[key] : props[key].spile(' ');
      el.setAttribute(key, val)
    }
  }
  // 处理 children
  if (shapFlag & ShapFlags.TEXT_CHILDREN) {
    // 处理文字
    el.textContent = children;
  } else if (shapFlag & ShapFlags.ARRAY_CHILDREN) {
    // 处理数组
    mountChildren(children, el)
  }
  container.append(el)
}

// 处理所有子节点
function mountChildren(vnode, container) {
  vnode.forEach(item => path(item, container))
}