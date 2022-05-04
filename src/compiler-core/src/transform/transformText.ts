import { NODE_TYPE } from '../ast'
import { isText } from './shared'
export const transformText = (node, context) => {
  // 判断el类型，该类型的子节点需要处理
  if (node.type === NODE_TYPE.ELEMENT) {
    const children = node.children;
    return () => {
      for (let i = 0; i < children.length; i++) {
        const item = children[i]
        // 如果子节点是 文本类型则需要进行转换。
        if (isText(item)) {
          let currentContainer;
          for (let j = i + 1; j < children.length; j++) {
            // 如果相邻的节点不是一个 文本则不需要进行处理
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[i] = {
                  type: NODE_TYPE.COMPOUND_EXPRESSION,
                  children: [item],
                };
              }
              currentContainer.children.push(` + `, next);
              // 把当前的节点放到容器内, 然后删除掉j
              children.splice(j, 1);
              // 因为把 j 删除了，所以这里就少了一个元素，那么 j 需要 --
              j--;
            } else {
              break;
            }
          }
        }
      }
    }
  }

}