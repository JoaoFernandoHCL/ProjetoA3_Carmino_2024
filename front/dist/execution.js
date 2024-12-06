"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionContext = void 0;
exports.executeAST = executeAST;
// executions.ts
const ast_nodes_1 = require("./ast-nodes");
const utils_1 = require("./utils");
class ExecutionContext {
    constructor() {
        this.variables = {};
        this.printResults = []; // Para armazenar resultados de impressão
    }
    setVariable(name, value) {
        this.variables[name] = value;
    }
    getVariable(name) {
        if (!(name in this.variables)) {
            throw new Error(`Variable "${name}" is not defined.`);
        }
        return this.variables[name];
    }
}
exports.ExecutionContext = ExecutionContext;
function executeAST(node, context) {
    if (node instanceof ast_nodes_1.BinaryOpNode) {
        const left = executeAST(node.left, context);
        const right = executeAST(node.right, context);
        return (0, utils_1.evaluateBinaryOp)(node.operator, left, right);
    }
    else if (node instanceof ast_nodes_1.NumberNode) {
        return parseFloat(node.value);
    }
    else if (node instanceof ast_nodes_1.NameNode) {
        return context.getVariable(node.value);
    }
    else if (node instanceof ast_nodes_1.StringNode) {
        return node.value;
    }
    else if (node instanceof ast_nodes_1.AssignmentNode) {
        const value = executeAST(node.value, context);
        context.setVariable(node.name.value, value);
        return value;
    }
    else if (node instanceof ast_nodes_1.IfNode) {
        const conditionResult = executeAST(node.condition, context);
        if (conditionResult) {
            return executeAST(node.thenBranch, context);
        }
        else if (node.elseBranch) {
            return executeAST(node.elseBranch, context);
        }
    }
    else if (node instanceof ast_nodes_1.WhileNode) {
        let conditionResult = executeAST(node.condition, context);
        let doResult = 0;
        while (conditionResult) {
            doResult = executeAST(node.doBranch, context);
            conditionResult = executeAST(node.condition, context);
        }
        return doResult;
    }
    else if (node instanceof ast_nodes_1.ConditionalNode) {
        const left = executeAST(node.left, context);
        const right = executeAST(node.right, context);
        return (0, utils_1.evaluateCondition)(node.operator, left, right) ? 1 : 0;
        ;
    }
    else if (node instanceof ast_nodes_1.PrintNode) {
        const print = executeAST(node.print, context);
        console.log("Executando PrintNode:", print);
        const result = (0, utils_1.createPrintStatement)(print);
        if (!context.printResults) {
            context.printResults = []; // Inicializa se não existir
        }
        context.printResults.push(result); // Adiciona o valor impresso
        return result;
    }
    throw new Error("Unsupported AST node.");
}
