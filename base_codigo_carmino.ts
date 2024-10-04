/*
 * <E> ::= <T> { ("+" | "-") <T>}
 * <T> ::= <F> { ("*" | "/") <F>}
 * <F> ::= <N> | <V> | "(" <E> ")"
 * <N> ::= [0-9]
 * <V> ::= [a-zA-Z_][a-zA-Z0-9]*
 */

// definir os tokens que serão utilizados no tokenizador
enum TokenType {
  Plus = "+",
  Minus = "-",
  Multiply = "*",
  Divide = "/",
  LeftParen = "(",
  RightParen = ")",
  Number = "NUMBER",
  Name = "NAME",
  EOF = "EOF",
}

class Token {
  constructor(public type: TokenType, public value: string) {}
}

// o lexer é um analizador lexico
class Lexer {
  private position: number = 0;
  private currentChar: string | null = null;

  constructor(private input: string) {
    // if(input.length > 0){
    //     this.currentChar = input[0];
    // } else {
    //     this.currentChar = null;
    // }
    this.currentChar = input.length > 0 ? input[0] : null;
  }
  //mover para o proximo caracter
  private advance(): void {
    this.position++;
    this.currentChar =
      this.position < this.input.length ? this.input[this.position] : null;
  }
  // ignorar espaço em branco
  private skipWhiteSpace(): void {
    while (this.currentChar !== null && /\s/.test(this.currentChar)) {
      this.advance();
    }
  }
  //ler um número
  private number(): Token {
    let result = "";
    while (this.currentChar !== null && /\d/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.Number, result);
  }
  //Ler uma variavel
  private name(): Token {
    let result = "";
    while (this.currentChar !== null && /[a-zA-Z]/.test(this.currentChar)) {
      result += this.currentChar;
      this.advance();
    }
    return new Token(TokenType.Name, result);
  }
  //Retorna o prxóximo token
  public getNextToken(): Token {
    const operatorTokens: { [key: string]: TokenType } = {
      "+": TokenType.Plus,
      "-": TokenType.Minus,
      "*": TokenType.Multiply,
      "/": TokenType.Divide,
      "(": TokenType.LeftParen,
      ")": TokenType.RightParen,
    };
    while (this.currentChar !== null) {
      if (/\s/.test(this.currentChar)) {
        this.skipWhiteSpace();
        continue;
      }
      if (/\d/.test(this.currentChar)) {
        return this.number();
      }
      if (/[a-zA-Z]/.test(this.currentChar)) {
        return this.name();
      }
      if (operatorTokens[this.currentChar]) {
        const token = new Token(
          operatorTokens[this.currentChar],
          this.currentChar
        );
        this.advance();
        return token;
      }
      throw new Error(`caracter inválido: ${this.currentChar}`);
    }
    return new Token(TokenType.EOF, "");
  }
}

// definição da AST
interface ASTNode {
  type: string;
  id: number;
}

class ASTNodeCounter {
  private static currentId: number = 0;
  public static getNextId(): number {
    return ++this.currentId;
  }
}

// operações binárias
// operação é (2+3)
class BinaryOpNode implements ASTNode {
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

class NumberNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Number";
}

class NameNode implements ASTNode {
  id: number;
  constructor(public value: string) {
    this.id = ASTNodeCounter.getNextId();
  }
  type = "Name";
}

// parser (Analisador sintático)
class Parser {
  private currentToken!: Token;
  constructor(private lexer: Lexer) {
    this.currentToken = this.lexer.getNextToken();
  }
  private eat(tokenType: TokenType): void {
    if (this.currentToken.type === tokenType) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      throw new Error(
        `token inesperado: ${this.currentToken.type}, esperava ${tokenType}`
      );
    }
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
    throw new Error(`fator invalido: ${token.value}`);
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

  public parse(): ASTNode {
    return this.expr();
  }
}

class ExecutionContext {
  private variables: { [key: string]: number } = {};
  public setVariable(name: string, value: number) {
    this.variables[name] = value;
  }
  public getVariable(name: string): number {
    if (!(name in this.variables)) {
      throw new Error(`Variavel não definida ${name}`);
    }
    return this.variables[name];
  }
}

function executeAST(node: ASTNode, context: ExecutionContext): number {
  if (node instanceof BinaryOpNode) {
    const left = executeAST(node.left, context);
    const right = executeAST(node.right, context);
    return evaluateBinaryOp(node.operator, left, right);
  } else if (node instanceof NumberNode) {
    return parseFloat(node.value);
  } else if (node instanceof NameNode) {
    return context.getVariable(node.value);
  }
  throw new Error(`Nó não suportado pela estrutura`);
}

function evaluateBinaryOp(
  operator: string,
  left: number,
  right: number
): number {
  switch (operator) {
    case "+":
      return left + right; // Soma
    case "-":
      return left - right; // Subtração
    case "*":
      return left * right; // Multiplicação
    case "/":
      if (right === 0) {
        throw new Error("Divisão por zero."); // Lança erro se tentar dividir por zero
      }
      return left / right; // Divisão
    default:
      throw new Error(`Operador não suportado: ${operator}`); // Lança erro se o operador não for suportado
  }
}

try {
    const input = " a + b * (c-3) /2"; 
    const lexer = new Lexer(input); 
    const parser = new Parser( lexer); 
    const ast = parser.parse();

    const context = new ExecutionContext(); 
    context.setVariable("a", 5); 
    context.setVariable("b", 10); 
    context.setVariable("c", 8);
    
    const result = executeAST(ast, context);

    console.log(`O resultado da expressa ${input} é ${result}` );

} catch (error) {
    console.error("Erro durante a execução");
    console.error(error.message)
}
