import { camelize, toHandlerKey } from "../shared";

export const initEmit = (instance) => {
  instance.emit = (event, ...ags) => {
    const { props } = instance;
    return props[camelize(toHandlerKey(event))](...ags)
  }
}
