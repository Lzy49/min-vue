import {
  ref,
  h
} from "../../lib/guide-min-vue.esm.js"
// ABC -> ABCD
function abcTOabcd() {
  return {
    prevChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
    ],
    nextChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
    ]
  }
}
// CDE -> ABCDE
function bcdToabcd() {
  return {
    prevChildren: [
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
      h("p", {
        key: "E"
      }, "E"),
    ],
    nextChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
      h("p", {
        key: "E"
      }, "E"),    ]
  }
}
// ABCD -> BCD
function abcdTobcd() {
  return {
    nextChildren: [
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
    ],
    prevChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
    ]
  }
}
// ABCD -> ABC
function abcdToabc() {
  return {
    nextChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
    ],
    prevChildren: [
      h("p", {
        key: "A"
      }, "A"),
      h("p", {
        key: "B"
      }, "B"),
      h("p", {
        key: "C"
      }, "C"),
      h("p", {
        key: "D"
      }, "D"),
    ]
  }
}

const test = [
  abcTOabcd, // ABC -> ABCD 尾部 + 1
  bcdToabcd, // BCD -> ABCD 首部 + 1
  abcdTobcd, // ABCD -> BCD 首部 - 1
  abcdToabc, // ABCD -> ABC 尾部 - 1
]
const {
  prevChildren,
  nextChildren
} = test[2]();

export const ArrayToArray = {
  name: 'ArrayToArray',
  setup() {
    const change = ref(false)
    window.change = change;
    return {
      change,
      setChage: () => {
        change.value = !change.value;
      }
    }
  },
  render() {
    return h('div', {}, this.change ? nextChildren : prevChildren)
  }
}