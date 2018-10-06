declare function require(name: string): any;
var readline = require('readline-sync');

export class Poo {
    public static cin(text: string): string {
        //ret urn prompt(text);
        return readline.question(text);
    }

    public static cout(value: any) {
        //return alert(text);
        return console.log(value);
    }

    public static vet2str<T>(prefix: string, vet: Array<T>, separador: string): string {
        let saida = prefix;
        for (let elem of vet)
            saida + "" + elem + separador;
        return saida;
    }

    public static map2vet<T>(mapa: Map<string, T>): Array<T> {
        let vet = new Array<T>();
        for (let elem of mapa.values())
            vet.push(elem);

        return vet;
    }
}

