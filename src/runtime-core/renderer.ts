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
    createText: hostCreateText,
    patchProp: hostPatchProp,
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
  } = options

  function render(vnode, container) {
    // 调用 patch 方法 （拆分时为了 ptah 递归）
    patch(null, vnode, container)
  }
  /**
   * 
   * @param prevVnode 老节点
   * @param nextVnode 新节点
   * @param container 父级容器（doument)
   * @param parentComponent 父级instace
   */
  function patch(prevVnode, nextVnode, container, parentComponent = null, anchor = null) {

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
          processElement(prevVnode, nextVnode, container, parentComponent, anchor)
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
  function processElement(prevVnode, nextVnode: any, container: any, parentComponent, anchor) {
    if (prevVnode) {
      updateElement(prevVnode, nextVnode, container, parentComponent)
    } else {
      mountElement(nextVnode, container, parentComponent, anchor)
    }
  }

  // 初始化  element 类型
  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    const { type, children, props, shapeFlag } = vnode;
    // 处理 type
    const el = vnode.el = hostCreateElement(type)
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

    hostInsert(el, container, anchor)
  }
  // 更新 element 类型 

  function updateElement(prevVnode: any, nextVnode: any, container: any, parentComponent) {
    const el = nextVnode.el = prevVnode.el
    // 对比 props 并更新
    patchProps(el, prevVnode.props || EMPTY_OBJECT, nextVnode.props || EMPTY_OBJECT)
    // 对比 children 并更新
    patchChildren(el, nextVnode, prevVnode, parentComponent)

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
  // 更新 children
  function patchChildren(el, nextVnode, prevVnode, parentComponent) {
    const { shapeFlag: nextFlag, children: nextChildren } = nextVnode;
    const { shapeFlag: prevFlag, children: prevChildren } = prevVnode;
    // 新节点的 children 是 Text
    if (nextFlag & ShapeFlags.TEXT_CHILDREN) {
      // 老节点为 Array 
      if (prevFlag & ShapeFlags.ARRAY_CHILDREN) {
        removeChildren(prevChildren)
      }
      // 判断新老节点文本是否相同，不同进行修改
      if (nextChildren !== prevChildren) {
        hostSetElementText(el, nextChildren)
      }
    } else {// 新节点的 children 是 Array
      // 判断老节点是不是个文本节点
      if (prevFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(el, '')
        mountChildren(nextChildren, el, parentComponent)
      } else {
        pathcKeyedChildren(el, nextChildren, prevChildren, parentComponent);
      }
    }
  }
  const isSameVnodeType = (nextVnode, prevVnode) => (nextVnode.type === prevVnode.type && nextVnode.key === prevVnode.key)
  function pathcKeyedChildren(el, nextChildren, prevChildren, parentComponent) {
    // 进行双端
    let i = 0;
    let nextR = nextChildren.length - 1;
    let prevR = prevChildren.length - 1;
    // 从前循环，必须不能越界
    while (i <= nextR && i <= prevR) {
      if (!isSameVnodeType(nextChildren[i], prevChildren[i])) {
        break;
      }
      i++
    }
    // 从后往前，必须不能比i小
    while (nextR >= i && prevR >= i) {
      if (!isSameVnodeType(nextChildren[nextR], prevChildren[prevR])) {

        break;
      }
      nextR--
      prevR--
    }
    // 缩小范围后开始甄别
    // ABC -> ABCD  i === 3 , nextR 3 , prevR 2
    // 新增     0   0  -1 
    console.log(i, nextR, prevR)
    console.log(prevChildren)
    if (i <= nextR && i > prevR) {
      console.log(prevChildren)
      while (i <= nextR) {
        patch(null, nextChildren[i], el, parentComponent, prevChildren[prevR + 1]?.el)
        i++;
      }
    } else if (i <= prevR && i > nextR) {
      // 删除
      // ABCD -> ABC  i === 3 , nextR 2 , prevR 3
      console.log(1)
      // 新节点比旧节点少，需要删除
      while (i <= prevR) {
        hostRemove(prevChildren[i].el)
        i++;
      }
    }
  }
  // 删除子节点
  function removeChildren(children) {
    children.forEach(({ el }) => hostRemove(el))
  }
  // 处理所有子节点
  function mountChildren(children, container, parentComponent) {
    children.forEach(item => patch(null, item, container, parentComponent))
  }

  // 处理 text 节点
  function processText(prevVnode, nextVnode: any, container: any) {
    if (prevVnode) {

    } else {
      const { children } = nextVnode;
      container.append(nextVnode.el = hostCreateText())
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
