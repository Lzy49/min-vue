// 创建组件实例
export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type // type 就是 Component 在 createVnode 中 创建
  }
  return component;
}
// 处理 setup 返回值
export function setupComponent(instance) {
  // TODO
  // props,slots, setup
  // initProps();
  // initSlots();

  // 初始化有状态的 Component 
  setupStatefulComponent(instance)
}

// 处理 组件的 option
function setupStatefulComponent(instance) {
  const component = instance.type.setup();
  const { setup } = component
  // 处理 setup
  const setupResult = setup || setup()
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
  if( component.render){
    instance.render = component.render // 如果 option 中传入了 render 就使用 option 中的 render.
  }
}

