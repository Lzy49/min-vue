import { transform } from '../src/transfrom'
import { baseParse } from '../src/parse'
import { NODE_TYPE } from '../src/ast'
describe('transfrom', () => {
  test('happy path', () => {
    const ast = baseParse('<div>hi,{{message}}</div>')
    transform(ast, {
      nodeTransforms: [
        (node) => {
          if (node.type === NODE_TYPE.TEXT) {
            node.content += 'min-vue'
          }
        }
      ]
    })
    const nodeText = ast.children[0].children[0].content
    expect(nodeText).toBe('hi,min-vue')
  })
})