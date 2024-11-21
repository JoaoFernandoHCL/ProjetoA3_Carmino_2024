"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateBinaryOp = evaluateBinaryOp;
exports.evaluateCondition = evaluateCondition;
// utils.ts
function evaluateBinaryOp(operator, left, right) {
    switch (operator) {
        case "+":
            return left + right;
        case "-":
            return left - right;
        case "*":
            return left * right;
        case "/":
            if (right === 0) {
                throw new Error("Division by zero.");
            }
            return left / right;
        default:
            throw new Error(`Operador não suportado: ${operator}`);
    }
}
function evaluateCondition(operator, left, right) {
    switch (operator) {
        case "==":
            return left === right;
        case "!=":
            return left != right;
        case "<":
            return left < right;
        case ">":
            return left > right;
        case "<=":
            return left <= right;
        case ">=":
            return left >= right;
        default:
            throw new Error(`Operador condicional não suportado: ${operator}`);
    }
}
