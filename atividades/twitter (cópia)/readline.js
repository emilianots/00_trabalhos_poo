"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline-sync');
function cin(texto) {
    return readline.question(texto);
}
exports.cin = cin;
function cout(value) {
    return console.log(value);
}
exports.cout = cout;
/*export function cin(texto: string): string{
    let saida = prompt(texto);
    if(saida)
        return saida;

    else;
        return "";
}
export function cout(value: any) {
    alert(texto);
} */ 
