import {
  createApp
} from '../../lib/guide-min-vue.esm.js'
import {
  App
} from "./App.js";

const rootContainer = document.querySelector("#app");
createApp(App).mount(rootContainer);