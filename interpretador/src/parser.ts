// parser.ts
import { Token, TokenType, Lexer } from "./lexer";
import { BinaryOpNode, NumberNode, NameNode, AssignmentNode, ASTNode, IfNode, ConditionalNode, WhileNode, StringNode, PrintNode } from "./ast-nodes";

export class Parser {
  private currentToken!: Token;

  constructor(private readonly lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken();
  }

  private eat(tokenType: TokenType): void {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(
        `Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`
      );
    }
  }

  private condicao(): ASTNode {
    let node = this.termoBool();
    while (
      this.currentToken.type === TokenType.OR
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new ConditionalNode(node, token.value, this.termoBool());
    }
    return node;
  }

  private termoBool(): ASTNode {
    let node = this.fatorBool();
    while (
      this.currentToken.type === TokenType.AND
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new ConditionalNode(node, token.value, this.fatorBool());
    }
    return node;
  }

  private fatorBool(): ASTNode {
    const left = this.expr();
    if (this.currentToken.type === TokenType.EqualsEquals) {
      this.eat(TokenType.EqualsEquals);
      const right = this.expr();
      return new ConditionalNode(left, "==", right);
    } else if (this.currentToken.type === TokenType.NotEquals) {
      this.eat(TokenType.NotEquals);
      const right = this.expr();
      return new ConditionalNode(left, "!=", right);
    } else if (this.currentToken.type === TokenType.More) {
      this.eat(TokenType.More);
      const right = this.expr();
      return new ConditionalNode(left, ">", right);
    } else if (this.currentToken.type === TokenType.MoreEquals) {
      this.eat(TokenType.MoreEquals);
      const right = this.expr();
      return new ConditionalNode(left, ">=", right);
    } else if (this.currentToken.type === TokenType.Less) {
      this.eat(TokenType.Less);
      const right = this.expr();
      return new ConditionalNode(left, "<", right);
    } else if (this.currentToken.type === TokenType.LessEquals) {
      this.eat(TokenType.LessEquals);
      const right = this.expr();
      return new ConditionalNode(left, "<=", right);
    }
    return left;
  }

  private declaracao_se(): ASTNode {
    this.eat(TokenType.If);
    this.eat(TokenType.LeftParen);
    const condition = this.condicao(); // Parse da condição
    this.eat(TokenType.RightParen);
    this.eat(TokenType.LeftKey);
    const thenBranch = this.bloco_instrucoes(); // Parse do bloco `declaração`
    this.eat(TokenType.RightKey);

    let elseBranch = null;
    if (this.currentToken.type === TokenType.Else) {
      this.eat(TokenType.Else);
      elseBranch = this.declaracao(); // Parse do bloco `else`
    }

    return new IfNode(condition, thenBranch, elseBranch);
  }

  private declaracao_enquanto(): ASTNode {
    this.eat(TokenType.While);
    this.eat(TokenType.LeftParen);
    const condition = this.condicao(); // Parse da condição
    this.eat(TokenType.RightParen);
    this.eat(TokenType.LeftKey);
    const doBranch = this.bloco_instrucoes(); // Parse do bloco de instruções
    this.eat(TokenType.RightKey);

    return new WhileNode(condition, doBranch);
  }

  //implementação do print
  private declaracao_print(): ASTNode {
    this.eat(TokenType.Print);
    this.eat(TokenType.LeftParen);
    const print = this.expr(); // Parse do print
    this.eat(TokenType.RightParen);
    this.eat(TokenType.Semicolon);

    return new PrintNode(print);
  }


  private fator(): ASTNode {
    const token = this.currentToken;
    if (token.type === TokenType.Number) {
      this.eat(TokenType.Number);
      return new NumberNode(token.value);
    } else if (token.type === TokenType.Name) {
      this.eat(TokenType.Name);
      return new NameNode(token.value);
    } else if (token.type === TokenType.String) {
      this.eat(TokenType.String);
      return new StringNode(token.value);
    } else if (token.type === TokenType.LeftParen) {
      this.eat(TokenType.LeftParen);
      const node = this.expr();
      this.eat(TokenType.RightParen);
      return node;
    }
    throw new Error(`Fator inválido: ${token.value}`);
  }

  private termo(): ASTNode {
    let node = this.fator();
    while (
      this.currentToken.type === TokenType.Multiply ||
      this.currentToken.type === TokenType.Divide
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.fator());
    }
    return node;
  }

  private expr(): ASTNode {
    let node = this.termo();
    while (
      this.currentToken.type === TokenType.Plus ||
      this.currentToken.type === TokenType.Minus
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.termo());
    }
    return node;
  }

  private atribuicao(): ASTNode {
    const variableToken = this.currentToken;
    this.eat(TokenType.Name);
    this.eat(TokenType.Equals);
    const exprNode = this.expr();
    this.eat(TokenType.Semicolon);
    return new AssignmentNode(new NameNode(variableToken.value), exprNode);
  }

  public declaracao(): ASTNode {
    if (this.currentToken.type === TokenType.If) {
      return this.declaracao_se();
    } else if (this.currentToken.type === TokenType.While) {
      return this.declaracao_enquanto();
    } else if (this.currentToken.type === TokenType.Name) {
      const nextToken = this.lexer.lookAhead();
      if (nextToken.type === TokenType.Equals) {
        return this.atribuicao();
      }
    } else if (this.currentToken.type === TokenType.Print) {
      return this.declaracao_print();
    }
    return this.expr();
  }

  //bloco de instruções
  public bloco_instrucoes(): ASTNode[] {
    const instructions: ASTNode[] = [];
    while (
      this.currentToken.type !== TokenType.RightKey &&
      this.currentToken.type !== TokenType.EOF
    ) {
      instructions.push(this.declaracao());
    }
    return instructions;
  }

 

  public parse(): ASTNode {
    const node = this.declaracao();
    console.log("AST gerada:", JSON.stringify(node, null, 2));
  
    return node;
  }
}

