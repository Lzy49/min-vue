import {
  h,
  getCurrentInstance
} from "../../lib/guide-min-vue.esm.js"

const Foo = {
  setup(props, {
    emit
  }) {
    const instance = getCurrentInstance();
    console.log(instance)
    return {
      add: (a, b) => {
        emit('add', a, b)
      }
    }
  },
  render() {
    return h('button', {
      onClick: () => {
        this.add(1, 2);
      }
    }, 'on click')
  }
}



export const App = {
  setup() {
    const instance = getCurrentInstance();
    console.log(instance)
    const add = (a, b) => {
      console.log('click add', a, b)
    }
    return {
      add
    }
  },
  render() {
    return h(Foo, {
      onAdd: this.add
    })
  }
}