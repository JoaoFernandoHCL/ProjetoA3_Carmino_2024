// index.ts
//import * as fs from "fs";
import { interpretProgram } from "./interpreter";

export function main(input: any) {
  try {
    // Ler o conteúdo do arquivo .prg
    //const input = fs.readFileSync("programa.prg", "utf8");

    // Passa o conteúdo para o interpretador executar
    let resultado;
    resultado = interpretProgram(input);
    console.log("Print: ", resultado);
    return resultado;
    
    
  } catch (error) {
    console.error("Erro durante a leitura do arquivo:");
    console.error(error);
  }
}

//main();
