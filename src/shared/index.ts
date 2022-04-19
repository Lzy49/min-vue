export const extend = Object.assign
export const isObject = (value: any) => value !== null && typeof value === 'object'
export const hasChange = (value, newValue) => !Object.is(value, newValue);
export const hasOwn = (state, key) => Object.prototype.hasOwnProperty.call(state, key) // Reflect.has(state, key)  //key in state

// add -> Add
export const capitalize = (str: string) => str ? str[0].toLocaleUpperCase() + str.slice(1) : ''
// on-add -> onAdd
export const camelize = (str: string) => str ? str.replace(/-(\w)/g, (_, c: string) => c ? c.toUpperCase() : '') : '';
// add ->onAdd
export const toHandlerKey = (str: string) => str ? 'on' + capitalize(str) : '';