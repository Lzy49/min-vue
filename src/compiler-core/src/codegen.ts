import { NODE_TYPE } from "./ast";
import { isString } from '../../shared'
import { helperNameMap, TO_DISPLAY_STRING, CREATE_ELEMENT_BLOCK } from './runtimeHelpers'
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
  const context = {
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperNameMap[key]}`;
    },
  }
  return context
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
    case NODE_TYPE.ELEMENT:
      genElement(node, context);
      break;
    case NODE_TYPE.TEXT:
      genText(node, context);
      break;
    case NODE_TYPE.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context);
    default:
  }
}
function genElement(node, context) {
  const { tag, props, children } = node;

  context.push(context.helper(CREATE_ELEMENT_BLOCK))
  context.push('(')

  genNodeList(genNullableArgs([tag, props, children]), context);

  context.push(`)`);

}
function genInterpolation(node, context) {
  context.push(context.helper(TO_DISPLAY_STRING))
  context.push('(')
  genNode(node.content, context)
  context.push(')')
}
function genCompoundExpression(node: any, context: any) {
  const { push } = context;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isString(child)) {
      push(child);
    } else {
      genNode(child, context);
    }
  }
}
function genExpression(node, context) {
  context.push(node.content)
}

function genText(node, context) {
  context.push(`'${node.content}'`)
}

function genNodeList(nodes: any, context: any) {
  const { push } = context;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (isString(node)) {
      push(`${node}`);
    } else {
      genNode(node, context);
    }
    // node 和 node 之间需要加上 逗号(,)
    // 但是最后一个不需要 "div", [props], [children]
    if (i < nodes.length - 1) {
      push(", ");
    }
  }
}

function genNullableArgs(args) {
  let i = args.length - 1
  // 去掉多余的参数
  for (; i >= 0; i--) {
    // 说明是 null
    if (args[i]) {
      break
    }
  }
  // 将空参转换为null
  return args.slice(0, i + 1).map((arg) => arg || "null");
}