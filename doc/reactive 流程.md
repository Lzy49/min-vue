# reactive 流程
## reactive 与 effect 配合使用
### reactive 
reactive 定义一个 被代理值，
- get 收集依赖
- set 通知依赖
### effect 
定义一个作用域。在这个作用域中使用到 reactive 定义的值时会 会将 effect 收集到 这个 reactive 值的依赖list中。
## 具体流程
### 收集
1. 定义一个 effect 接收一个函数，
2. effect 将该函数赋值给 `fn` 。并执行该函数。
3. 在执行函数的过程中碰到了 reactive 变量。
   1. 获取了该变量的值。
   2. 在获取值的时候，触发了 reactive 所定义代理的 get
      1. 在 get 中，判定`fn` 是否为null
      2. 不为 null 将 `fn` 存档给了该变量的响应map中。
      3. 否则不做处理（ effect 外被调用）
4. effect 执行函数结束后，`fn` 变量被设置为 null。
### 通知
1. 在修改 reactive 变量某个值时，会促发该变量代理的 set。
2. 在 set 中 
   1. 修改变量值。
   2. 对该变量响应map进行遍历 执行。
      1. 在执行的过程中会将依赖相应值的变量重新赋值。
      2. 同时也同样会促发 reactive 变量代理的get，但是因为 fn 是空 ，所以不对其进行存档。
   3. 返回修改后的值。
3. 运行结束