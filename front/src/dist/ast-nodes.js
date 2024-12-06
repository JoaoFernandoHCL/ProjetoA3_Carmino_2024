"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentNode = exports.StringNode = exports.NameNode = exports.NumberNode = exports.BinaryOpNode = exports.PrintNode = exports.WhileNode = exports.IfNode = exports.ConditionalNode = void 0;
//implementação da condição
//exemplo: < a == b >
class ConditionalNode {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.type = "Conditional";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.ConditionalNode = ConditionalNode;
//implementação do IF
//exemplo: if <condição> then <execução verdadeiro> else <execução falso><;>
class IfNode {
    constructor(condition, thenBranch, elseBranch = null) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
        this.type = "if";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.IfNode = IfNode;
//implementação do While
// while <condição> do <execuçao laço> <;>
class WhileNode {
    constructor(condition, doBranch) {
        this.condition = condition;
        this.doBranch = doBranch;
        this.type = "while";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.WhileNode = WhileNode;
//implementação do Print
// print (<expresssão>) <;>
class PrintNode {
    constructor(print) {
        this.print = print;
        this.type = "print";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.PrintNode = PrintNode;
//implementação da operação binária
//exemplo: a + b
class BinaryOpNode {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
        this.type = "BinaryOp";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.BinaryOpNode = BinaryOpNode;
class NumberNode {
    constructor(value) {
        this.value = value;
        this.type = "Number";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.NumberNode = NumberNode;
class NameNode {
    constructor(value) {
        this.value = value;
        this.type = "Name";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.NameNode = NameNode;
class StringNode {
    constructor(value) {
        this.value = value;
        this.type = "String";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.StringNode = StringNode;
//implementação do assignment
//exemplo: a = b
class AssignmentNode {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.type = "Assignment";
        this.id = ASTNodeCounter.getNextId();
    }
}
exports.AssignmentNode = AssignmentNode;
class ASTNodeCounter {
    static getNextId() {
        return ++this.currentId;
    }
}
ASTNodeCounter.currentId = 0;
