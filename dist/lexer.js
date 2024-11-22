"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.Token = exports.TokenType = void 0;
// Definição de Tokens e Lexer (Tokenizador)
// lexer.ts
var TokenType;
(function (TokenType) {
    TokenType["Plus"] = "+";
    TokenType["Minus"] = "-";
    TokenType["Multiply"] = "*";
    TokenType["Divide"] = "/";
    TokenType["LeftParen"] = "(";
    TokenType["RightParen"] = ")";
    TokenType["LeftKey"] = "{";
    TokenType["RightKey"] = "}";
    TokenType["Number"] = "NUMBER";
    TokenType["Name"] = "NAME";
    TokenType["Equals"] = "=";
    TokenType["Semicolon"] = ";";
    TokenType["EOF"] = "EOF";
    TokenType["EqualsEquals"] = "==";
    TokenType["NotEquals"] = "!=";
    TokenType["More"] = ">";
    TokenType["MoreEquals"] = ">=";
    TokenType["Less"] = "<";
    TokenType["LessEquals"] = "<=";
    TokenType["If"] = "IF";
    TokenType["Else"] = "ELSE";
    TokenType["Then"] = "THEN";
    TokenType["While"] = "WHILE";
    TokenType["Do"] = "DO";
    TokenType["AND"] = "&&";
    TokenType["OR"] = "||";
})(TokenType || (exports.TokenType = TokenType = {}));
class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
exports.Token = Token;
class Lexer {
    constructor(input) {
        this.input = input;
        this.position = 0;
        this.currentChar = null;
        this.currentChar = input.length > 0 ? input[0] : null;
    }
    advance() {
        this.position++;
        this.currentChar =
            this.position < this.input.length ? this.input[this.position] : null;
    }
    skipWhitespace() {
        while (this.currentChar !== null && /\s/.test(this.currentChar)) {
            this.advance();
        }
    }
    number() {
        let result = "";
        while (this.currentChar !== null && /[0-9]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token(TokenType.Number, result);
    }
    name() {
        let result = "";
        while (this.currentChar !== null &&
            /[a-zA-Z_][a-zA-Z0-9_]*/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        // identificação da estrutura de decisão if
        if (result === "if")
            return new Token(TokenType.If, result);
        if (result === "else")
            return new Token(TokenType.Else, result);
        if (result === "then")
            return new Token(TokenType.Then, result);
        // identificação da estrutura do while
        if (result === "while")
            return new Token(TokenType.While, result);
        if (result === "do")
            return new Token(TokenType.Do, result);
        return new Token(TokenType.Name, result);
    }
    getNextToken() {
        const operatorTokens = {
            "+": TokenType.Plus,
            "-": TokenType.Minus,
            "*": TokenType.Multiply,
            "/": TokenType.Divide,
            "(": TokenType.LeftParen,
            ")": TokenType.RightParen,
            "{": TokenType.LeftKey,
            "}": TokenType.RightKey,
            "=": TokenType.Equals,
            ";": TokenType.Semicolon,
            "==": TokenType.EqualsEquals,
            "!=": TokenType.NotEquals,
            ">": TokenType.More,
            ">=": TokenType.MoreEquals,
            "<": TokenType.Less,
            "<=": TokenType.LessEquals,
            "&&": TokenType.AND,
            "||": TokenType.OR,
        };
        let auxCharacter = "";
        while (this.currentChar !== null) {
            if (/\s/.test(this.currentChar)) {
                this.skipWhitespace();
                continue;
            }
            if (/[0-9]/.test(this.currentChar)) {
                return this.number();
            }
            if (/[a-zA-Z_]/.test(this.currentChar)) {
                return this.name();
            }
            if (this.currentChar === "=") {
                this.advance();
                // Implementação da igualdade comparativa
                if (this.currentChar === "=") {
                    this.advance();
                    return new Token(TokenType.EqualsEquals, "==");
                }
                // Implementação da igualdade 
                return new Token(TokenType.Equals, "=");
            }
            if (this.currentChar === '>') {
                this.advance();
                auxCharacter = "";
                if (this.currentChar != null) {
                    auxCharacter = this.currentChar;
                }
                if (auxCharacter === '=') {
                    this.advance();
                    return new Token(TokenType.MoreEquals, ">=");
                }
                return new Token(TokenType.More, ">");
            }
            if (this.currentChar === '<') {
                this.advance();
                auxCharacter = "";
                if (this.currentChar != null) {
                    auxCharacter = this.currentChar;
                }
                if (auxCharacter === '=') {
                    this.advance();
                    return new Token(TokenType.LessEquals, "<=");
                }
                return new Token(TokenType.Less, "<");
            }
            if (this.currentChar === '!') {
                this.advance();
                auxCharacter = "";
                if (this.currentChar != null) {
                    auxCharacter = this.currentChar;
                }
                if (auxCharacter === '=') {
                    this.advance();
                    return new Token(TokenType.NotEquals, "!=");
                }
            }
            if (this.currentChar === "|") {
                this.advance();
                if (this.currentChar === "|") {
                    this.advance();
                    return new Token(TokenType.LessEquals, "||");
                }
            }
            if (this.currentChar === "&") {
                this.advance();
                if (this.currentChar === "&") {
                    this.advance();
                    return new Token(TokenType.LessEquals, "&&");
                }
            }
            if (operatorTokens[this.currentChar]) {
                const token = new Token(operatorTokens[this.currentChar], this.currentChar);
                this.advance();
                return token;
            }
            throw new Error(`Invalid character: ${this.currentChar}`);
        }
        return new Token(TokenType.EOF, "");
    }
    lookAhead() {
        const currentPos = this.position;
        const token = this.getNextToken();
        this.position = currentPos;
        this.currentChar = this.input[this.position] || null;
        return token;
    }
}
exports.Lexer = Lexer;
