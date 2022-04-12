import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
export default {
  input: './src/index.ts', // 入口
  output: [ // 出口 
    {
      format: "cjs",
      file: 'lib/guide-min-vue.cjs.js'
    },
    {
      format: "es",
      file: 'lib/guide-min-vue.esm.js'
    }
  ],
  plugins: [
    typescript(), // 编译ts 
    commonjs(),
  ]
}