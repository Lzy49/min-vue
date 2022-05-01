export function generate(ast) {
  // 实现就是拆分
  const context = createCodegenContext();
  const functionName = 'render'
  const args = ['_ctx', '_cache']
  const argsSignature = args.join(', ')
  context.push(`function ${functionName}(${argsSignature}){`)
  // 处理 ast -> h
  getNode(ast, context)
  context.push(`}`)
  return {
    code: context.code
  }
}
// 创建 上下文 
function createCodegenContext() {
  return {
    code: 'return ',
    push(source) {
      this.code += source
    }
  }
}
// 处理不同类型 Node
function getNode(ast, context) {
  const node = ast.codegenNode;
  context.push(`return '${node.content}';`)
}

