import { createComponentInstance, setupComponent } from "./component"
import { ShapeFlags } from '../shared/ShapeFlags'
import { Text, Fragment } from './createVnode'
import { createAppAPI } from './createApp'
import { effect } from "../reactivity/effect"
import { EMPTY_OBJECT } from "../shared"
import { queueJobs } from './scheduler'
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
      updateComponent(prevVnode, nextVnode)
    } else {
      // 初始化流程
      mountComponent(nextVnode, container, parentComponent)
    }
  }
  // 初始化 组件
  function mountComponent(nextVnode: any, container: any, parentComponent) {
    /**
    * 1. 创建组件实例 并挂载到 vnode 上
    * 2. 处理 props,slots, setup
    * 3. 处理 setup 返回值  
    */
    const instance = nextVnode.component = createComponentInstance(nextVnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }
  // 更新组件
  function updateComponent(prevVnode, nextVnode) {
    const instance = nextVnode.component = prevVnode.component;
    // 是否需要更新
    if (shouldUpdateComponent(prevVnode, nextVnode)) {
      // 需要更新
      // 更新组件的流程是调用组件的 effect 所以在 初始化的时候就要将 effect 保存起来。
      // 为了绑定 props 要给 instance 添加 next 属性
      instance.next = nextVnode;
      instance.update();
    } else {
      // 没有改变所以 修改vnode el  = 老的 el
      nextVnode.el = prevVnode.el
      // 没有改变所以 修改Vnode component = 老的 comonent
      nextVnode.component = prevVnode.component
      // 绑定 component vnode = 新的vnode 
      instance.vnode = nextVnode;
    }
  }
  function shouldUpdateComponent(prevVnode, nextVnode) {
    const { props: prevProps } = prevVnode
    const { props: nextProps } = nextVnode
    for (let i in nextProps) {
      if (nextProps[i] !== prevProps[i]) {
        return true;
      }
    }
    return false;
  }
  // 更新
  function setupRenderEffect(instance, container) {
    // 绑定 effect 并区分更新与初始化 ，并把 effect 返回的 runner 绑定在 Instace 上。来保证下次更新props时调用。
    instance.update = effect(() => {
      // init 初始化阶段
      if (!instance.isMounted) {
        // ShapeFlags 概念抽离
        const { proxy } = instance
        // 执行 组件 render 函数 返回最后得到 vnode 
        const subTree = instance.subTree = instance.render.call(proxy);
        // vnode -> element -> mountElement
        patch(null, subTree, container, instance)
        instance.vnode.el = subTree.el;
        // instance.vnode.next = instance;
        instance.isMounted = true;
      } else {
        // updata 更新
        // 为新组件更新新的 proxy
        const { proxy, next: nextVnode, vnode: prevVnode } = instance
        if (nextVnode) {
          nextVnode.el = prevVnode.el;
          updateComponentPreRender(instance, nextVnode)
        }
        // 为新组件更新 props
        const prevTree = instance.subTree; // 老 vnode
        // 返回 新的 vnode
        const subTree = instance.subTree = instance.render.call(proxy); // 新 vnode 
        patch(prevTree, subTree, container, instance)
      }
    }, {
      scheduler: () => {
        queueJobs(instance.update)
      }
    })
  }
  function updateComponentPreRender(instance, nextVnode) {
    instance.props = nextVnode.props;
    instance.vnode = nextVnode;
    instance.next = null;
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
        patchKeyedChildren(el, nextChildren, prevChildren, parentComponent);
      }
    }
  }
  const isSameVnodeType = (nextVnode, prevVnode) => (nextVnode.type === prevVnode.type && nextVnode.key === prevVnode.key)
  function patchKeyedChildren(parentEl, nextChildren, prevChildren, parentComponent) {
    // 进行双端
    let i = 0;
    let nextR = nextChildren.length - 1;
    let prevR = prevChildren.length - 1;
    // 从前循环，必须不能越界
    while (i <= nextR && i <= prevR) {
      if (!isSameVnodeType(nextChildren[i], prevChildren[i])) {
        break;
      }
      patch(prevChildren[i], nextChildren[i], parentEl, parentComponent)
      i++
    }
    // 从后往前，必须不能比i小
    while (nextR >= i && prevR >= i) {
      if (!isSameVnodeType(nextChildren[nextR], prevChildren[prevR])) {
        break;
      }
      patch(prevChildren[prevR], nextChildren[nextR], parentEl, parentComponent)
      nextR--
      prevR--
    }
    // 缩小范围后开始甄别
    // ABC -> ABCD  i === 3 , nextR 3 , prevR 2
    // 新增     0   0  -1 

    if (i <= nextR && i > prevR) {
      // 解决 新的还没用完，老的已经用完了。说明是插入形式的，两边全连着插入一部分
      while (i <= nextR) {
        patch(null, nextChildren[i], parentEl, parentComponent, prevChildren[prevR + 1]?.el)
        i++;
      }
    } else if (i <= prevR && i > nextR) {
      // 解决 老的没比较完，新的已经比较完了，说明是删除了几个点。
      // 删除
      // ABCD -> ABC  i === 3 , nextR 2 , prevR 3
      // 新节点比旧节点少，需要删除
      while (i <= prevR) {
        hostRemove(prevChildren[i].el)
        i++;
      }
    } else {
      // 留下，老的没用完，新的也没用完。各自剩下一个最小序列。
      // 解决方案 比较 两个list找到不同的，要不增要不删，一样的。继续去path
      // 确定两个队列 两个都是 i 开始 prevR , nextR  结束
      let nextIndex = i;
      let prevIndex = i;
      // 优化 1. 通过 key 优化循环查询
      let nextKeytoIndexMap = new Map()
      for (let index = nextIndex; index <= nextR; index++) {
        nextChildren[index]?.key && nextKeytoIndexMap.set(nextChildren[index].key, index)
      }
      // 优化 2. 通过 nextChildren 长度来提前结束搜寻
      let nextLength = nextR - nextIndex + 1;
      let catchLength = 0;
      // ---初始化映射表 start---
      const newIndexToOldIndexMap = new Array(nextLength);
      newIndexToOldIndexMap.fill(0)
      // ---初始化映射表 end ----
      let removed = false;
      let maxIndex = 0;
      // ---循环比较---
      for (let index = prevIndex; index <= prevR; index++) {
        let prev = prevChildren[index]
        let sameIndex;
        // 优化
        if (nextLength <= catchLength) { hostRemove(prev.el); continue }
        // --- 找找看 ---
        if (prev.key) {
          // 这进行优化 先去映射找一下有的话不需要循环了
          sameIndex = nextKeytoIndexMap.get(prev.key)
        } else {
          for (let j = nextIndex; j <= nextR; j++) {
            // 发现相同则停止
            if (isSameVnodeType(prev, nextChildren[j])) {
              sameIndex = j
              break;
            }
          }
        }

        // --- 处理结果 ---
        if (sameIndex === undefined) {
          hostRemove(prev.el)
        } else {
          // 最后找到了
          catchLength++;
          maxIndex <= sameIndex ? maxIndex = sameIndex : (removed = true)
          newIndexToOldIndexMap[sameIndex - nextIndex] = index + 1; // 收集映射
          patch(prev, nextChildren[sameIndex], parentEl, parentComponent, null)
        }
      }


      // 比较完以后开始排序啦。
      // 求最长子序列
      const increasingNewIndexSequence = removed ? getSequence(newIndexToOldIndexMap) : []
      let j = increasingNewIndexSequence.length - 1;
      // 开始循环
      for (let index = nextLength - 1; index >= 0; index--) {
        // 开始排序
        if (newIndexToOldIndexMap[index] === 0) {
          // 新增
          console.log(nextChildren[index + nextIndex], nextChildren[index + nextIndex + 1])
          patch(null, nextChildren[index + nextIndex], parentEl, parentComponent, nextChildren[index + nextIndex + 1]?.el)
        } else if (removed) {
          // 移动
          // 优化，通过最长子序列进行一个比较，跳过大段要处理的节点
          if (j < 0 || increasingNewIndexSequence[j] !== index) {
            // 移动的话使用 insert 即可
            hostInsert(nextChildren[index + nextIndex].el, parentEl, nextChildren[index + nextIndex + 1]?.el)
          } else {
            // 这里就是命中了  index 和 最长递增子序列的值
            // 所以可以移动指针了
            j--;
          }


          // if(j < 0 || !increasingNewIndexSequence[index]){
          //   console.log('几次')
          //   hostInsert(nextChildren[index + nextIndex].el, parentEl, nextChildren[index + nextIndex + 1]?.el)
          // }else{
          //   j--
          // }
        }

        // increasingNewIndexSequence
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


// 获取最长节点子序列
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}