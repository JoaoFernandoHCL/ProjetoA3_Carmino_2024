// arquivo: ast-nodes.ts
export interface ASTNode {
  type: string;
  id: number;
}

//implementação da condição
//exemplo: < a == b >
export class ConditionalNode implements ASTNode {
  id: number;
  constructor(
    public left: ASTNode,
    public operator: string,
    public right: ASTNode
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Conditional";
}

//implementação do IF
//exemplo: if <condição> then <execução verdadeiro> else <execução falso><;>
export class IfNode implements ASTNode {
  id: number;
  constructor(
    public condition: ASTNode,
    public thenBranch: ASTNode[],
    public elseBranch: ASTNode | null = null
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "If";
}

//implementação do While
// while <condição> do <execuçao laço> <;>
export class WhileNode implements ASTNode {
  id: number;
  constructor(
    public condition: ASTNode,
    public doBranch: ASTNode[]
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "While";
}

//implementação do Print
// print (<expresssão>) <;>
export class PrintNode implements ASTNode {
  id: number;
  constructor(
    public print: ASTNode
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Print";
}

//implementação da operação binária
//exemplo: a + b
export class BinaryOpNode implements ASTNode {
  id: number;
  constructor(
    public left: ASTNode,
    public operator: string,
    public right: ASTNode
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "BinaryOp";
}

export class NumberNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Number";
}

export class NameNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Name";
}

export class StringNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "String";
}

//implementação do assignment
//exemplo: a = b
export class AssignmentNode implements ASTNode {
  id: number;
  constructor(public name: NameNode, public value: ASTNode) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Assignment";
}

/*
export class BlockNode implements ASTNode {
  id: number;
  constructor(
    public instructions: ASTNode[]
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Block";
}
*/

class ASTNodeCounter {
  private static currentId: number = 0;
  public static getNextId(): number {
    return ++this.currentId;
  }
}
