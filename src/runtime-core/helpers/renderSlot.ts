import { createVnode } from '../createVnode'
export const renderSlot = (slots, key, props) => {
  if (slots[key]) {
    return createVnode('div', {}, slots[key](props));
  }
}