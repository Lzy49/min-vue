
import { isReadonly, shallowReadonly } from '../reactive'
describe('shallow', () => {
  test('shallowReadonly', () => {
    //  实现目标 第一层只读，其他层可以随便修改
    const obj = shallowReadonly({ foo: 1, bar: { bar: 1 } })
    expect(isReadonly(obj)).toBe(true)
    expect(isReadonly(obj.bar)).toBe(false)
  })
})