import {
  createRenderer
} from "../../../lib/guide-min-vue.esm.js";

// 给基于 pixi.js 的渲染函数
const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics();
      rect.beginFill(0xff0000);
      rect.drawRect(0, 0, 100, 100);
      rect.endFill();
      return rect;
    }
  },

  patchProp(el, key, val) {
    el[key] = val;
  },

  insert(el, parent) {
    parent.addChild(el);
  },
});

export function createApp(rootComponent) {
  return renderer.createApp(rootComponent);
}