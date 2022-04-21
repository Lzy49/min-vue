import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from '../shared/ShapeFlags'
import { Text, Fragment } from './createVnode'
import { createAppAPI } from './createApp'
// 接收一个 渲染工具
export function createRenderer(options) {
  // 解构 api
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  function render(vnode, container) {
    // 调用 path 方法 （拆分时为了 ptah 递归）
    path(vnode, container)
  }

  function path(vnode, container, parentComponent = null) {
    const { type } = vnode
    switch (type) {
      case Text:
        processText(vnode, container)
        break;
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
      default:
        // 判断组件类型
        if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
          // Element 
          processElement(vnode, container, parentComponent)
        } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // Component
          processComponent(vnode, container, parentComponent)
        }
    }

  }

  function processComponent(vnode: any, container: any, parentComponent) {
    mountComponent(vnode, container, parentComponent)
  }
  // 初始化
  function mountComponent(vnode: any, container: any, parentComponent) {
    /**
    * 1. 创建组件实例
    * 2. 处理 props,slots, setup
    * 3. 处理 setup 返回值  
    */
    const instance = createComponentInstance(vnode, parentComponent)
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
    path(subTree, container, instance)
    instance.vnode.el = subTree;
  }

  // 处理 element 类型 
  function processElement(vnode: any, container: any, parentComponent) {
    mountElement(vnode, container, parentComponent)
  }


  // 初始化  element 类型
  function mountElement(vnode: any, container: any, parentComponent) {
    const { type, children, props, shapeFlag } = vnode;
    // 处理 type
    const el = hostCreateElement(type)
    // 处理 props 
    if (props) {
      // 处理事件形式的字符串
      // 处理字符串形式的 props
      for (const key in props) {
        let val = props[key];
        hostPatchProp(key, val, el)
      }
    }
    // 处理 children
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 处理文字
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 处理数组
      mountChildren(children, el, parentComponent)
    }
    vnode.el = el
    hostInsert(el, container)
  }

  // 处理所有子节点
  function mountChildren(vnode, container, parentComponent) {
    vnode.forEach(item => path(item, container, parentComponent))
  }

  // 处理 text 节点
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    container.append(vnode.el = document.createTextNode(children))
  }
  function processFragment(vnode: any, container: any, parentComponent) {
    mountChildren(vnode.children, container, parentComponent)
  }
  return {
    createApp: createAppAPI(render)
  }
}