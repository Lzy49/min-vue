export * from "./runtime-dom";
export * from './reactivity'
import * as Vue from './runtime-dom'
import { baseCompile } from './compiler-core/src'
import { registerRuntimeCompiler } from './runtime-dom'
function compileToFunction(template) {
  const { code } = baseCompile(template)
  const render = new Function('Vue', code)(Vue)
  return render;
}

registerRuntimeCompiler(compileToFunction)