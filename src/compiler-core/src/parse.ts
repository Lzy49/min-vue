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
  let ancestor = [];
  return createRoot(paseChildren(context, ancestor))
}

function paseChildren(context, ancestor): any {
  const nodes = [];
  while (isEnd(context, ancestor)) {
    let node;
    const source = context.source
    if (source.startsWith(delimiter[0])) {
      node = paseInterpolation(context)
    } else if (source.startsWith('<')) {
      if (/^<[a-z]*/.test(source)) {
        node = paseElement(context, ancestor)
      }
    }
    if (!node) {
      node = paseText(context)
    }
    nodes.push(node)
  }
  return nodes
}
function isEnd(context, ancestor) {
  if (context.source.length <= 0) {
    return false;
  }
  for (let key = ancestor.length - 1; key >= 0; key--) {
    const item = ancestor[key]
    if (context.source.startsWith(`</${item}>`)) {
      if (key !== ancestor.length - 1) {
        throw new Error('span 没有闭合标签')
      }
      return false
    }
  }
  return true
}
function createParserContext(template: string): { source: string } {
  return {
    source: template as string
  }
}
function createRoot(children) {
  return {
    children,
    type: NODE_TYPE.ROOT,
    helpers: []
  }
}

function paseInterpolation(context) {
  const startDelimiter = delimiter[0]
  const endDelimiter = delimiter[1]
  // 先推到开始分隔符后
  advanceBy(context, startDelimiter.length)
  const endIndex = context.source.indexOf(endDelimiter);
  // 截取 content
  const rawContent = paseTextData(context, endIndex);
  const content = rawContent.trim();
  // 再推到结束分隔符后
  advanceBy(context, endDelimiter.length)
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

// 处理因为 缺少闭合报错
// 就是 确定在什么范围内，缺少
// 解决：收集每一层 element 的范围
function paseElement(context: any, ancestor): any {
  // context.source
  // 首先要解析出 tag
  let element: any = parseTag(context, TagType.START);
  ancestor.push(element.tag)
  // 处理子节点
  // element.tag
  element.children = paseChildren(context, ancestor)
  ancestor.pop(element.tag)
  parseTag(context, TagType.END);
  return element
}

function parseTag(context, type: TagType) {
  const result = /^<\/?([a-z]*)/i.exec(context.source)
  // 推推 source 
  advanceBy(context, result[0].length + 1)
  if (type === TagType.END) return;
  const tag = result[1]
  return {
    type: NODE_TYPE.ELEMENT,
    tag
  }
}

function paseText(context: any) {
  const source = context.source
  const endTags = [delimiter[0], '<']
  let endIndex = context.source.length;
  for (let item of endTags) {
    const index = source.indexOf(item);
    if (index !== -1 && source.indexOf(item) < endIndex) {
      endIndex = source.indexOf(item)
    }
  }
  // 1. 取出值
  const content = paseTextData(context, endIndex);
  // 2. 推进
  return {
    type: NODE_TYPE.TEXT,
    content
  }
}

function paseTextData(context: any, length) {
  const content = context.source.slice(0, length);
  // 获取结束
  advanceBy(context, length);
  return content;
}

