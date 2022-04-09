import { isReactive, reactive, isProxy } from "../reactive"

describe('reactive', () => {
  test('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(original.foo)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed)).toBe(true)
    expect(isProxy(observed)).toBe(true)
  })
  test('nested reactive', () => {
    const original = reactive({ foo: 1, bar: { bar: 2 } })
    expect(isReactive(original)).toBe(true)
    expect(isReactive(original.bar)).toBe(true)
  })
})