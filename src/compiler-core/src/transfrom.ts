import { NODE_TYPE } from "./ast";
import { TO_DISPLAY_STRING, CREATE_ELEMENT_BLOCK } from "./runtimeHelpers";

export function transform(root, options = {}) {
  const context = createTransfromContext(root, options)

  // 1. 递归 root 找到要修改的节点
  // 2. 为节点 content 增加 'min-vue'
  traverseNode(root, context)
  createRootCodegen(root, context);
  // 将 收集到的 需要增加的 vue 依赖推到 ast 上给 codegen 处理
  root.helpers.push(...context.helpers.values())
}
// 利用插件处理每一点
function traverseNode(node: any, context) {
  // 变化点 抽离为插件
  const exitFns = []
  context.nodeTransforms.forEach(fn => {
    const exitFn = fn(node,context) 
    exitFn && exitFns.push(exitFn)
  })

  // 稳定点 处理子节点
  // 根据不同类型处理节点
  switch (node.type) {
    case NODE_TYPE.INTERPOLATION:
      // 当 template 中有插值行，则需要添加 Vue TO_DISPLAY_STRING 依赖。
      context.helper(TO_DISPLAY_STRING);
      break;
    case NODE_TYPE.ELEMENT:
    case NODE_TYPE.ROOT:
      traverseChildren(node, context);
      break;
  }
  exitFns.forEach(item=>item())
}
function traverseChildren(node: any, context) {
  const children = node.children;
  if (Array.isArray(children)) {
    children.forEach(item => traverseNode(item, context));
  }
}

function createTransfromContext(root, options) {
  // 
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Set(),
    helper: (helper) => {
      context.helpers.add(helper)
    }
  };
  return context
}

function createRootCodegen(root: any, context: { root: any; nodeTransforms: any; }) {
  const child = root.children[0];
  root.codegenNode = child

  if (child.type === NODE_TYPE.ELEMENT && child.codegenNode) {
    const codegenNode = child.codegenNode;
    root.codegenNode = codegenNode;
  } else {
    root.codegenNode = child;
  }
}

