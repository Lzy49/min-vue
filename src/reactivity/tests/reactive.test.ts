import { isReactive, reactive } from "../reactive"

describe('reactive', () => {
  test('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(original.foo)
    expect(isReactive(original)).toBe(false)
    expect(isReactive(observed)).toBe(true)
  })
})
