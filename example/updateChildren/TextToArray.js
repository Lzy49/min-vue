import {
  ref,
  h
} from "../../lib/guide-min-vue.esm.js"

export const TextToArray = {
  name: 'TextToArray',
  setup() {
    const change = ref(false)

    window.change = change;
    return {
      change
    }
  },
  render() {
    return h('div', {}, this.change ?  [h('p', {}, 'A'), h('p', {}, 'B')] : 'text')
  }
}