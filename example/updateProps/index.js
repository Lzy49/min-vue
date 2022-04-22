import {
  createApp,
  h,
  ref
} from '../../lib/guide-min-vue.esm.js'
const App = {
  setup() {
    let age = ref(10);
    let color = ref('');
    const add = () => {
      console.log('?')
      age.value++;
    }
    const setColor = (v) => {
      color.value = v
    }
    return {
      color,
      age,
      add,
      setColor
    }
  },
  render() {
    return h('div', {
      style: 'color:' + this.color
    }, [
      h('div', {}, 'my age is ' + this.age),
      h('button', {
        onClick: this.add
      }, 'addAge'),
      h('button', {
        onClick: () => {
          this.setColor('red')
        }
      }, 'color -> red'),
      h('button', {
        onClick: ()=>this.setColor()
      }, 'init color')
    ])
  }
}
const app = createApp(App);
app.mount('#root')