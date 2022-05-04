import { NODE_TYPE } from "../ast";
import { CREATE_ELEMENT_BLOCK } from '../runtimeHelpers'

export function transformElement(node, context) {
  if (node.type === NODE_TYPE.ELEMENT) {
    return () => {
      const vnodeTag = `'${node.tag}'`;

      const vnodeProps = null;
      let vnodeChildren = null;
      if (node.children.length > 0) {
        if (node.children.length === 1) {
          const child = node.children[0];
          vnodeChildren = child;
        }
      }
      context.helper(CREATE_ELEMENT_BLOCK)
      node.codegenNode = {
        type: NODE_TYPE.ELEMENT,
        tag: vnodeTag,
        props: vnodeProps,
        children: vnodeChildren
      }
   
    };
  }
}