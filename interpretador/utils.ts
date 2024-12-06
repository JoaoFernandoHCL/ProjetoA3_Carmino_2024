// utils.ts
export function evaluateBinaryOp(
  operator: string,
  left: number,
  right: number
): number {
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

export function evaluateCondition(
  operator: string,
  left: number,
  right: number
): boolean {
  switch(operator){
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
    case "||":
      if (left===1 || right===1) {
        return true;
      } else return false;
    case "&&":
      if (left===1 && right===1 ) {
        return true;
      } else return false;

    default:
      throw new Error(`Operador condicional não suportado: ${operator}`);
  }
}

//método para o print
export function createPrintStatement(value: any): string {
  return value.toString(); 
}
