import { createVnode } from "./createVnode"

export const h = (type, props?, children?) => {
  return createVnode(type, props, children)
}