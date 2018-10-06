
declare function require(name: string): any;
var readline = require('readline-sync');

export function cout(value: any){
    return console.log(value);
}

export function cin(text: string): string{
    return readline.question(text);
}
