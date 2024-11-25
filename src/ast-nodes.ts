// arquivo: ast-nodes.ts
export interface ASTNode {
    type: string;
    id: number;
  }
  
//implementação da condição
//exemplo: < a == b >
export class ConditionalNode implements ASTNode{
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
    public thenBranch: ASTNode,
    public elseBranch: ASTNode | null = null
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "if";
}

//implementação do While
// while <condição> do <execuçao laço> <;>
export class WhileNode implements ASTNode {
  id: number;
  constructor(
    public condition: ASTNode,
    public doBranch: ASTNode
  ) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "while";
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

//implementação do assignment
//exemplo: a = b
  export class AssignmentNode implements ASTNode {
    id: number;
    constructor(public name: NameNode, public value: ASTNode) {
      this.id = ASTNodeCounter.getNextId();
    }
    type = "Assignment";
  }
  
  class ASTNodeCounter {
    private static currentId: number = 0;
    public static getNextId(): number {
      return ++this.currentId;
    }
  }
  