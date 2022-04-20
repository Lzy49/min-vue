import { ShapeFlags } from "../shared/ShapeFlags";

export const initSlots = (instance, children) => {
  console.log(children);
  
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
