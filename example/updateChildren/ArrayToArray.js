import {
  ref,
  h
} from "../../lib/guide-min-vue.esm.js"

export const ArrayToArray = {
  name: 'ArrayToArray',
  setup() {
    const change = ref(false)
    window.change = change;
    return {
      change
    }
  },
  render() {
    return h('div', {}, this.change ?  [h('p', {}, 'oldA'), h('p', {}, 'oldB')] :  [h('p', {}, 'A'), h('p', {}, 'B')])
  }
}