// executions.ts
import {
  ASTNode,
  BinaryOpNode,
  NumberNode,
  NameNode,
  AssignmentNode,
  IfNode,
  WhileNode,
  ConditionalNode,
  PrintNode,
  StringNode,
} from "./ast-nodes";
import { createPrintStatement, evaluateBinaryOp, evaluateCondition } from "./utils";

export class ExecutionContext {
  private variables: { [key: string]: number } = {};

  public printResults: string[] = []; // Para armazenar resultados de impressão

  public setVariable(name: string, value: number) {
    this.variables[name] = value;
  }

  public getVariable(name: string): number {
    if (!(name in this.variables)) {
      throw new Error(`Variable "${name}" is not defined.`);
    }
    return this.variables[name];
  }
}

export function executeAST(node: ASTNode, context: ExecutionContext): any {
  if (node instanceof BinaryOpNode) {
    const left = executeAST(node.left, context);
    const right = executeAST(node.right, context);
    return evaluateBinaryOp(node.operator, left, right);
  } else if (node instanceof NumberNode) {
    return parseFloat(node.value);
  } else if (node instanceof NameNode) {
    return context.getVariable(node.value);
  } else if (node instanceof StringNode) {
    return node.value;
  } else if (node instanceof AssignmentNode) {
    const value = executeAST(node.value, context);
    context.setVariable(node.name.value, value);
    return value;
  } else if (node instanceof IfNode) {
    const conditionResult = executeAST(node.condition, context);
    if (conditionResult) {
      for (let instruction of node.thenBranch) {
        executeAST(instruction, context);
      }
      return conditionResult;
    } else if (node.elseBranch) {
      return executeAST(node.elseBranch, context);
    }
  } else if (node instanceof WhileNode) {
    let conditionResult = executeAST(node.condition, context);
    let doResult = 0;
    while (conditionResult) {
      for (let instruction of node.doBranch) {
        executeAST(instruction, context);
      }
      conditionResult = executeAST(node.condition, context);
      doResult++;
    }
    return doResult;
  } else if (node instanceof ConditionalNode) {
    const left = executeAST(node.left, context);
    const right = executeAST(node.right, context);
    return evaluateCondition(node.operator, left, right) ? 1 : 0;;
  } else if (node instanceof PrintNode) {
    const print = executeAST(node.print, context);
    console.log("Executando PrintNode:", print);
    const result = createPrintStatement(print);
    if (!context.printResults) {
      context.printResults = []; // Inicializa se não existir
    }
    context.printResults.push(result); // Adiciona o valor impresso
    return result;
  } 

  throw new Error("Unsupported AST node.");
}
