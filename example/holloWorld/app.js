export default {
  setup() {
    return {
      msg: 'min-vue'
    }
  },
  render() {
    return h('div', `hollo ${this.msg}`)
  }
}