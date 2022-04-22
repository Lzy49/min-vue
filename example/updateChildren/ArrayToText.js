import {
  ref,
  h
} from "../../lib/guide-min-vue.esm.js"

export const ArrayToText = {
  name: 'ArrayToText',
  setup() {
    const change = ref(false)
    window.change = change;
    return {
      change
    }
  },
  render() {
    return h('div', {}, this.change ? 'new text' : [h('p', {}, 'A'), h('p', {}, 'B')])
  }
}