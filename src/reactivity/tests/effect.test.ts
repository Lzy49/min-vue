import { reactive } from '../reactive'
import { effect, stop } from '../effect'
describe('effect', () => {
  test('happy path', () => {
    // 初始化
    // 定义 user 为响应值 -> 定义 nextAge 为一个普通值 -> 在 effect 中使用 user 相应值，促发 user 的 getter -> user getter 收集该 effect 
    const user = reactive({
      age: 10
    })
    let nextAge = 0;
    effect(() => {
      nextAge = user.age + 1;
    })
    expect(nextAge).toBe(11)

    // 更新
    // user 响应值发生改变 -> 促发 user 响应值的 setter -> setter 变量值后 通知 effect -> effect 进行执行 -> nextAge 发生改变。
    user.age++;
    expect(nextAge).toBe(12)
  })
  test('should return runner when call effect', () => {
    //调用 effect 返回一个 function 该 function 调 fn 返回 fn 的 return 值
    let foo = 10;
    let runner = effect(() => {
      foo++
      return "foo"
    })
    expect(foo).toBe(11)
    const r = runner();
    expect(r).toBe('foo')
    expect(foo).toBe(12)
  })
  test('scheduler', () => {
    // effect 第二个参数给一个 scheduler 的 fn
    // effect 第一次执行时，执行 fn
    // 第二次呗响应时，执行 scheduler
    // 执行 runner 再次执行 fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo
    }, {
      scheduler
    })
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1)
    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run();
  })
  test('stop', () => {
    let dummy;
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop + 1
    })
    obj.prop = 2; 
    expect(dummy).toBe(3)
    stop(runner)
    // 要对 值 ++ 进行一个单独的处理
    // 因为 ++ 的操作是 obj.prop = obj.prop + 1 ; 
    // 其中 obj.prop + 1 又调用了一次 get 造成新的依赖收集。
    obj.prop++
    console.log(obj.prop,dummy)
    expect(dummy).not.toBe(4)
    runner()
    expect(dummy).toBe(4)
  })
  test('onstop', () => {
    let obj = reactive({
      foo: 1
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(
      () => {
        dummy = obj.prop + 1
      }, {
        onStop
      }
    )
    stop(runner)
    expect(onStop).toHaveBeenCalledTimes(1)
  })
})