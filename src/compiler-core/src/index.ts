import { transform } from "../src/transfrom"
import { generate } from "../src/codegen"
import { transformExpression } from '../src/transform/transformExpression'
import { transformText } from '../src/transform/transformText'
import { transformElement } from '../src/transform/transformElement'

import { baseParse } from './parse'
export const baseCompile = (template:string) => {
  const ast = baseParse(template)
  transform(ast, {
    nodeTransforms: [transformExpression, transformText, transformElement,]
  })
  return generate(ast)
}
