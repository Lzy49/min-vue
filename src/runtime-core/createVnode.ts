import { isObject } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags"
export const Text = Symbol('Text')
export const Fragment = Symbol('Fragment')
export function createVnode(type, props?, children?) {
  // 创建 node 本身
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type)
  }
  // 处理 node children
  if (typeof children === 'string' || typeof children === 'number') {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 处理 slot children 如果是子节点是对象的话就是一个具命list
  if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN && isObject(children)) {
    vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN;
  }
  return vnode
}


export const getShapeFlag = (type) => {
  if (typeof type === 'string') {
    return ShapeFlags.ELEMENT
  } else {
    return ShapeFlags.STATEFUL_COMPONENT
  }
}
export const createTextVnode = (text: string) => {
  return createVnode(Text, {}, text)
}