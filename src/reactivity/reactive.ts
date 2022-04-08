
import { reactiveHandler, readonlyHandler } from './baceHandlers'
export const reactive = (raw: any) => {
  return new Proxy(raw, reactiveHandler)
}
export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandler)
}