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
    condicao() {
        let node = this.termoBool();
        while (this.currentToken.type === lexer_1.TokenType.OR) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.ConditionalNode(node, token.value, this.termoBool());
        }
        return node;
    }
    termoBool() {
        let node = this.fatorBool();
        while (this.currentToken.type === lexer_1.TokenType.AND) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.ConditionalNode(node, token.value, this.fatorBool());
        }
        return node;
    }
    fatorBool() {
        const left = this.expr();
        if (this.currentToken.type === lexer_1.TokenType.EqualsEquals) {
            this.eat(lexer_1.TokenType.EqualsEquals);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, "==", right);
        }
        else if (this.currentToken.type === lexer_1.TokenType.NotEquals) {
            this.eat(lexer_1.TokenType.NotEquals);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, "!=", right);
        }
        else if (this.currentToken.type === lexer_1.TokenType.More) {
            this.eat(lexer_1.TokenType.More);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, ">", right);
        }
        else if (this.currentToken.type === lexer_1.TokenType.MoreEquals) {
            this.eat(lexer_1.TokenType.MoreEquals);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, ">=", right);
        }
        else if (this.currentToken.type === lexer_1.TokenType.Less) {
            this.eat(lexer_1.TokenType.Less);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, "<", right);
        }
        else if (this.currentToken.type === lexer_1.TokenType.LessEquals) {
            this.eat(lexer_1.TokenType.LessEquals);
            const right = this.expr();
            return new ast_nodes_1.ConditionalNode(left, "<=", right);
        }
        return left;
    }
    declaracao_se() {
        this.eat(lexer_1.TokenType.If);
        this.eat(lexer_1.TokenType.LeftParen);
        const condition = this.condicao(); // Parse da condição
        this.eat(lexer_1.TokenType.RightParen);
        this.eat(lexer_1.TokenType.LeftKey);
        const thenBranch = this.bloco_instrucoes(); // Parse do bloco `declaração`
        this.eat(lexer_1.TokenType.RightKey);
        let elseBranch = null;
        if (this.currentToken.type === lexer_1.TokenType.Else) {
            this.eat(lexer_1.TokenType.Else);
            elseBranch = this.declaracao(); // Parse do bloco `else`
        }
        return new ast_nodes_1.IfNode(condition, thenBranch, elseBranch);
    }
    declaracao_enquanto() {
        this.eat(lexer_1.TokenType.While);
        this.eat(lexer_1.TokenType.LeftParen);
        const condition = this.condicao(); // Parse da condição
        this.eat(lexer_1.TokenType.RightParen);
        this.eat(lexer_1.TokenType.LeftKey);
        const doBranch = this.bloco_instrucoes(); // Parse do bloco de instruções
        this.eat(lexer_1.TokenType.RightKey);
        return new ast_nodes_1.WhileNode(condition, doBranch);
    }
    //implementação do print
    declaracao_print() {
        this.eat(lexer_1.TokenType.Print);
        this.eat(lexer_1.TokenType.LeftParen);
        const print = this.expr(); // Parse do print
        this.eat(lexer_1.TokenType.RightParen);
        this.eat(lexer_1.TokenType.Semicolon);
        return new ast_nodes_1.PrintNode(print);
    }
    fator() {
        const token = this.currentToken;
        if (token.type === lexer_1.TokenType.Number) {
            this.eat(lexer_1.TokenType.Number);
            return new ast_nodes_1.NumberNode(token.value);
        }
        else if (token.type === lexer_1.TokenType.Name) {
            this.eat(lexer_1.TokenType.Name);
            return new ast_nodes_1.NameNode(token.value);
        }
        else if (token.type === lexer_1.TokenType.String) {
            this.eat(lexer_1.TokenType.String);
            return new ast_nodes_1.StringNode(token.value);
        }
        else if (token.type === lexer_1.TokenType.LeftParen) {
            this.eat(lexer_1.TokenType.LeftParen);
            const node = this.expr();
            this.eat(lexer_1.TokenType.RightParen);
            return node;
        }
        throw new Error(`Fator inválido: ${token.value}`);
    }
    termo() {
        let node = this.fator();
        while (this.currentToken.type === lexer_1.TokenType.Multiply ||
            this.currentToken.type === lexer_1.TokenType.Divide) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.BinaryOpNode(node, token.value, this.fator());
        }
        return node;
    }
    expr() {
        let node = this.termo();
        while (this.currentToken.type === lexer_1.TokenType.Plus ||
            this.currentToken.type === lexer_1.TokenType.Minus) {
            const token = this.currentToken;
            this.eat(token.type);
            node = new ast_nodes_1.BinaryOpNode(node, token.value, this.termo());
        }
        return node;
    }
    atribuicao() {
        const variableToken = this.currentToken;
        this.eat(lexer_1.TokenType.Name);
        this.eat(lexer_1.TokenType.Equals);
        const exprNode = this.expr();
        this.eat(lexer_1.TokenType.Semicolon);
        return new ast_nodes_1.AssignmentNode(new ast_nodes_1.NameNode(variableToken.value), exprNode);
    }
    declaracao() {
        if (this.currentToken.type === lexer_1.TokenType.If) {
            return this.declaracao_se();
        }
        else if (this.currentToken.type === lexer_1.TokenType.While) {
            return this.declaracao_enquanto();
        }
        else if (this.currentToken.type === lexer_1.TokenType.Name) {
            const nextToken = this.lexer.lookAhead();
            if (nextToken.type === lexer_1.TokenType.Equals) {
                return this.atribuicao();
            }
        }
        else if (this.currentToken.type === lexer_1.TokenType.Print) {
            return this.declaracao_print();
        }
        return this.expr();
    }
    //bloco de instruções
    bloco_instrucoes() {
        const instructions = [];
        while (this.currentToken.type !== lexer_1.TokenType.RightKey &&
            this.currentToken.type !== lexer_1.TokenType.EOF) {
            instructions.push(this.declaracao());
        }
        return instructions;
    }
    parse() {
        const node = this.declaracao();
        console.log("AST gerada:", JSON.stringify(node, null, 2));
        return node;
    }
}
exports.Parser = Parser;
