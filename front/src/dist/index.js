"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
// index.ts
//import * as fs from "fs";
const interpreter_1 = require("./interpreter");
function main(input) {
    try {
        // Ler o conteúdo do arquivo .prg
        //const input = fs.readFileSync("programa.prg", "utf8");
        // Passa o conteúdo para o interpretador executar
        let resultado;
        resultado = (0, interpreter_1.interpretProgram)(input);
        console.log("Print: ", resultado);
        return resultado;
    }
    catch (error) {
        console.error("Erro durante a leitura do arquivo:");
        console.error(error);
    }
}
//main();
