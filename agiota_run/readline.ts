declare function require(name: string): any;
var readline = require('readline-sync');

export function input(texto: string): string{
    return readline.question(texto);
}

export function print(value: any) {
    return console.log(value);
}

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