import { NODE_TYPE } from "./ast";
import { helperNameMap, TO_DISPLAY_STRING } from './runtimeHelpers'
export function generate(ast) {
  // 实现就是拆分
  const context = createCodegenContext();

  genFunctionPreamble(ast, context);
  context.push(`return `);
  const args = ['_ctx', '_cache']
  const argsSignature = args.join(', ')
  const functionName = 'render'
  context.push(`function ${functionName}(${argsSignature}){`)
  context.push(`return `)
  // 处理 ast -> h
  genNode(ast.codegenNode, context)
  context.push(`}`)
  return {
    code: context.code
  }

  function genFunctionPreamble(ast, context) {
    if (ast.helpers.length > 0) {
      const VueBinging = 'Vue'
      const helpersSignature = ast.helpers.map(helper => `${helperNameMap[helper]}: ${context.helper(helper)}`).join(',')
      context.push(`const { ${helpersSignature} } = ${VueBinging};`);
    }
  }
}
// 创建 上下文 
function createCodegenContext() {
  return {
    code: '',
    push(source) {
      this.code += source
    },
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
  }
}
// 处理不同类型 Node
function genNode(node, context) {
  switch (node.type) {
    case NODE_TYPE.INTERPOLATION:
      genInterpolation(node, context);
      break;
    case NODE_TYPE.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break;
    case NODE_TYPE.TEXT:
      genText(node, context);
    default:
  }
}

function genInterpolation(node, context) {
  context.push(context.helper(TO_DISPLAY_STRING))
  context.push('(')
  genNode(node.content, context)
  context.push(')')
}

function genExpression(node, context) {
  context.push(node.content)
}

function genText(node, context) {
  context.push(`'${node.content}'`)
}

