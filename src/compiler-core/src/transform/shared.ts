
import { NODE_TYPE } from "../ast"
export const isText = ({ type }) => type === NODE_TYPE.TEXT || type === NODE_TYPE.INTERPOLATION