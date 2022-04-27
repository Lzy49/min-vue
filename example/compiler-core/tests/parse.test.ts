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
          content: "message"
        }
      })
    })
  })
  describe('element', () => {
    test('simple element div', () => {
      const ast = baseParse("<div></div>")
      expect(ast.children[0]).toStrictEqual({
        type: NODE_TYPE.ELEMENT,
        tag: 'div'
      })
    })
  })
})