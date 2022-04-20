import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from '../shared/ShapeFlags'
import { Text, Fragment } from './createVnode'
export function render(vnode, container) {
  // 调用 path 方法 （拆分时为了 ptah 递归）
  path(vnode, container)
}

function path(vnode, container) {
  const { type } = vnode
  switch (type) {
    case Text:
      processText(vnode, container)
      break;
    case Fragment:
      processFragment(vnode, container)
      break;
    default:
      // 判断组件类型
      if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
        // Element 
        processElement(vnode, container)
      } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // Component
        processComponent(vnode, container)
      }
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

const isOn = (key: string) => /^on[A-Z]/.test(key)
// 初始化  element 类型
function mountElement(vnode: any, container: any) {
  const { type, children, props, shapeFlag } = vnode;
  // 处理 type
  const el = document.createElement(type)
  // 处理 props 
  if (props) {
    // 处理事件形式的字符串
    // 处理字符串形式的 props

    for (const key in props) {
      let val = props[key];
      if (isOn(key)) {
        const event = key.slice(2).toLocaleLowerCase();
        el.addEventListener(event, props[key])
      } else {
        // 单独处理
        if (key === 'class') {
          val = typeof val === 'string' ? val : val.join(' ');
        }
        el.setAttribute(key, val)
      }
    }
  }
  // 处理 children
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 处理文字
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 处理数组
    mountChildren(children, el)
  }
  vnode.el =el
  container.append(el)
}

// 处理所有子节点
function mountChildren(vnode, container) {
  vnode.forEach(item => path(item, container))
}

// 处理 text 节点
function processText(vnode: any, container: any) {
  const { children } = vnode;
  container.append(vnode.el = document.createTextNode(children))
}
function processFragment(vnode: any, container: any) {
  mountChildren(vnode.children, container)
}

