import {
  h,
  ref,
  getCurrentInstance,
  nextTick,
} from "../../lib/guide-min-vue.esm.js"
const Child = {
  render() {
    return h('div', {}, 'child count :' + this.$props.count)
  }
}
export const App = {
  setup() {
    const app = getCurrentInstance()
    const childCount = ref(10);
    const count = ref(10)
    return {
      count,
      childCount,
      addChildCount: () => {
        for (let i = 1; i < 100; i++) {
          childCount.value++;
        }
        console.log(app)
        nextTick(() => {
          console.log(app)
        })
      },
      addCount: () => {
        count.value++
      }
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, 'count:' + this.count),
      h(Child, {
        count: this.childCount
      }),
      h('button', {
        onClick: this.addChildCount
      }, 'addChildCount'),
      h('button', {
        onClick: this.addCount
      }, 'addCount')
    ])
  }
}