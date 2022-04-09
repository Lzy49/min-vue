import { isReadonly, readonly, isProxy } from '../reactive'
describe('readonly', () => {
  test('happy path', () => {
    const raw = { foo: 1, bar: { foo: 1 } }
    const wrapped = readonly(raw)
    expect(wrapped).not.toBe(raw)
    expect(wrapped.bar.foo).toBe(1)
    expect(isReadonly(wrapped)).toBe(true)
    expect(isReadonly(raw)).toBe(false)
    expect(isReadonly(wrapped.bar)).toBe(true)
    expect(isProxy(wrapped)).toBe(true)
  })
  test('warn then call set', () => {
    console.warn = jest.fn(); // 创建为 jest fn 函数
    const user = readonly({ name: '张小二' })
    user.name = '刘大鹅'
    expect(console.warn).toBeCalled(); // 判断该函数是否被调用
  })
})