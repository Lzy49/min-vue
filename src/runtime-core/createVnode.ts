import { ShapeFlags } from "../shared/ShapeFlags"

export function createVnode(type, props?, children?) {
  // 创建 node 本身
  const vnode = {
    type,
    props,
    children,
    shapFlag: getShapFlag(type)
  }
  // 处理 node children
  if (typeof children === 'string' || typeof children === 'number') {
    vnode.shapFlag |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapFlag |= ShapeFlags.ARRAY_CHILDREN
  }
  console.log(vnode)
  return vnode
}


export const getShapFlag = (type) => {
  if (typeof type === 'string') {
    return ShapeFlags.ELEMENT
  } else {
    return ShapeFlags.STATEFUL_COMPONENT
  }
}