import { reactive } from "../reactive"
import { computed } from '../computed'
describe('computed', () => {
  test('happy path', () => {
    const user = reactive({
      age: 19
    })
    const getter = jest.fn(() => user.age)
    const result = computed(getter)
    // 定义后 getter 不会被立即执行
    expect(getter).not.toHaveBeenCalled();
    expect(result.value).toBe(19)
    expect(getter).toHaveBeenCalledTimes(1)

    // 再次获取也不会执行 getter 只会取 缓冲值
    expect(result.value).toBe(19)
    expect(getter).toHaveBeenCalledTimes(1)

    // 修改依赖以后也不会第一时间更新
    user.age = 20;
    expect(getter).toHaveBeenCalledTimes(1);
    // 在获取时发现数据脏了才会更新
    expect(result.value).toBe(20)
    expect(getter).toHaveBeenCalledTimes(2)
    // 再次获取数据不会更新
    expect(result.value).toBe(20)
    expect(getter).toHaveBeenCalledTimes(2)
  })
})