import { createVnode, Fragment } from '../createVnode'
// renderSlot 的功能就是将 传递过来的 key => function 执行掉。
export const renderSlot = (slots, key, props) => {
  if (slots[key]) {
    return createVnode(Fragment, {}, slots[key](props));
  }
}