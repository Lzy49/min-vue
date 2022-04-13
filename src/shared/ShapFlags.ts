
export const enum ShapFlags {
  ELEMENT = 1, // 0001
  STATEFUL_COMPONENT = 1 << 1, // 0010
  TEXT_CHILDREN = 1 << 2, // 0100
  ARRAY_CHILDREN = 1 << 3, // 1000
}

// 逻辑
// 对象选择 -> 位运算
// 0000 
// 0001 -> element
// 0010 -> stateful_component
// 0100 -> text_children
// 1000 -> array_children
// | 两位都为 0 才为 0
// ShapFlags 思想
// 1. 设置 固定值。
// 2. 查找 判断是否属于该类型
// 通过 key value 可实现 但不够高效
// 通过 位运算方式 解决

// & 两位都为 1 才为 1
// 修改 利用 | 来 执行 返回 1 否则返回 0 
// - 0000 | 0001 -> 0001
// - 0001 | 0001 -> 0000
// 查找 利用 & 来 执行 
// - 0001 & 0001 -> 0001
// - 0010 & 0001 -> 0000
// 通过 位运算 来处理 性能更高
// 位运算来处理问题虽然性能高，但是可读性差。在开发时，应使用可读性高的方式实现。后头再进行重构来提高性能。
// Vue 使用 ShapFlags 的方式 来给 每个虚拟节点增加了多个类型，在后面点对点的对比时，可以知道 该节点是不是有子节点，子节点类型。该节点类型。
function test() {
  // 通过或运算符设置标签 含义
  const test1 = ShapFlags.STATEFUL_COMPONENT | ShapFlags.TEXT_CHILDREN  // STATEFUL_COMPONENT + TEXT_CHILDREN =  = 0110 完成 
  // 比较上边 test1 是什么标签 
  console.log(test1 & ShapFlags.ELEMENT) // 0
  console.log(test1 & ShapFlags.STATEFUL_COMPONENT) // 2
  console.log(test1 & ShapFlags.TEXT_CHILDREN) // 4
  console.log(test1 & ShapFlags.ARRAY_CHILDREN) // 0
  // 综上可以知道 设置的值 会 > 0 否则会  === 0
}