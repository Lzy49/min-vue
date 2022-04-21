import {
  createApp,
  h,
  ref
} from '../../lib/guide-min-vue.esm.js'
const App = {
  setup() {
    let age = ref(10);
    const add = () => {
      console.log('?')
      age.value++;
    }
    return {
      age,
      add
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, 'my age is ' + this.age),
      h('button', {
        onClick: this.add
      }, 'click')
    ])
  }
}
const app = createApp(App);
app.mount('#root')