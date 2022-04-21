import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from '../shared/ShapeFlags'
import { Text, Fragment } from './createVnode'
import { createAppAPI } from './createApp'
import { effect } from "../reactivity/effect"
import { EMPTY_OBJECT } from "../shared"
// 接收一个 渲染工具
export function createRenderer(options) {
  // 解构 api
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options

  function render(vnode, container) {
    // 调用 patch 方法 （拆分时为了 ptah 递归）
    patch(null, vnode, container)
  }

  function patch(prevVnode, nextVnode, container, parentComponent = null) {
    const { type } = nextVnode
    switch (type) {
      case Text:
        processText(prevVnode, nextVnode, container)
        break;
      case Fragment:
        processFragment(prevVnode, nextVnode, container, parentComponent)
        break;
      default:
        // 判断组件类型
        if (nextVnode.shapeFlag & ShapeFlags.ELEMENT) {
          // Element 
          processElement(prevVnode, nextVnode, container, parentComponent)
        } else if (nextVnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // Component
          processComponent(prevVnode, nextVnode, container, parentComponent)
        }
    }

  }

  function processComponent(prevVnode, nextVnode: any, container: any, parentComponent) {
    if (prevVnode) {
      // 更新流程
      updateComponent(prevVnode, nextVnode, container)
    } else {
      // 初始化流程
      mountComponent(nextVnode, container, parentComponent)
    }
  }
  // 初始化 组件
  function mountComponent(nextVnode: any, container: any, parentComponent) {
    /**
    * 1. 创建组件实例
    * 2. 处理 props,slots, setup
    * 3. 处理 setup 返回值  
    */
    const instance = createComponentInstance(nextVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  // 更新组件
  function updateComponent(prevVnode, nextVnode, container) {
    console.log('更新呀')
  }
  // 更新
  function setupRenderEffect(instance, container) {
    // 绑定 effect 并区分更新与初始化
    effect(() => {
      // init 初始化阶段
      if (!instance.isMounted) {
        // ShapeFlags 概念抽离
        const { proxy } = instance
        // 执行 组件 render 函数 返回最后得到 vnode 
        const subTree = instance.subTree = instance.render.call(proxy);
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance)
        instance.vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        // updata 更新
        const { proxy } = instance
        const prevTree = instance.subTree; // 老 vnode
        // 返回 新的 vnode
        const subTree = instance.subTree = instance.render.call(proxy); // 新 vnode 
        patch(prevTree, subTree, container, instance)
      }
    })

  }

  // 处理 element 类型 
  function processElement(prevVnode, nextVnode: any, container: any, parentComponent) {
    if (prevVnode) {
      updateElement(prevVnode, nextVnode, container)
    } else {
      mountElement(nextVnode, container, parentComponent)
    }
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
        hostPatchProp(el, key, null, val)
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
  // 更新 element 类型 

  function updateElement(prevVnode: any, nextVnode: any, container: any) {
    nextVnode.el = prevVnode.el
    patchProps(nextVnode.el, prevVnode.props || EMPTY_OBJECT, nextVnode.props || EMPTY_OBJECT)
  }

  // 更新 props 
  function patchProps(el, prevProps, nextProps) {
    // 1. 老的有新的无
    for (const key in prevProps) {
      if (prevProps[key] && !nextProps[key]) {
        hostPatchProp(el, key, prevProps[key], nextProps[key])
      }
    }
    // 2.新的有，且与老的不一样 (undefined 也不怕，因为 如果老的是 undefined 也是删除)
    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        hostPatchProp(el, key, prevProps[key], nextProps[key])
      }
    }
  }

  // 处理所有子节点
  function mountChildren(vnode, container, parentComponent) {
    vnode.forEach(item => patch(null, item, container, parentComponent))
  }

  // 处理 text 节点
  function processText(prevVnode, nextVnode: any, container: any) {
    if (prevVnode) {

    } else {
      const { children } = nextVnode;
      container.append(nextVnode.el = document.createTextNode(children))
    }
  }
  function processFragment(prevVnode, nextVnode: any, container: any, parentComponent) {
    if (!prevVnode) {
      mountChildren(nextVnode.children, container, parentComponent)
    }
  }
  return {
    createApp: createAppAPI(render)
  }
}
