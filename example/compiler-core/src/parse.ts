import { NODE_TYPE } from "./ast";
const delimiter = [
  "{{",
  "}}"
]
const enum TagType {
  START,
  END,
}
export const baseParse = (template: string) => {
  const context = createParserContext(template)
  return createRoot(paseChildren(context))
}

function paseChildren(context): any {
  const nodes = [];
  let node;
  const source = context.source
  if (source.startsWith(delimiter[0])) {
    node = paseInterpolation(context)
  } else if (source.startsWith('<')) {
    if (/^<[a-z]*/.test(source)) {
      node = paseElement(context)
    }
  }
  nodes.push(node)
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

function paseElement(context: any): any {
  // context.source
  // 首先要解析出 tag
  let element = parseTag(context, TagType.START);
  parseTag(context, TagType.END);
  return element
}
function parseTag(context, type: TagType) {
  const result = /^<\/?([a-z]*)/i.exec(context.source)
  const tag = result[1]
  // 推推 source 
  advanceBy(context, result[0].length + 1)
  if (type === TagType.END) return;
  return {
    type: NODE_TYPE.ELEMENT,
    tag
  }
}

