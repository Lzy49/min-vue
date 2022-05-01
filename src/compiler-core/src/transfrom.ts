export function transform(root, options = {}) {
  const context = createTransfromContext(root, options)

  // 1. 递归 root 找到要修改的节点
  // 2. 为节点 content 增加 'min-vue'
  traverseNode(root, context)
  createRootCodegen(root, context);
}

function traverseNode(node: any, context) {
  // 变化点 抽离为插件
  context.nodeTransforms.forEach(fn => {
    fn(node)
  })
  // 稳定点抽离
  traverseChildren(node, context);
}
function traverseChildren(node: any, context) {
  const children = node.children;
  if (Array.isArray(children)) {
    children.forEach(item => traverseNode(item, context));
  }
}

function createTransfromContext(root, options) {
  return {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
}

function createRootCodegen(root: any, context: { root: any; nodeTransforms: any; }) {
  const child = root.children[0];
  root.codegenNode = child
}

