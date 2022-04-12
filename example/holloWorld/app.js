import {
  h
} from '../../lib/guide-min-vue.esm.js'
export default {
  setup() {
    return {
      msg: 'min-vue'
    }
  },
  render() {
    return h('div', null, [
      h('div', {
        id: 'root',
        class: ['red', 'hard']
      }, `hollo ${this.msg}`),
      h('div', {
        id: 'root',
        class: ['red', 'hard']
      }, [
        h('p', {
          class: ['green', 'hard']
        }, 'red'),
        h('p', {
          class: ['blue', 'hard']
        }, 'blue'),
      ]),
    ])
  }
}
