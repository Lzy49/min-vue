import {
  createApp,
  ref
} from '../../lib/guide-min-vue.esm.js'
const app = createApp({
  template: '<div>小明今年{{age}}岁</div>',
  setup() {
    const age = window.age = ref(10)
    return {
      age
    }
  }
});
app.mount('#root')