import {
  h,
  provide,
  inject
} from "../../lib/guide-min-vue.esm.js"

const GrandsonComponent = {
  setup() {
    const bar = inject('bar')
    return {
      bar
    }
  },
  render() {
    return h('div', {}, [
      h('h5', {}, 'GrandsonComponent'),
      h('div', {}, this.bar)
    ])
  }
}



const ChildComponent = {
  setup() {
    provide('bar', 'ChildComponent')
    const bar = inject('bar')
    const baz = inject('baz',()=>'default-baz')
    return {
      bar,
      baz
    }
  },
  render() {
    return h('div', {}, [
      h('h3', {}, 'ChildComponent'),
      h('div', {}, this.bar),
      h('div', {}, this.baz),
      h(GrandsonComponent)
    ])
  }
}


export const App = {
  setup() {
    provide('bar', 'app')
  },
  render() {
    return h('div', {}, [h('h1', {}, 'App'), h(ChildComponent, {}, '')]);
  }
}