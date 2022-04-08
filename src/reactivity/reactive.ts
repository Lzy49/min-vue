
import { reactiveHandler, readonlyHandler } from './baceHandlers'
export const ReactiveFlags = {
  IS_REACTIVE: Symbol(),
  IS_READONLY: Symbol(),
}
export const reactive = (raw: any) => {
  return new Proxy(raw, reactiveHandler)
}
export const readonly = (raw: any) => {
  return new Proxy(raw, readonlyHandler)
}
export const isReadonly = (value: any) => {
  return !!value[ReactiveFlags.IS_READONLY]
}
export const isReactive = (value: any) => {
  return !!value[ReactiveFlags.IS_REACTIVE]
}