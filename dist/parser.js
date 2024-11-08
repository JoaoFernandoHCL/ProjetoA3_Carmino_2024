"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
// parser.ts
const lexer_1 = require("./lexer");
const ast_nodes_1 = require("./ast-nodes");
class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        }
        else {
            throw new Error(`Unexpected token: ${this.currentToken.type}, expected: ${tokenType}`);
        }
    }
    // conditional
    conditional() {
        const left = this.expr();
        if (this.currentToken.type === lexer_1.TokenType.EqualsEquals) {
            this.eat(lexer_1.TokenType.EqualsEquals);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, "==", right);
        }
        return left;
    }
    // statement if
    ifStatement() {
        this.eat(lexer_1.TokenType.If);
        const condition = this.conditional();
        this.eat(lexer_1.TokenType.Then);
        const thenBranch = this.statement();
        let elseBranch = null;
        if (this.currentToken.type === lexer_1.TokenType.Else) {
            this.eat(lexer_1.TokenType.Else);
            elseBranch = this.statement();
        }
        // Consumir o `;` opcional após o bloco `if` ou `else`
        if (this.currentToken.type === lexer_1.TokenType.Semicolon) {
            this.eat(lexer_1.TokenType.Semicolon);
        }
        return new ast_nodes_1.IfNode(condition, thenBranch, elseBranch);
    }
    factor() {
        const token = this.currentToken;
        if (token.type === lexer_1.TokenType.Number) {
            this.eat(lexer_1.TokenType.Number);
            return new ast_nodes_1.NumberNode(token.value);
        }
        else if (token.type === lexer_1.TokenType.Name) {
            this.eat(lexer_1.TokenType.Name);
            return new ast_nodes_1.NameNode(token.value);
        }
        else if (token.type === lexer_1.TokenType.LeftParen) {
            this.eat(lexer_1.TokenType.LeftParen);
            const node = this.expr();
            this.eat(lexer_1.TokenType.RightParen);
            return node;
        }
        throw new Error(`Fator inválido: ${token.value}`);
    }
    term() {
        let node = this.factor();
        while (this.currentToken.type === lexer_1.TokenType.Multiply ||
            this.currentToken.type === lexer_1.TokenType.Divide) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.BinaryOpNode(node, token.value, this.factor());
        }
        return node;
    }
    expr() {
        let node = this.term();
        while (this.currentToken.type === lexer_1.TokenType.Plus ||
            this.currentToken.type === lexer_1.TokenType.Minus) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.BinaryOpNode(node, token.value, this.term());
        }
        return node;
    }
    assignment() {
        const variableToken = this.currentToken;
        this.eat(lexer_1.TokenType.Name);
        this.eat(lexer_1.TokenType.Equals);
        const exprNode = this.expr();
        this.eat(lexer_1.TokenType.Semicolon);
        return new ast_nodes_1.AssignmentNode(new ast_nodes_1.NameNode(variableToken.value), exprNode);
    }
    statement() {
        if (this.currentToken.type === lexer_1.TokenType.If) {
            return this.statement();
        }
        if (this.currentToken.type === lexer_1.TokenType.Name) {
            const nextToken = this.lexer.lookAhead();
            if (nextToken.type === lexer_1.TokenType.Equals) {
                return this.assignment();
            }
        }
        return this.expr();
    }
    parse() {
        return this.statement();
    }
}
exports.Parser = Parser;
