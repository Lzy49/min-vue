import { NODE_TYPE } from "./ast";
const delimiter = [
  "{{",
  "}}"
]
export const baseParse = (template: string) => {
  const context = createParserContext(template)
  return createRoot(paseChildren(context))
}

function paseChildren(context): any {
  const nodes = [];
  // context
  if(context.source.startsWith(delimiter[0])){
    nodes.push(paseInterpolation(context))
  }
  return nodes
}
function createParserContext(template: string): { source: string } {
  return {
    source: template as string
  }
}
function createRoot(children) {
  return {
    children
  }
}

function paseInterpolation(context) {
  const startDelimiter = delimiter[0]
  const endDelimiter = delimiter[1]
  // 先推到开始分隔符后
  advanceBy(context, startDelimiter.length)
  const endIndex = context.source.indexOf(endDelimiter);
  // 截取 content
  const rawContent = context.source.slice(0, endIndex);
  const content = rawContent.trim();
  // 再推到结束分隔符后
  advanceBy(context, endIndex + endDelimiter.length)
  // 返回
  return {
    type: NODE_TYPE.INTERPOLATION,
    content: {
      type: NODE_TYPE.SIMPLE_EXPRESSION,
      content
    }
  }
}

function advanceBy(context: any, index: number) {
  context.source = context.source.slice(index);
}

