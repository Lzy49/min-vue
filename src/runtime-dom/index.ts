import { createRenderer } from '../runtime-core'
import { isOn } from '../shared';
// 首先要定义一堆渲染器
// 创建el
const createElement = (type) => {
  return document.createElement(type)
}
const createText = (children) => {
  return document.createTextNode(children)
}
// 设置节点text
const setElementText = (el, val) => {
  el.textContent = val;
}
// 处理 el 的 props 
const patchProp = (el, key, prevValue, nextValue) => {

  if (isOn(key)) {
    const event = key.slice(2).toLocaleLowerCase();
    el.addEventListener(event, nextValue)
  } else {
    if (nextValue === undefined || nextValue === null) {
      el.removeAttribute(key)
    } else {
      if (key === 'class') {
        nextValue = typeof nextValue === 'string' ? nextValue : nextValue.join(' ');
      }
      el.setAttribute(key, nextValue)
    }
  }
}
// 插入 el
const insert = (child, parent, anchor) => {
  parent.insertBefore(child, anchor);
}
const remove = (el) => {
  el.remove();
}
// 然后要用这些渲染器创建 render -> 创建 createApp 
// 创建 基于 上面提供的API的一个Vue ，并将render 缓存，下次再取可以直接使用 renderer
let renderer;
function ensureRenderer() {
  // 如果 renderer 有值的话，那么以后都不会初始化了
  return (
    renderer ||
    (renderer = createRenderer({
      createElement,
      createText,
      // setText,
      setElementText,
      patchProp,
      insert,
      remove,
    }))
  );
}

// 返回 createApp 提供外部使用
export const createApp = (...args) => {
  return ensureRenderer().createApp(...args);
};
// 返回 runtime-core 内部的东西
export * from '../runtime-core'