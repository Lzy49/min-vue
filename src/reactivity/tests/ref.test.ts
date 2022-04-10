import { effect } from "../effect"
import { isRef, ref, unRef } from '../ref'
import { reactive } from '../reactive'
describe('ref', () => {
  test('happy path', () => {
    const value = ref(10)
    expect(value.value).toBe(10)
  })
  test('should be reactive', () => {
    const value = ref(1)
    let calls = 0;
    let dependValue = 0;
    effect(() => {
      calls++
      dependValue = value.value
    })
    expect(calls).toBe(1)
    expect(dependValue).toBe(1)
    // 响应式
    value.value = 2
    expect(dependValue).toBe(2)
    expect(calls).toBe(2)
    // 如果值相同 ，则不执行effect
    value.value = 2;
    expect(calls).toBe(2)
    expect(dependValue).toBe(2)
  })
  test("should make nested properties reactive", () => {
    const value = ref({
      foo: 10
    })
    let bar = 0;
    let calls = 0;
    effect(() => {
      calls++
      bar = value.value.foo;
    })
    value.value.foo = 20
    expect(bar).toBe(20)
    expect(calls).toBe(2)
    value.value.foo = 20
    expect(bar).toBe(20)
  })
  it("isRef", () => {
    const a = ref(1);
    const user = reactive({
      age: 1,
    });
    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(user)).toBe(false);
  });

  it("unRef", () => {
    const a = ref(1);
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });
})