import { baseParse } from '../src/parse'
import { NODE_TYPE } from '../src/ast'
describe('Parse', () => {
  describe('interpolation 插值', () => {
    test('simple interpolation', () => {
      const ast = baseParse("{{   message   }}")
      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPE.INTERPOLATION,
        content: {
          type: NODE_TYPE.SIMPLE_EXPRESSION,
          content: "message",
        }
      })
    })
  })
  describe('element', () => {
    test('simple element div', () => {
      const ast = baseParse("<div></div>")
      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPE.ELEMENT,
        tag: 'div',
        children: []
      })
    })
  })
  describe('text', () => {
    test('simple text', () => {
      const ast = baseParse("some text")
      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPE.TEXT,
        content: 'some text'
      })
    })
  })
  test('hello world', () => {
    const ast = baseParse("<div>hi,{{message}}</div>")
    expect(ast.children[0]).toStrictEqual({
      type: NODE_TYPE.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NODE_TYPE.TEXT,
          content: 'hi,'
        },
        {
          type: NODE_TYPE.INTERPOLATION,
          content: {
            type: NODE_TYPE.SIMPLE_EXPRESSION,
            content: "message"
          }
        }
      ]
    })
  })
  test('next children', () => {
    const ast = baseParse("<div><p>hi</p>{{message}}</div>")
    expect(ast.children[0]).toStrictEqual({
      type: NODE_TYPE.ELEMENT,
      tag: 'div',
      children: [
        {
          type: NODE_TYPE.ELEMENT,
          tag: 'p',
          children: [
            {
              type: NODE_TYPE.TEXT,
              content: 'hi'
            },
          ]
        },
        {
          type: NODE_TYPE.INTERPOLATION,
          content: {
            type: NODE_TYPE.SIMPLE_EXPRESSION,
            content: "message"
          }
        }
      ]
    })
  })
  test.only('should throw error when lack end tag',()=>{
    expect(()=>{
      baseParse("<div><span></div>")
    }).toThrow('span 没有闭合标签')
  })
})