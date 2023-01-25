import { Header1 } from "../language-server/generated/ast";

export interface AstNode {
  accept(v: CodeGenerationVisitor): any
}

export class CodeGenerationVisitor {
  visitHeader1(h: Header1) {
    return (`<h1>${h.content}</h1>`)
  }
}