import {
  ref,h
} from "../../lib/guide-min-vue.esm.js"

export const TextToText = {
  name: 'TextToText',
  setup() {
    const change = ref(false)

    window.change = change;
    return {
      change
    }
  },
  render() {
    return h('div', {}, this.change ?  'new text' : 'old text')
  }
}