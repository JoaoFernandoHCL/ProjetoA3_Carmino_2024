"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpretProgram = interpretProgram;
// interpreter.ts
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const execution_1 = require("./execution");
const ast_nodes_1 = require("./ast-nodes");
// Função para converter um nó da AST em JSON
function astNodeToJson(node) {
    if (!node)
        return null;
    if (node instanceof ast_nodes_1.BinaryOpNode) {
        return {
            type: 'BinaryOpNode',
            operator: node.operator,
            left: astNodeToJson(node.left),
            right: astNodeToJson(node.right)
        };
    }
    if (node instanceof ast_nodes_1.NumberNode) {
        return {
            type: 'NumberNode',
            value: node.value
        };
    }
    if (node instanceof ast_nodes_1.IfNode) {
        return {
            type: 'IfNode',
            condition: astNodeToJson(node.condition),
            thenBranch: astNodeToJson(node.thenBranch),
            elseBranch: astNodeToJson(node.elseBranch)
        };
    }
    // While node
    if (node instanceof ast_nodes_1.WhileNode) {
        return {
            type: 'WhileNode',
            condition: astNodeToJson(node.condition),
            doBranch: astNodeToJson(node.doBranch)
        };
    }
    // Caso existam outros tipos de nós, eles devem ser tratados aqui
    return {
        type: 'UnknownNode',
        details: node
    };
}
// Função para interpretar o conteúdo do programa
function interpretProgram(input) {
    try {
        const context = new execution_1.ExecutionContext();
        const lexer = new lexer_1.Lexer(input);
        const parser = new parser_1.Parser(lexer);
        const astNodes = [];
        while (lexer.lookAhead().type !== lexer_1.TokenType.EOF) {
            const astNode = parser.parse();
            astNodes.push(astNodeToJson(astNode));
            console.log("ast node ", astNode);
            (0, execution_1.executeAST)(astNode, context);
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
    }
    catch (error) {
        console.error("Erro durante a execução:");
        console.error(error);
    }
}
