import { ShapFlags } from "../shared/ShapFlags"

export function createVnode(type, props?, children?) {
  // 创建 node 本身
  const vnode = {
    type,
    props,
    children,
    shapFlag: getShapFlag(type)
  }
  // 处理 node children
  if (typeof children === 'string') {
    vnode.shapFlag = vnode.shapFlag | ShapFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    vnode.shapFlag = vnode.shapFlag | ShapFlags.ARRAY_CHILDREN
  }
  return vnode
}


export const getShapFlag = (type) => {
  if (typeof type === 'string') {
    return ShapFlags.ELEMENT
  } else {
    return ShapFlags.STATEFUL_COMPONENT
  }
}