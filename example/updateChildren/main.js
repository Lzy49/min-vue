import {
  ArrayToText
} from "./ArrayToText.js";
import {
  TextToText
} from "./TextToText.js";
import {
  TextToArray
} from "./TextToArray.js";
import {
  ArrayToArray
} from "./ArrayToArray.js";
import {
  h,
  createApp
} from "../../lib/guide-min-vue.esm.js";
const App = {
  render() {
    return h('div', {}, [
      h('button', {
        onClick: () => {
          window.change.value = !window.change.value
        }
      }, 'change'),
      // h('h1', {}, 'test update children'),
      // h(TextToText, {}, ''),
      // h(TextToArray, {}, []),
      // h(ArrayToText, {}, []),
      // h(ArrayToArray, {}, []),
      h(ArrayToArray, {}, []),
    ])
  }
}
createApp(App).mount('#root')