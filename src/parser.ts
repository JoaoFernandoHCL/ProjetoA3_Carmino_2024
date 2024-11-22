// parser.ts
import { Token, TokenType, Lexer } from "./lexer";
import { WhileNode, BinaryOpNode, NumberNode, NameNode, AssignmentNode, ASTNode, ConditionalNode, IfNode } from "./ast-nodes";

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

  // conditional
  private  conditional(): ASTNode {
    const left = this.expr();
    if(this.currentToken.type === TokenType.EqualsEquals) {
      this.eat(TokenType.EqualsEquals);
      const right = this.expr();
      return new ConditionalNode(left, "==", right);
    }
    return left;
  }

  // statement if
  private ifStatement(): ASTNode {
    this.eat(TokenType.If);
    const condition = this. conditional();
    this.eat(TokenType.Then);
    const thenBranch = this.statement();

    let elseBranch = null;
    if(this. currentToken.type === TokenType.Else) {
      this.eat(TokenType.Else);
      elseBranch = this.statement();
    }

    // Consumir o `;` opcional após o bloco `if` ou `else`
    if (this.currentToken.type === TokenType.Semicolon) {
      this.eat(TokenType.Semicolon);
    }
  
    return new IfNode(condition, thenBranch, elseBranch);
  }

  //tentativa while
  private whileStatement(): ASTNode {
    this.eat(TokenType.While);             //While
    const condition = this.conditional(); // Analisa a condição do loop
    this.eat(TokenType.Do);               // Bloco de instrução
    const doBranch = this.statement();    
    
    
    if (this.currentToken.type === TokenType.Semicolon) {
      this.eat(TokenType.Semicolon);
    }
  
    return new WhileNode(condition, doBranch);

    //Era pra mudar o execution tbm professor =/ ? 
  }

  private factor(): ASTNode {
    const token = this.currentToken;
    if (token.type === TokenType.Number) {
      this.eat(TokenType.Number);
      return new NumberNode(token.value);
    } else if (token.type === TokenType.Name) {
      this.eat(TokenType.Name);
      return new NameNode(token.value);
    } else if (token.type === TokenType.LeftParen) {
      this.eat(TokenType.LeftParen);
      const node = this.expr();
      this.eat(TokenType.RightParen);
      return node;
    }
    throw new Error(`Fator inválido: ${token.value}`);
  }

  private term(): ASTNode {
    let node = this.factor();
    while (
      this.currentToken.type === TokenType.Multiply ||
      this.currentToken.type === TokenType.Divide
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.factor());
    }
    return node;
  }

  private expr(): ASTNode {
    let node = this.term();
    while (
      this.currentToken.type === TokenType.Plus ||
      this.currentToken.type === TokenType.Minus
    ) {
      const token = this.currentToken;
      this.eat(token.type);
      node = new BinaryOpNode(node, token.value, this.term());
    }
    return node;
  }

  private assignment(): ASTNode {
    const variableToken = this.currentToken;
    this.eat(TokenType.Name);
    this.eat(TokenType.Equals);
    const exprNode = this.expr();
    this.eat(TokenType.Semicolon);
    return new AssignmentNode(new NameNode(variableToken.value), exprNode);
  }

  public statement(): ASTNode {
    if (this.currentToken.type === TokenType.If) {
      return this.statement();
    }
    if (this.currentToken.type === TokenType.Name) {
      const nextToken = this.lexer.lookAhead();
      if (nextToken.type === TokenType.Equals) {
        return this.assignment();
      }
    }
    if (this.currentToken.type === TokenType.While) {
      return this.whileStatement(); // Novo suporte ao loop while
    }
    return this.expr();
  }

  public parse(): ASTNode {
    return this.statement();
  }
}

