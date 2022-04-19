import { publicInstanceHandlers } from './componentPublicInstance'
import { shallowReadonly } from '../reactivity/reactive'
import { initProps } from './componentProps'
import { initEmit } from './componentEmit'
// 创建组件实例
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    props: {},
    type: vnode.type, // type 就是 Component 在 createVnode 中 创建
    setupState: {}, //   setup 返回的 options
    emit: () => { }
  }
  initEmit(component);
  return component;
}
// 处理 setup 返回值
export function setupComponent(instance) {
  // TODO
  // props,slots,setup
  // 初始化 props 
  initProps(instance, instance.vnode.props);
  // initSlots();

  // 初始化有状态的 Component 
  setupStatefulComponent(instance)
}

// 处理 组件的 option
function setupStatefulComponent(instance) {
  const component = instance.type

  instance.proxy = new Proxy({ _: instance }, publicInstanceHandlers)
  const { setup } = component
  // 处理 setup
  // 在执行 setup 时传入 props 
  const setupResult = setup && setup(shallowReadonly(instance.props), { emit: instance.emit })
  handlerSetupResult(setupResult, instance)
  finishSetupComponent(instance)
}
// 处理 setup 
function handlerSetupResult(setupResult, instance) {
  // setup 可能返回 render 或 state 
  if (typeof setupResult === 'function') {
    // render 
  }
  if (typeof setupResult === 'object') {
    // state
    instance.setupState = setupResult;
  }
}

// 处理 option -> vnode
function finishSetupComponent(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render // 如果 option 中传入了 render 就使用 option 中的 render.
  }
}

