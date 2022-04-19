import {
  h
} from "../../lib/guide-min-vue.esm.js"

export const Foo = {
  setup(props) {
    // 1. 可以获取到外部传入的 props
    if (props.age === 10) {
      console.log('ok')
    }
    // 2. props 是一个 shallowReadonly 值
    props.age = 10
    if (props.age === 10) {
      console.log('ok')
    } else {
      console.log('props is not a shallowReadonly')
    }
  },
  render() {
    console.log(this)
    // 3. 在  this 上可以访问 props
    return h('div', {}, this.age)
  }
}