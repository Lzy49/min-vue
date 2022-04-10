export const extend = Object.assign
export const isObject = (value: any) => value !== null && typeof value === 'object'
export const hasChange = (value, newValue) => !Object.is(value, newValue);