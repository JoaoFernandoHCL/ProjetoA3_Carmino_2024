// interpreter.ts
import { Lexer, TokenType } from "./lexer";
import { Parser } from "./parser";
import { ExecutionContext, executeAST } from "./execution";
import { BinaryOpNode, NumberNode, IfNode, WhileNode } from "./ast-nodes";

// Função para converter um nó da AST em JSON
function astNodeToJson(node: any): any {
  if (!node) return null;

  if (node instanceof BinaryOpNode) {
    return {
      type: 'BinaryOpNode',
      operator: node.operator,
      left: astNodeToJson(node.left),
      right: astNodeToJson(node.right)
    };
  }


  if (node instanceof NumberNode) {
    return {
      type: 'NumberNode',
      value: node.value
    };
  }
/*
  if (node instanceof IfNode) {
    return {
      type: 'IfNode',
      condition: astNodeToJson(node.condition),
      thenBranch: astNodeToJson(node.thenBranch),
      elseBranch: astNodeToJson(node.elseBranch)
    };
  }
*/
  /* 
  //While node
  if (node instanceof WhileNode) {
    return {
      type: 'WhileNode',
      condition: astNodeToJson(node.condition),
      doBranch: astNodeToJson(node.doBranch)
    };
  }
    */


  // Caso existam outros tipos de nós, eles devem ser tratados aqui
  return {
    type: 'UnknownNode',
    details: node
  };
}




// Função para interpretar o conteúdo do programa
export function interpretProgram(input: string) {
  try {
    const context = new ExecutionContext();
    const lexer = new Lexer(input);
    const parser = new Parser(lexer);

    const astNodes = [];

    while (lexer.lookAhead().type !== TokenType.EOF) {
      const astNode = parser.parse();
      astNodes.push(astNodeToJson(astNode));
      console.log("ast node ", astNode)
      executeAST(astNode, context); 
    }

    // Exibir o JSON da AST
    const astJson = JSON.stringify(astNodes, null, 2);
    // console.log("AST em JSON:");
    // console.log(astJson);

    // Exibir o resultado final de todas as variáveis armazenadas no contexto
    console.log("Valores das variáveis:");
    for (const [name, value] of Object.entries(context['variables'])) {
      console.log(`${name}: ${value}`);
    }

    //return astJson;
    // Transforma os resultados em objetos com {type: "print", value: ...}
    const formattedResults = context.printResults.map(result => ({
      type: "print",
      value: result,
    }));

    // Converte o array em uma string JSON formatada
    const jsonString = JSON.stringify(formattedResults, null, 2); // null e 2 para identação

    return jsonString;
  } catch (error) {
    console.error("Erro durante a execução:");
    console.error(error);
  }
}

