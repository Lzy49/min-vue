import {
  h,
  renderSlot
} from "../../lib/guide-min-vue.esm.js"

const Child = {
  name: "Child",
  setup(props, context) {},
  render() {
    return h("div", {}, [
      h("div", {}, "child"),
      // renderSlot 会返回一个 vnode
      // 其本质和 h 是一样的
      // 第三个参数给出数据
      renderSlot(this.$slots, "default", {
        age: 16,
      }),
    ]);
  },
};


export const App = {
  name: "App",
  setup() {},

  render() {
    return h("div", {}, [
      h("div", {}, "你好"),
      h(
        Child, {
          msg: "your name is child",
        }, {
          default: ({
            age
          }) => [
            h("p", {}, "我是通过 slot 渲染出来的第一个元素 "),
            h("p", {}, "我是通过 slot 渲染出来的第二个元素"),
            h("p", {}, `我可以接收到 age: ${age}`),
          ],
        }
      ),
    ]);
  },
}