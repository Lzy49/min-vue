import { transform } from "../src/transfrom"
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transformExpression } from '../src/transform/transformExpression'
describe('codegen', () => {
  test('happy path', () => {
    const ast = baseParse('hi')
    transform(ast)
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
  test('interpolation happy path', () => {
    const ast = baseParse('{{message}}')
    transform(ast, {
      nodeTransforms: [transformExpression]
    })
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
})