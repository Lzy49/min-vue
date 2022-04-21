import {
  createApp
} from './render.js'
export const game = new PIXI.Application({
  width: 500,
  height: 500,
});
document.body.append(game.view);
import App from './app.js'
createApp(App).mount(game.stage)