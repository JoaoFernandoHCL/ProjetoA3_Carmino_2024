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
    // While node
    else if (node instanceof ast_nodes_1.WhileNode) {
        const conditionResult = executeAST(node.condition, context);
        if (conditionResult) {
            return executeAST(node.doBranch, context);
        }
        else
            return conditionResult;
    }
    else if (node instanceof ast_nodes_1.ConditionalNode) {
        const left = executeAST(node.left, context);
        const right = executeAST(node.right, context);
        return (0, utils_1.evaluateCondition)(node.operator, right, left) ? 1 : 0;
        ;
    }
    throw new Error("Unsupported AST node.");
}
