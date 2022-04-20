import { ShapeFlags } from "../shared/ShapeFlags";

// slot 必须是一个 对象
// initSlots 的作用是将 vnode.children 中非函数转换为函数方便 renderSlot调用。
export const initSlots = (instance, children) => {

  // 如果是个对象
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }
}

function normalizeObjectSlots(children, slots) {
  for (let key in children) {
    const value = children[key]
    if(typeof value === 'function'){
      slots[key] = (props) => normalizeSlotValue(value(props))
    }
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value] 
}
