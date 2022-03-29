# vue 构成模块
- `@vue/compiler-sfc` 负责解析 .vue 文件
- `@vue/compiler-dom` 协助 `@vue/compiler-sfc` 负责将 template 转换成 render 函数
- `@vue/compiler-core` 协助  `@vue/compiler-dom` 
- `@vue/runtime-dom` 负责处理 DOM 
- `@vue/runtime-core` 协助 `@vue/runtime-dom`
- `@vue/reactivity` 负责 vue 响应式
# vue 阶段
vue 分为两个阶段，编译时 和 运行时
## 编译时
### 使用模块
`@vue/compiler-sfc`  `@vue/compiler-dom`  `@vue/compiler-core`
## 运行时
`@vue/runtime-dom` `@vue/runtime-core` `@vue/reactivity`
# vue 包依赖：
- `@vue/compiler-sfc` 依赖 `@vue/compiler-dom` 依赖 `@vue/compiler-core`
- `@vue/runtime-dom` 依赖 `@vue/runtime-core` 依赖 `@vue/reactivity`
# vue 外工具使用 模块情况
## rollup-plugin-vue
`rollup-plugin-vue` 打包工具就是利用了 `@vue/compiler-sfc` ，它可以讲 .vue 文件编译为一个 .js 文件其中：
- template -> render 
- script -> script 变量

