import {
  h
} from "../../lib/guide-min-vue.esm.js"

const Foo = {
  setup(props, {
    emit
  }) {
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