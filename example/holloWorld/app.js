import {
  h
} from '../../lib/guide-min-vue.esm.js'
import {
  Foo
} from './Foo.js';
export default {
  setup() {
    return {
      msg: 'min-vue'
    }
  },
  render() {
    window.self = this;
    return h('div', null, [
      // h('button', {
      //   onClick: () => {
      //     alert('你好')
      //   }
      // }, '点我点我，快'),

      // h('input', {
      //   onBlur: () => {
      //     alert('你好')
      //   }
      // }),
      // h('div', {
      //   id: 'root',
      //   class: ['red', 'hard']
      // }, `hollo ${this.msg}`),
      // h('div', {
      //   id: 'root',
      //   class: ['red', 'hard'],
      // }, [
      //   h('p', {
      //     class: ['green', 'hard']
      //   }, 'red'),
      //   h('p', {
      //     class: ['blue', 'hard']
      //   }, 'blue'),
      // ]),
      h(Foo, {
        age: 10
      })
    ])
  }
}