import { transform } from "../src/transfrom"
import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"

describe('codegen',()=>{
  test('happy path',()=>{
    const ast = baseParse('hi')
    transform(ast)
    const {code} = generate(ast)
    expect(code).toMatchSnapshot()
  })
})