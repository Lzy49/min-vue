import { ReactiveEffect } from './effect'
class ComputedImpl {
  #value
  #setter
  #runner
  #dirty: boolean = true;
  constructor(getter, setter?) {
    this.#value
    this.#setter = setter || (() => { });
    this.#runner = new ReactiveEffect(getter, () => {
      this.#dirty = true;
    })
  }
  get value() {
    // 缓冲
    if (this.#dirty) {
      this.#value = this.#runner.run();
      this.#dirty = false;
    }
    return this.#value
  }
  set value(val) {
    this.#setter(val)
  }
}
export const computed = (option) => new ComputedImpl(option)